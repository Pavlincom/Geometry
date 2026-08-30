import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site/site-header";
import styles from "./site-pages.module.css";

const modes = [
  {
    index: "01",
    eyebrow: "Explore",
    title: "See geometry in the world.",
    text: "Move between sacred architecture, crystalline order, perspective, astronomy and the mathematics of proportion.",
    href: "/explore",
    link: "Open the atlas ↗",
  },
  {
    index: "02",
    eyebrow: "Create",
    title: "Turn coordinates into form.",
    text: "Place points, connect them, move groups through XYZ space, insert polyhedra and keep every structure editable.",
    href: "/create",
    link: "Enter the studio ↗",
  },
  {
    index: "03",
    eyebrow: "Collect",
    title: "Keep the structure alive.",
    text: "Save works as interactive point-and-edge documents, reopen them later and continue building instead of flattening them into images.",
    href: "/artworks",
    link: "View my artworks ↗",
  },
];

const dimensions = [
  {
    mark: "2D",
    title: "Plane",
    text: "Points, lines, polygons, grids and proportion form the visual grammar.",
    status: "Foundation",
  },
  {
    mark: "3D",
    title: "Space",
    text: "The live studio works with true X, Y and Z coordinates, camera views and spatial transformations.",
    status: "Available now",
  },
  {
    mark: "4D",
    title: "Projection",
    text: "The next mathematics layer will add a real W coordinate, 4D rotation, projection and slicing rather than simulated effects.",
    status: "In development",
  },
];

function HeroGeometry() {
  return (
    <svg className={styles.heroGeometry} viewBox="0 0 700 700" aria-hidden="true">
      <circle cx="350" cy="350" r="250" />
      <circle cx="350" cy="350" r="168" />
      <path d="M350 100 566 475 134 475Z" />
      <path d="M350 600 134 225 566 225Z" />
      <path d="M134 225 566 475M566 225 134 475M350 100V600" />
      <circle className={styles.heroGeometryAccent} cx="350" cy="350" r="8" />
      <circle className={styles.heroGeometryPoint} cx="350" cy="100" r="6" />
      <circle className={styles.heroGeometryPoint} cx="566" cy="475" r="6" />
      <circle className={styles.heroGeometryPoint} cx="134" cy="475" r="6" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className={styles.sitePage}>
      <SiteHeader />

      <section className={styles.homeHero}>
        <div className={styles.heroCopyBlock}>
          <p className="eyebrow">Geometry as language, structure and art</p>
          <h1>See the pattern.<br />Build the space.</h1>
          <p className={styles.heroLead}>
            Geometry is a visual atlas and a spatial studio in one place. Learn how structures appear across culture and science, then construct your own interactive works from points, connections and dimensions.
          </p>
          <div className={styles.heroButtons}>
            <Link className={styles.darkButton} href="/create">Open studio ↗</Link>
            <Link className={styles.lineButton} href="/explore">Explore geometry</Link>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <HeroGeometry />
          <div className={styles.heroAxisLabel}>X / Y / Z</div>
          <div className={styles.heroVisualNote}>Interactive structures, not flattened images.</div>
        </div>
      </section>

      <section className={styles.signalStrip} aria-label="Geometry principles">
        <span>POINTS</span>
        <span>CONNECTIONS</span>
        <span>PROPORTION</span>
        <span>SPACE</span>
        <span>PROJECTION</span>
      </section>

      <section className={styles.introStatement}>
        <p className="eyebrow">One system, two directions</p>
        <h2>Study the structures that already exist. Then use the same language to make structures that did not exist before.</h2>
      </section>

      <section className={styles.modeGrid} aria-label="Explore, create and collect">
        {modes.map((mode) => (
          <article className={styles.modeCard} key={mode.index}>
            <div className={styles.modeTopline}>
              <span>{mode.index}</span>
              <span>{mode.eyebrow}</span>
            </div>
            <h3>{mode.title}</h3>
            <p>{mode.text}</p>
            <Link href={mode.href}>{mode.link}</Link>
          </article>
        ))}
      </section>

      <section className={styles.atlasPreview}>
        <div className={styles.atlasCopy}>
          <p className="eyebrow">Explore the visual atlas</p>
          <h2>From rose windows to crystal lattices, perspective grids and orbital systems.</h2>
          <p>
            The Explore area organizes geometry by the places it appears: architecture, nature, science, astronomy and visual representation. Each theme ends with a construction prompt that can be carried into the studio.
          </p>
          <Link className={styles.lightButton} href="/explore">Enter Explore ↗</Link>
        </div>
        <div className={styles.atlasIndex}>
          <span>01 Sacred geometry</span>
          <span>02 Nature & science</span>
          <span>03 Architecture</span>
          <span>04 Astronomy</span>
          <span>05 Crystallography</span>
          <span>06 Perspective & proportion</span>
        </div>
      </section>

      <section className={styles.dimensionSection}>
        <div className={styles.sectionHeading}>
          <p className="eyebrow">Dimensions</p>
          <h2>The coordinate system grows with the project.</h2>
        </div>
        <div className={styles.dimensionGrid}>
          {dimensions.map((dimension) => (
            <article className={styles.dimensionCard} key={dimension.mark}>
              <div className={styles.dimensionMark}>{dimension.mark}</div>
              <div>
                <div className={styles.dimensionStatus}>{dimension.status}</div>
                <h3>{dimension.title}</h3>
                <p>{dimension.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.currentStudio}>
        <div>
          <p className="eyebrow">Studio now</p>
          <h2>A working 3D construction space, already connected to your cloud collection.</h2>
        </div>
        <div className={styles.featureList}>
          <span>XYZ transform gizmo</span>
          <span>Multi-selection & group movement</span>
          <span>Cube, tetrahedron, octahedron & star</span>
          <span>Undo / redo, duplicate & copy / paste</span>
          <span>Fit, iso, top, front & right views</span>
          <span>Cloud save & reopen</span>
        </div>
        <Link className={styles.darkButton} href="/create">Start constructing ↗</Link>
      </section>

      <SiteFooter />
    </main>
  );
}
