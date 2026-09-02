"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CameraPreset, CameraRequest, GeometryCanvas } from "./geometry-canvas";
import { MeasurementPanel } from "./measurement-panel";
import styles from "./editor-controls.module.css";
import { GeometryEdge, GeometryPoint, PrimitiveKind, useEditorStore } from "@/lib/editor-store";
import { createClient } from "@/lib/supabase/client";

const AXES = [
  { label: "X", axis: 0 as const },
  { label: "Y", axis: 1 as const },
  { label: "Z", axis: 2 as const },
];

const PRIMITIVES: Array<{ kind: PrimitiveKind; label: string; mark: string }> = [
  { kind: "cube", label: "Cube", mark: "□" },
  { kind: "tetrahedron", label: "Tetra", mark: "△" },
  { kind: "octahedron", label: "Octa", mark: "◇" },
  { kind: "star", label: "Star", mark: "✦" },
];

const CAMERA_VIEWS: Array<{ preset: CameraPreset; label: string }> = [
  { preset: "fit", label: "Fit" },
  { preset: "iso", label: "Iso" },
  { preset: "top", label: "Top" },
  { preset: "front", label: "Front" },
  { preset: "right", label: "Right" },
];

type SaveStatus = "idle" | "saving" | "saved" | "error";
type LoadStatus = "idle" | "loading" | "error";

type EditorShellProps = {
  initialArtworkId?: string | null;
};

function isGeometryPointArray(value: unknown): value is GeometryPoint[] {
  return Array.isArray(value) && value.every((point) => {
    if (!point || typeof point !== "object") return false;
    const candidate = point as Partial<GeometryPoint>;
    return (
      typeof candidate.id === "string" &&
      Array.isArray(candidate.position) &&
      candidate.position.length === 3 &&
      candidate.position.every((coordinate) => typeof coordinate === "number")
    );
  });
}

function isGeometryEdgeArray(value: unknown): value is GeometryEdge[] {
  return Array.isArray(value) && value.every((edge) => {
    if (!edge || typeof edge !== "object") return false;
    const candidate = edge as Partial<GeometryEdge>;
    return typeof candidate.id === "string" && typeof candidate.a === "string" && typeof candidate.b === "string";
  });
}

function formatCoordinate(value: number) {
  const rounded = Math.abs(value) < 0.0005 ? 0 : value;
  return Number(rounded.toFixed(3)).toString();
}

export function EditorShell({ initialArtworkId = null }: EditorShellProps) {
  const points = useEditorStore((state) => state.points);
  const edges = useEditorStore((state) => state.edges);
  const selectedIds = useEditorStore((state) => state.selectedIds);
  const snapToGrid = useEditorStore((state) => state.snapToGrid);
  const historyPast = useEditorStore((state) => state.historyPast);
  const historyFuture = useEditorStore((state) => state.historyFuture);
  const hasClipboard = useEditorStore((state) => state.clipboard !== null);

  const connectSelected = useEditorStore((state) => state.connectSelected);
  const updateSelectedAxis = useEditorStore((state) => state.updateSelectedAxis);
  const insertPrimitive = useEditorStore((state) => state.insertPrimitive);
  const selectAll = useEditorStore((state) => state.selectAll);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const copySelected = useEditorStore((state) => state.copySelected);
  const pasteClipboard = useEditorStore((state) => state.pasteClipboard);
  const duplicateSelected = useEditorStore((state) => state.duplicateSelected);
  const deleteSelected = useEditorStore((state) => state.deleteSelected);
  const loadDocument = useEditorStore((state) => state.loadDocument);
  const reset = useEditorStore((state) => state.reset);
  const toggleSnap = useEditorStore((state) => state.toggleSnap);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);

  const [title, setTitle] = useState("Untitled structure");
  const [artworkId, setArtworkId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState("");
  const [loadStatus, setLoadStatus] = useState<LoadStatus>(initialArtworkId ? "loading" : "idle");
  const [loadError, setLoadError] = useState("");
  const [showForms, setShowForms] = useState(false);
  const [cameraRequest, setCameraRequest] = useState<CameraRequest>({ preset: "iso", version: 0 });
  const skipDirtyEffect = useRef(false);

  const canUndo = historyPast.length > 0;
  const canRedo = historyFuture.length > 0;
  const hasSelection = selectedIds.length > 0;
  const selectedPoint =
    selectedIds.length === 1
      ? points.find((point) => point.id === selectedIds[0])
      : undefined;
  const selectedPoints = selectedIds.flatMap((id) => {
    const point = points.find((candidate) => candidate.id === id);
    return point ? [point] : [];
  });
  const selectionCenter: [number, number, number] | null = selectedPoints.length > 0
    ? (() => {
        let x = 0;
        let y = 0;
        let z = 0;
        selectedPoints.forEach((point) => {
          x += point.position[0];
          y += point.position[1];
          z += point.position[2];
        });
        return [x / selectedPoints.length, y / selectedPoints.length, z / selectedPoints.length];
      })()
    : null;
  const selectionType = selectedIds.length === 0 ? "None" : selectedIds.length === 1 ? "Point" : "Group";

  function requestCamera(preset: CameraPreset) {
    setCameraRequest((current) => ({ preset, version: current.version + 1 }));
  }

  function addPrimitive(kind: PrimitiveKind) {
    insertPrimitive(kind);
    requestCamera("fit");
  }

  useEffect(() => {
    if (skipDirtyEffect.current) {
      skipDirtyEffect.current = false;
      return;
    }
    setSaveStatus((current) => (current === "saved" ? "idle" : current));
  }, [points, edges, title]);

  useEffect(() => {
    if (!initialArtworkId) return;

    let cancelled = false;

    async function loadArtwork() {
      setLoadStatus("loading");
      setLoadError("");

      try {
        const supabase = createClient();
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user.id;

        if (!userId) {
          throw new Error("This saved artwork belongs to a Geometry browser session that is no longer available.");
        }

        const { data, error } = await supabase
          .from("artworks")
          .select("id,title,points,edges")
          .eq("id", initialArtworkId)
          .eq("user_id", userId)
          .single();

        if (error) throw error;
        if (!isGeometryPointArray(data.points) || !isGeometryEdgeArray(data.edges)) {
          throw new Error("This artwork contains geometry data that cannot be opened.");
        }

        if (cancelled) return;

        skipDirtyEffect.current = true;
        loadDocument(data.points, data.edges);
        setTitle(data.title);
        setArtworkId(data.id);
        setSaveStatus("saved");
        setLoadStatus("idle");
        requestCamera("fit");
      } catch (error) {
        if (cancelled) return;
        const message =
          error && typeof error === "object" && "message" in error
            ? String(error.message)
            : "Could not open this saved artwork.";
        setLoadError(message);
        setLoadStatus("error");
      }
    }

    loadArtwork();

    return () => {
      cancelled = true;
    };
  }, [initialArtworkId, loadDocument]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isTyping) return;

      const key = event.key.toLowerCase();

      if (key === "escape") {
        clearSelection();
        return;
      }

      if (key === "delete" || key === "backspace") {
        if (hasSelection) {
          event.preventDefault();
          deleteSelected();
        }
        return;
      }

      const modifier = event.metaKey || event.ctrlKey;
      if (!modifier) return;

      if (key === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      } else if (key === "y") {
        event.preventDefault();
        redo();
      } else if (key === "a") {
        event.preventDefault();
        selectAll();
      } else if (key === "c" && hasSelection) {
        event.preventDefault();
        copySelected();
      } else if (key === "v" && hasClipboard) {
        event.preventDefault();
        pasteClipboard();
      } else if (key === "d" && hasSelection) {
        event.preventDefault();
        duplicateSelected();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    clearSelection,
    copySelected,
    deleteSelected,
    duplicateSelected,
    hasClipboard,
    hasSelection,
    pasteClipboard,
    redo,
    selectAll,
    undo,
  ]);

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
      let message =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Could not save this structure.";

      if (message.toLowerCase().includes("anonymous sign-ins")) {
        message = "Enable Anonymous Sign-Ins in Supabase Auth to save your first structure.";
      } else if (message.toLowerCase().includes("artworks")) {
        message = "The Geometry artworks table is not set up in Supabase yet.";
      }

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
            style={{
              width: 180,
              border: 0,
              borderBottom: "1px solid transparent",
              outline: "none",
              background: "transparent",
              color: "#d6d7d9",
              padding: "4px 6px",
              textAlign: "center",
              fontSize: 12,
            }}
          />
          <span>
            {loadStatus === "loading" && "• Loading"}
            {loadStatus !== "loading" && saveStatus === "saving" && "• Saving"}
            {loadStatus !== "loading" && saveStatus === "saved" && "• Saved"}
            {loadStatus !== "loading" && saveStatus === "error" && "• Save failed"}
            {loadStatus !== "loading" && saveStatus === "idle" && "• Draft"}
          </span>
        </div>
        <div className="editor-header-actions">
          <Link className="ghost-button" href="/artworks">My artworks</Link>
          <button className="ghost-button" type="button" disabled={!canUndo} onClick={undo} title="Undo (Ctrl/Cmd + Z)">Undo</button>
          <button className="ghost-button" type="button" disabled={!canRedo} onClick={redo} title="Redo (Ctrl/Cmd + Shift + Z)">Redo</button>
          <button className="ghost-button" type="button" onClick={reset}>Reset</button>
          <button
            className="studio-button"
            type="button"
            disabled={saveStatus === "saving" || loadStatus === "loading"}
            onClick={saveArtwork}
          >
            {saveStatus === "saving" ? "Saving…" : artworkId ? "Save changes" : "Save"}
          </button>
        </div>
      </header>

      <section className="editor-layout">
        <aside className="tool-rail" aria-label="Studio tools">
          <div className="tool active">●<span>Points</span></div>
          <div className="tool">╱<span>Edges</span></div>
          <button
            className={`tool tool-button ${showForms ? "active" : ""}`}
            type="button"
            aria-pressed={showForms}
            onClick={() => setShowForms((value) => !value)}
            title="Insert geometric forms"
          >
            ◇<span>Forms</span>
          </button>
          <button
            className={`tool tool-button ${snapToGrid ? "active" : ""}`}
            type="button"
            aria-pressed={snapToGrid}
            onClick={toggleSnap}
            title="Toggle 0.5-unit grid snapping"
          >
            ⌗<span>Snap 0.5</span>
          </button>
          <div className="tool disabled">4D<span>Next</span></div>
        </aside>

        <div className="canvas-wrap">
          <GeometryCanvas cameraRequest={cameraRequest} />

          <div className={styles.viewToolbar} aria-label="Camera views">
            {CAMERA_VIEWS.map((view) => (
              <button key={view.preset} type="button" onClick={() => requestCamera(view.preset)}>
                {view.label}
              </button>
            ))}
          </div>

          {showForms && (
            <div className={styles.formsPopover}>
              <div className={styles.formsPopoverHead}>
                <div>
                  <strong>Insert form</strong>
                  <span>Adds and selects a connected structure</span>
                </div>
                <button type="button" aria-label="Close forms" onClick={() => setShowForms(false)}>×</button>
              </div>
              <div className={styles.primitiveGrid}>
                {PRIMITIVES.map((primitive) => (
                  <button key={primitive.kind} type="button" onClick={() => addPrimitive(primitive.kind)}>
                    <span>{primitive.mark}</span>
                    {primitive.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="canvas-hint">
            <strong>B</strong> box-select · <strong>W / E / R</strong> move, rotate, scale · <strong>Ctrl/Cmd + D</strong> duplicate
          </div>
          <div className="dimension-badge">3D / XYZ</div>
          {loadStatus === "loading" && <div className="editor-notice">Loading saved artwork…</div>}
          {loadStatus === "error" && <div className="editor-notice error">{loadError}</div>}
          {saveStatus === "error" && <div className="editor-notice error">{saveError}</div>}
        </div>

        <aside className="inspector" aria-label="Studio inspector">
          <section className={`inspector-section ${styles.inspectorObject}`}>
            <div className={styles.sectionHeading}>
              <div>
                <p className="eyebrow">Object</p>
                <strong>{title.trim() || "Untitled structure"}</strong>
              </div>
              <span className={styles.statusPill}>{artworkId ? "Cloud" : "Draft"}</span>
            </div>
            <div className={styles.objectStats}>
              <div><span>Points</span><strong>{points.length}</strong></div>
              <div><span>Edges</span><strong>{edges.length}</strong></div>
              <div><span>Snap</span><strong>{snapToGrid ? "0.5" : "Off"}</strong></div>
            </div>
          </section>

          <section className="inspector-section">
            <div className={styles.sectionHeading}>
              <div>
                <p className="eyebrow">Selection</p>
                <strong>{selectionType}</strong>
              </div>
              <span className={styles.selectionCount}>{selectedIds.length}</span>
            </div>

            {selectedIds.length === 0 && (
              <p className="muted">Click a point, Shift-click a group, or press B and drag a selection box.</p>
            )}

            {selectedIds.length > 0 && (
              <p className="muted">
                {selectedIds.length === 1
                  ? "One editable point selected."
                  : `${selectedIds.length} points are acting as one transform group.`}
              </p>
            )}

            {selectedIds.length === 2 && (
              <button className="wide-action" type="button" onClick={connectSelected}>
                Connect selected points
              </button>
            )}

            <div className={styles.selectionActions}>
              <button type="button" disabled={!hasSelection} onClick={duplicateSelected} title="Duplicate (Ctrl/Cmd + D)">Duplicate</button>
              <button type="button" disabled={!hasSelection} onClick={copySelected} title="Copy (Ctrl/Cmd + C)">Copy</button>
              <button type="button" disabled={!hasClipboard} onClick={pasteClipboard} title="Paste (Ctrl/Cmd + V)">Paste</button>
              <button type="button" disabled={!hasSelection} onClick={clearSelection} title="Clear selection (Esc)">Clear</button>
            </div>
          </section>

          <section className="inspector-section">
            <div className={styles.sectionHeading}>
              <div>
                <p className="eyebrow">Transform</p>
                <strong>{selectedPoint ? "Point position" : selectionCenter ? "Group center" : "No selection"}</strong>
              </div>
              {hasSelection && <span className={styles.keySequence}>W · E · R</span>}
            </div>

            {!hasSelection && <p className="muted">Select geometry to expose position and transform controls.</p>}

            {selectedPoint && (
              <>
                <p className="muted">Move with the gizmo or type exact XYZ coordinates.</p>
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
              </>
            )}

            {!selectedPoint && selectionCenter && (
              <>
                <p className="muted">Transforms use this shared center. W moves, E rotates and R scales the group.</p>
                <div className={styles.centerGrid}>
                  {AXES.map(({ label, axis }) => (
                    <div key={label}>
                      <span>{label}</span>
                      <strong>{formatCoordinate(selectionCenter[axis])}</strong>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          <section className="inspector-section">
            <p className="eyebrow">Measurements</p>
            <MeasurementPanel variant="embedded" />
          </section>

          <section className="inspector-section">
            <div className={styles.sectionHeading}>
              <div>
                <p className="eyebrow">View</p>
                <strong>Camera</strong>
              </div>
            </div>
            <div className={styles.inspectorButtonGrid}>
              {CAMERA_VIEWS.map((view) => (
                <button key={view.preset} type="button" onClick={() => requestCamera(view.preset)}>
                  {view.label}
                </button>
              ))}
            </div>
            <p className={styles.shortcutHint}>B box select · W/E/R transform · Esc clear · Delete remove</p>
          </section>

          <div className="inspector-section inspector-bottom">
            <button className="danger-action" type="button" disabled={!hasSelection} onClick={deleteSelected}>
              Delete selection
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
