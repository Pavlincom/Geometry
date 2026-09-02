import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site/site-header";
import styles from "./home.module.css";

const routes = [
  {
    index: "01",
    label: "Explore",
    title: "Geometry in real life",
    text: "See clear geometric patterns in architecture, nature and science.",
    href: "/explore",
  },
  {
    index: "02",
    label: "Create",
    title: "Build in the studio",
    text: "Place points, connect them and shape editable structures in 3D space.",
    href: "/create",
  },
  {
    index: "03",
    label: "My Artworks",
    title: "Return to your work",
    text: "Open saved structures and continue exactly where you left them.",
    href: "/artworks",
  },
];

function HeroGeometry() {
  return (
    <svg className={styles.homeGatewayGeometry} viewBox="0 0 700 700" aria-hidden="true">
      <circle cx="350" cy="350" r="248" />
      <circle cx="350" cy="350" r="164" />
      <path d="M350 102 565 474 135 474Z" />
      <path d="M350 598 135 226 565 226Z" />
      <path d="M135 226 565 474M565 226 135 474M350 102V598" />
      <circle className={styles.heroGeometryAccent} cx="350" cy="350" r="8" />
      <circle className={styles.heroGeometryPoint} cx="350" cy="102" r="6" />
      <circle className={styles.heroGeometryPoint} cx="565" cy="474" r="6" />
      <circle className={styles.heroGeometryPoint} cx="135" cy="474" r="6" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className={styles.sitePage}>
      <SiteHeader />

      <section className={styles.homeGateway}>
        <div className={styles.homeGatewayCopy}>
          <p className="eyebrow">Geometry°</p>
          <h1>Explore it.<br />Build it.<br />Keep it.</h1>
          <p className={styles.homeGatewayLead}>
            See geometry in the world, construct spatial forms, and return to the structures you save.
          </p>
          <div className={styles.homeStatusLine} aria-label="Geometry product status">
            <span>3D studio live</span>
            <span>4D in development</span>
          </div>
        </div>

        <div className={styles.homeGatewayVisual}>
          <HeroGeometry />
          <span className={styles.homeGatewayAxis}>POINT · LINE · SPACE</span>
        </div>
      </section>

      <nav className={styles.homeRoutes} aria-label="Choose where to go in Geometry">
        {routes.map((route) => (
          <Link className={styles.homeRouteCard} href={route.href} key={route.index}>
            <div className={styles.homeRouteTopline}>
              <span>{route.index}</span>
              <span>{route.label}</span>
            </div>
            <div className={styles.homeRouteContent}>
              <h2>{route.title}</h2>
              <p>{route.text}</p>
            </div>
            <span className={styles.homeRouteArrow} aria-hidden="true">→</span>
          </Link>
        ))}
      </nav>

      <SiteFooter />
    </main>
  );
}
