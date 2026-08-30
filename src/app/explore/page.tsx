import type { Metadata } from "next";
import Link from "next/link";
import { RealWorldAtlas } from "@/components/explore/real-world-atlas";
import { SiteFooter, SiteHeader } from "@/components/site/site-header";
import styles from "../site-pages.module.css";

export const metadata: Metadata = {
  title: "Explore geometry",
  description: "Explore real-world geometry in churches, nature and science through compact interactive photo stories.",
};

export default function ExplorePage() {
  return (
    <main className={styles.sitePage}>
      <SiteHeader active="explore" sticky />

      <section className={styles.exploreHero}>
        <div>
          <p className="eyebrow">Real-world atlas / 01–03</p>
          <h1>See the pattern.<br />Then look again.</h1>
        </div>
        <div className={styles.exploreHeroCopy}>
          <p>
            Churches, living systems and scientific instruments all make geometry visible in different ways. Each chapter below keeps the information dense but the page compact: one image at a time, with the next example one click away.
          </p>
          <Link className={styles.darkButton} href="/create">Open the studio ↗</Link>
        </div>
      </section>

      <nav className={styles.topicIndex} aria-label="Explore real-world chapters">
        <a href="#churches"><span>01</span>Churches</a>
        <a href="#nature"><span>02</span>Nature</a>
        <a href="#science"><span>03</span>Science</a>
      </nav>

      <RealWorldAtlas />

      <section className={styles.dimensionLab}>
        <div className={styles.sectionHeadingInverse}>
          <p className="eyebrow">Dimension lab</p>
          <h2>Observation becomes construction when the pattern enters the coordinate field.</h2>
        </div>
        <div className={styles.dimensionLabGrid}>
          <article>
            <span>2D</span>
            <h3>Read</h3>
            <p>Find circles, axes, grids, spirals, repeated cells and proportional relationships in a real image.</p>
          </article>
          <article>
            <span>3D</span>
            <h3>Rebuild</h3>
            <p>Translate what you observed into points, edges, spatial groups and editable structures inside the live Geometry studio.</p>
          </article>
          <article className={styles.futureDimension}>
            <span>4D</span>
            <h3>Extend</h3>
            <p>Planned next: true (x, y, z, w) coordinates, higher-dimensional rotation, slicing and mathematical projection.</p>
            <small>In development</small>
          </article>
        </div>
      </section>

      <section className={styles.exploreClosing}>
        <p className="eyebrow">From photograph to structure</p>
        <h2>Use the world as reference material, then turn the underlying relationships into something new.</h2>
        <div className={styles.heroButtons}>
          <Link className={styles.darkButton} href="/create">Build a structure ↗</Link>
          <Link className={styles.lineButton} href="/artworks">Open my artworks</Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
