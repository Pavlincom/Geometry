import Link from "next/link";

const themes = [
  {
    index: "01",
    title: "Sacred geometry",
    text: "Trace the hidden structures behind rose windows, vaults, mosaics and architectural proportion.",
  },
  {
    index: "02",
    title: "Science & structure",
    text: "Move from molecules and crystals to orbital systems, networks and mathematical models.",
  },
  {
    index: "03",
    title: "Beyond three dimensions",
    text: "Build spatial constructions now, then project true four-dimensional geometry into an explorable 3D scene.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/">GEOMETRY°</Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#explore">Explore</a>
          <a href="#dimensions">Dimensions</a>
          <Link className="nav-cta" href="/create">Open studio</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-kicker">Geometry as language, structure and art</div>
        <h1>Connect points.<br />Discover worlds.</h1>
        <p className="hero-copy">
          A digital space for exploring geometry in culture and science, then turning the same principles into interactive spatial art.
        </p>
        <div className="hero-actions">
          <Link className="primary-button" href="/create">Enter the studio ↗</Link>
          <a className="text-link" href="#explore">Explore the idea ↓</a>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <div className="orbit orbit-a" />
          <div className="orbit orbit-b" />
          <div className="orbit orbit-c" />
          <span className="orbit-dot dot-a" />
          <span className="orbit-dot dot-b" />
          <span className="orbit-dot dot-c" />
        </div>
      </section>

      <section className="manifesto" id="explore">
        <p className="eyebrow">A visual atlas</p>
        <h2>Geometry is not a chapter in mathematics. It is a pattern that keeps reappearing.</h2>
      </section>

      <section className="theme-grid" id="dimensions">
        {themes.map((theme) => (
          <article className="theme-card" key={theme.index}>
            <span>{theme.index}</span>
            <h3>{theme.title}</h3>
            <p>{theme.text}</p>
          </article>
        ))}
      </section>

      <section className="studio-invite">
        <div>
          <p className="eyebrow">Create</p>
          <h2>Your canvas is a coordinate system.</h2>
        </div>
        <Link className="primary-button light" href="/create">Create a structure ↗</Link>
      </section>
    </main>
  );
}
