import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site/site-header";
import styles from "../site-pages.module.css";

export const metadata: Metadata = {
  title: "Explore geometry",
  description: "A visual atlas of geometry across architecture, science, nature, astronomy, crystallography and perspective.",
};

type Topic = {
  index: string;
  title: string;
  subtitle: string;
  text: string;
  ideas: string[];
  prompt: string;
  variant: "rose" | "network" | "vault" | "orbit" | "crystal" | "perspective";
};

const topics: Topic[] = [
  {
    index: "01",
    title: "Sacred geometry",
    subtitle: "Symmetry, circles and repeated construction",
    text: "Religious architecture often turns simple geometric operations into rich visual systems. Concentric circles, radial division, polygons and mirrored axes can generate rose windows, mosaics, floor plans and ornamental fields.",
    ideas: ["Radial symmetry", "Polygons", "Circle construction", "Tessellation"],
    prompt: "Try it: build a square or octahedron, duplicate it, then move the copy along a symmetry axis.",
    variant: "rose",
  },
  {
    index: "02",
    title: "Nature & science",
    subtitle: "Networks, branching and efficient structure",
    text: "Geometry becomes a language for describing relationships: molecular bonds, branching systems, cellular packing, force networks and spatial graphs. The important object is often not a surface, but the pattern of connections.",
    ideas: ["Graphs", "Branching", "Packing", "Connectivity"],
    prompt: "Try it: place one central point, surround it with six points and connect each outer point back to the center.",
    variant: "network",
  },
  {
    index: "03",
    title: "Architecture",
    subtitle: "Proportion, span and structural rhythm",
    text: "Plans, elevations and vaults transform geometric rules into inhabitable space. Repeated bays, grids, triangles, arches and proportional systems help organize both structure and visual rhythm.",
    ideas: ["Grid systems", "Triangulation", "Vaults", "Proportion"],
    prompt: "Try it: insert a cube, duplicate it twice and align the three volumes into a rhythmic structural bay.",
    variant: "vault",
  },
  {
    index: "04",
    title: "Astronomy",
    subtitle: "Orbits, reference frames and projection",
    text: "Astronomy depends on geometry to describe position and motion: angular relationships, orbital planes, coordinate frames and projected paths. A view of space is always also a choice of coordinate system.",
    ideas: ["Orbits", "Angles", "Reference frames", "Projection"],
    prompt: "Try it: arrange points around a center, then switch between Top and Iso views to see how one system changes under projection.",
    variant: "orbit",
  },
  {
    index: "05",
    title: "Crystallography",
    subtitle: "Lattices, cells and repeated symmetry",
    text: "Crystals organize matter through repeating spatial arrangements. Unit cells, translation, rotational symmetry and lattice directions turn a small geometric rule into an extended material structure.",
    ideas: ["Unit cells", "Lattices", "Translation", "Symmetry"],
    prompt: "Try it: insert a cube, duplicate it and translate the copy by exactly one cube width to begin a simple lattice.",
    variant: "crystal",
  },
  {
    index: "06",
    title: "Perspective & proportion",
    subtitle: "How space becomes an image",
    text: "Perspective is geometry applied to seeing. Parallel directions converge under projection, scale changes with depth, and proportional relationships determine how a spatial construction is read on a flat surface.",
    ideas: ["Vanishing points", "Projection", "Scale", "Ratio"],
    prompt: "Try it: create two identical structures at different depths, then compare Front and Iso views.",
    variant: "perspective",
  },
];

function TopicDiagram({ variant }: { variant: Topic["variant"] }) {
  if (variant === "rose") {
    return (
      <svg viewBox="0 0 220 160" aria-hidden="true">
        <circle cx="110" cy="80" r="55" /><circle cx="110" cy="80" r="29" />
        <path d="M110 25V135M55 80H165M71 41l78 78M149 41l-78 78" />
      </svg>
    );
  }
  if (variant === "network") {
    return (
      <svg viewBox="0 0 220 160" aria-hidden="true">
        <path d="M110 80 50 36M110 80 168 34M110 80 182 99M110 80 137 136M110 80 55 126M50 36 168 34M55 126 137 136" />
        <circle cx="110" cy="80" r="7" /><circle cx="50" cy="36" r="5" /><circle cx="168" cy="34" r="5" /><circle cx="182" cy="99" r="5" /><circle cx="137" cy="136" r="5" /><circle cx="55" cy="126" r="5" />
      </svg>
    );
  }
  if (variant === "vault") {
    return (
      <svg viewBox="0 0 220 160" aria-hidden="true">
        <path d="M32 132V72Q110 5 188 72V132M32 72h156M60 132V87Q110 45 160 87V132M32 132h156" />
      </svg>
    );
  }
  if (variant === "orbit") {
    return (
      <svg viewBox="0 0 220 160" aria-hidden="true">
        <ellipse cx="110" cy="80" rx="78" ry="32" /><ellipse cx="110" cy="80" rx="44" ry="70" transform="rotate(38 110 80)" />
        <circle cx="110" cy="80" r="7" /><circle cx="182" cy="83" r="5" /><circle cx="82" cy="29" r="4" />
      </svg>
    );
  }
  if (variant === "crystal") {
    return (
      <svg viewBox="0 0 220 160" aria-hidden="true">
        <path d="m58 53 52-28 52 28v58l-52 28-52-28Zm0 0 52 29 52-29M110 82v57" />
        <path d="m83 67 52-28M83 124l52-28" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 220 160" aria-hidden="true">
      <path d="M28 134 110 28l82 106M28 134h164M110 28v106M52 102h116M70 78h80M89 53h42" />
      <circle cx="110" cy="28" r="5" />
    </svg>
  );
}

export default function ExplorePage() {
  return (
    <main className={styles.sitePage}>
      <SiteHeader active="explore" sticky />

      <section className={styles.exploreHero}>
        <div>
          <p className="eyebrow">Visual atlas / 01–06</p>
          <h1>Geometry keeps<br />reappearing.</h1>
        </div>
        <div className={styles.exploreHeroCopy}>
          <p>
            Not as decoration, but as a way to organize space, matter, motion and vision. Explore six contexts, then carry a construction idea directly into the studio.
          </p>
          <Link className={styles.darkButton} href="/create">Open the studio ↗</Link>
        </div>
      </section>

      <nav className={styles.topicIndex} aria-label="Explore topics">
        {topics.map((topic) => (
          <a key={topic.index} href={`#topic-${topic.index}`}>
            <span>{topic.index}</span>{topic.title}
          </a>
        ))}
      </nav>

      <section className={styles.topicStack}>
        {topics.map((topic) => (
          <article className={styles.topicArticle} id={`topic-${topic.index}`} key={topic.index}>
            <div className={styles.topicNumber}>{topic.index}</div>
            <div className={styles.topicDiagram}><TopicDiagram variant={topic.variant} /></div>
            <div className={styles.topicContent}>
              <p className="eyebrow">{topic.subtitle}</p>
              <h2>{topic.title}</h2>
              <p className={styles.topicText}>{topic.text}</p>
              <div className={styles.topicTags}>
                {topic.ideas.map((idea) => <span key={idea}>{idea}</span>)}
              </div>
              <div className={styles.constructionPrompt}>
                <strong>Construction prompt</strong>
                <p>{topic.prompt}</p>
                <Link href="/create">Try it in Studio ↗</Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.dimensionLab}>
        <div className={styles.sectionHeadingInverse}>
          <p className="eyebrow">Dimension lab</p>
          <h2>From a plane to a space, then beyond the space we can directly see.</h2>
        </div>
        <div className={styles.dimensionLabGrid}>
          <article>
            <span>2D</span>
            <h3>Construct</h3>
            <p>Coordinates describe position on a plane. Lines and polygons emerge from relationships between those points.</p>
          </article>
          <article>
            <span>3D</span>
            <h3>Navigate</h3>
            <p>Add depth, camera position and spatial transformation. Geometry becomes something you move through and around.</p>
          </article>
          <article className={styles.futureDimension}>
            <span>4D</span>
            <h3>Project</h3>
            <p>Planned next: true (x, y, z, w) coordinates, 4D rotations, slicing and mathematical projection into the 3D scene.</p>
            <small>In development</small>
          </article>
        </div>
      </section>

      <section className={styles.exploreClosing}>
        <p className="eyebrow">From observation to construction</p>
        <h2>The atlas is not the destination. It is a set of ideas to take into the coordinate field.</h2>
        <div className={styles.heroButtons}>
          <Link className={styles.darkButton} href="/create">Build a structure ↗</Link>
          <Link className={styles.lineButton} href="/artworks">Open my artworks</Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
