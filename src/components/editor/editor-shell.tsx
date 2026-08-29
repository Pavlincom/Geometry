"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GeometryCanvas } from "./geometry-canvas";
import { useEditorStore } from "@/lib/editor-store";
import { createClient } from "@/lib/supabase/client";

const AXES = [
  { label: "X", axis: 0 as const },
  { label: "Y", axis: 1 as const },
  { label: "Z", axis: 2 as const },
];

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function EditorShell() {
  const points = useEditorStore((state) => state.points);
  const edges = useEditorStore((state) => state.edges);
  const selectedIds = useEditorStore((state) => state.selectedIds);
  const connectSelected = useEditorStore((state) => state.connectSelected);
  const updateSelectedAxis = useEditorStore((state) => state.updateSelectedAxis);
  const deleteSelected = useEditorStore((state) => state.deleteSelected);
  const reset = useEditorStore((state) => state.reset);

  const [title, setTitle] = useState("Untitled structure");
  const [artworkId, setArtworkId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState("");

  const selectedPoint = selectedIds.length === 1 ? points.find((point) => point.id === selectedIds[0]) : undefined;

  useEffect(() => {
    setSaveStatus((current) => (current === "saved" ? "idle" : current));
  }, [points, edges, title]);

  async function saveArtwork() {
    setSaveStatus("saving");
    setSaveError("");

    try {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      let userId = sessionData.session?.user.id;

      if (!userId) {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) throw error;
        userId = data.user?.id;
      }

      if (!userId) {
        throw new Error("Could not create a Geometry user session.");
      }

      const document = {
        user_id: userId,
        title: title.trim() || "Untitled structure",
        dimension: 3,
        points,
        edges,
        updated_at: new Date().toISOString(),
      };

      if (artworkId) {
        const { error } = await supabase
          .from("artworks")
          .update(document)
          .eq("id", artworkId)
          .eq("user_id", userId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("artworks")
          .insert(document)
          .select("id")
          .single();

        if (error) throw error;
        setArtworkId(data.id);
      }

      setSaveStatus("saved");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not save this structure.";
      setSaveError(message);
      setSaveStatus("error");
    }
  }

  return (
    <main className="editor-page">
      <header className="editor-header">
        <Link className="brand" href="/">GEOMETRY°</Link>
        <div className="editor-title">
          <input
            aria-label="Structure title"
            maxLength={80}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <span>
            {saveStatus === "saving" && "• Saving"}
            {saveStatus === "saved" && "• Saved"}
            {saveStatus === "error" && "• Save failed"}
            {saveStatus === "idle" && "• Draft"}
          </span>
        </div>
        <div className="editor-header-actions">
          <button className="ghost-button" type="button" onClick={reset}>Reset</button>
          <button className="studio-button" type="button" disabled={saveStatus === "saving"} onClick={saveArtwork}>
            {saveStatus === "saving" ? "Saving…" : artworkId ? "Save changes" : "Save"}
          </button>
        </div>
      </header>

      <section className="editor-layout">
        <aside className="tool-rail" aria-label="Studio tools">
          <div className="tool active">●<span>Points</span></div>
          <div className="tool">╱<span>Edges</span></div>
          <div className="tool">◇<span>Forms</span></div>
          <div className="tool disabled">4D<span>Next</span></div>
        </aside>

        <div className="canvas-wrap">
          <GeometryCanvas />
          <div className="canvas-hint"><strong>Double-click</strong> the grid to add a point · drag to orbit · scroll to zoom</div>
          <div className="dimension-badge">3D / XYZ</div>
          {saveStatus === "error" && <div className="save-error">{saveError}</div>}
        </div>

        <aside className="inspector">
          <div className="inspector-section">
            <p className="eyebrow">Structure</p>
            <div className="stats-row"><span>Points</span><strong>{points.length}</strong></div>
            <div className="stats-row"><span>Connections</span><strong>{edges.length}</strong></div>
            {artworkId && <div className="stats-row"><span>Cloud</span><strong>Saved</strong></div>}
          </div>

          <div className="inspector-section">
            <p className="eyebrow">Selection</p>
            {selectedIds.length === 0 && <p className="muted">Select one point to edit it, or two points to create a connection.</p>}
            {selectedIds.length === 2 && (
              <>
                <p className="muted">Two points selected.</p>
                <button className="wide-action" type="button" onClick={connectSelected}>Connect points</button>
              </>
            )}
            {selectedPoint && (
              <div className="coordinate-panel">
                {AXES.map(({ label, axis }) => (
                  <label key={label}>
                    <span>{label}</span>
                    <input
                      type="number"
                      step="0.1"
                      value={selectedPoint.position[axis]}
                      onChange={(event) => updateSelectedAxis(axis, Number(event.target.value))}
                    />
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="inspector-section inspector-bottom">
            <button className="danger-action" type="button" disabled={selectedIds.length === 0} onClick={deleteSelected}>Delete selection</button>
          </div>
        </aside>
      </section>
    </main>
  );
}
