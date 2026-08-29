"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { GeometryEdge, GeometryPoint } from "@/lib/editor-store";
import { createClient } from "@/lib/supabase/client";

type Artwork = {
  id: string;
  title: string;
  dimension: number;
  points: GeometryPoint[];
  edges: GeometryEdge[];
  created_at: string;
  updated_at: string;
};

type LoadState = "loading" | "ready" | "error";

const ljubljanaDateTime = new Intl.DateTimeFormat("sl-SI", {
  timeZone: "Europe/Ljubljana",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function ArtworkPreview({ artwork }: { artwork: Artwork }) {
  const drawing = useMemo(() => {
    if (!artwork.points.length) return null;

    const xs = artwork.points.map((point) => point.position[0]);
    const zs = artwork.points.map((point) => point.position[2]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minZ = Math.min(...zs);
    const maxZ = Math.max(...zs);
    const spanX = Math.max(maxX - minX, 1);
    const spanZ = Math.max(maxZ - minZ, 1);

    const projected = new Map(
      artwork.points.map((point) => [
        point.id,
        {
          x: 10 + ((point.position[0] - minX) / spanX) * 80,
          y: 68 - ((point.position[2] - minZ) / spanZ) * 56,
        },
      ])
    );

    return { projected };
  }, [artwork]);

  if (!drawing) {
    return <div className="artwork-preview empty">Empty coordinate field</div>;
  }

  return (
    <div className="artwork-preview" aria-hidden="true">
      <svg viewBox="0 0 100 78" role="presentation">
        {artwork.edges.map((edge) => {
          const a = drawing.projected.get(edge.a);
          const b = drawing.projected.get(edge.b);
          if (!a || !b) return null;
          return <line key={edge.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
        })}
        {artwork.points.map((point) => {
          const projected = drawing.projected.get(point.id);
          if (!projected) return null;
          return <circle key={point.id} cx={projected.x} cy={projected.y} r="1.7" />;
        })}
      </svg>
    </div>
  );
}

export function ArtworksLibrary() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadArtworks() {
      try {
        const supabase = createClient();
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const userId = sessionData.session?.user.id;
        if (!userId) {
          if (!cancelled) {
            setArtworks([]);
            setMessage("No Geometry browser session yet. Save a structure in the studio to start your collection.");
            setLoadState("ready");
          }
          return;
        }

        const { data, error } = await supabase
          .from("artworks")
          .select("id,title,dimension,points,edges,created_at,updated_at")
          .eq("user_id", userId)
          .order("updated_at", { ascending: false });

        if (error) throw error;
        if (cancelled) return;

        setArtworks((data ?? []) as Artwork[]);
        setLoadState("ready");
      } catch (error) {
        if (cancelled) return;
        setMessage(
          error && typeof error === "object" && "message" in error
            ? String(error.message)
            : "Could not load your saved artworks."
        );
        setLoadState("error");
      }
    }

    loadArtworks();

    return () => {
      cancelled = true;
    };
  }, []);

  async function deleteArtwork(artwork: Artwork) {
    if (!window.confirm(`Delete “${artwork.title}”? This cannot be undone.`)) return;

    setDeletingId(artwork.id);
    setMessage("");

    try {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) throw new Error("Your Geometry session is no longer available.");

      const { error } = await supabase
        .from("artworks")
        .delete()
        .eq("id", artwork.id)
        .eq("user_id", userId);

      if (error) throw error;
      setArtworks((current) => current.filter((item) => item.id !== artwork.id));
    } catch (error) {
      setMessage(
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Could not delete this artwork."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="library-page">
      <header className="site-header library-header">
        <Link className="brand" href="/">GEOMETRY°</Link>
        <nav className="nav-links" aria-label="Collection navigation">
          <Link href="/">Explore</Link>
          <Link className="nav-cta" href="/create">New structure</Link>
        </nav>
      </header>

      <section className="library-hero">
        <div>
          <p className="eyebrow">Personal collection</p>
          <h1>My artworks</h1>
          <p>Your saved coordinate structures, ready to reopen and keep evolving.</p>
        </div>
        <Link className="primary-button" href="/create">Create new ↗</Link>
      </section>

      {loadState === "loading" && <div className="library-state">Loading your geometry…</div>}

      {loadState === "error" && (
        <div className="library-state error">
          <strong>Could not load the collection.</strong>
          <span>{message}</span>
        </div>
      )}

      {loadState === "ready" && artworks.length === 0 && (
        <section className="empty-library">
          <p className="eyebrow">No saved structures</p>
          <h2>Your first point is still waiting.</h2>
          <p>{message || "Open the studio, shape a structure and save it here."}</p>
          <Link className="primary-button" href="/create">Open studio ↗</Link>
        </section>
      )}

      {loadState === "ready" && artworks.length > 0 && (
        <section className="artwork-grid" aria-label="Saved artworks">
          {artworks.map((artwork) => (
            <article className="artwork-card" key={artwork.id}>
              <Link className="artwork-open-area" href={`/create?artwork=${encodeURIComponent(artwork.id)}`}>
                <ArtworkPreview artwork={artwork} />
                <div className="artwork-card-copy">
                  <div className="artwork-card-title-row">
                    <h2>{artwork.title}</h2>
                    <span>{artwork.dimension}D</span>
                  </div>
                  <p className="artwork-meta">
                    {artwork.points.length} points · {artwork.edges.length} connections
                  </p>
                  <p className="artwork-time">Updated {ljubljanaDateTime.format(new Date(artwork.updated_at))}</p>
                </div>
              </Link>
              <div className="artwork-card-actions">
                <Link href={`/create?artwork=${encodeURIComponent(artwork.id)}`}>Open in studio ↗</Link>
                <button
                  type="button"
                  disabled={deletingId === artwork.id}
                  onClick={() => deleteArtwork(artwork)}
                >
                  {deletingId === artwork.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {message && loadState === "ready" && artworks.length > 0 && <div className="library-toast">{message}</div>}
    </main>
  );
}
