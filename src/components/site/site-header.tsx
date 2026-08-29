import Link from "next/link";
import styles from "@/app/site-pages.module.css";

type SiteHeaderProps = {
  active?: "explore" | "artworks";
  sticky?: boolean;
};

export function SiteHeader({ active, sticky = false }: SiteHeaderProps) {
  return (
    <header className={`site-header ${sticky ? styles.stickyHeader : ""}`}>
      <Link className="brand" href="/" aria-label="Geometry home">
        GEOMETRY°
      </Link>
      <nav className="nav-links" aria-label="Primary navigation">
        <Link
          className={active === "explore" ? styles.navCurrent : undefined}
          aria-current={active === "explore" ? "page" : undefined}
          href="/explore"
        >
          Explore
        </Link>
        <Link
          className={active === "artworks" ? styles.navCurrent : undefined}
          aria-current={active === "artworks" ? "page" : undefined}
          href="/artworks"
        >
          My artworks
        </Link>
        <Link className="nav-cta" href="/create">
          Open studio
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.siteFooter}>
      <Link className="brand" href="/">GEOMETRY°</Link>
      <p>Explore structure. Build spatial ideas. Keep the work interactive.</p>
      <div className={styles.footerLinks}>
        <Link href="/explore">Explore</Link>
        <Link href="/artworks">My artworks</Link>
        <Link href="/create">Studio ↗</Link>
      </div>
    </footer>
  );
}
