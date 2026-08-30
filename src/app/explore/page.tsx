import type { Metadata } from "next";
import { RealLifeBrowser } from "@/components/explore/real-life-browser";
import { SiteFooter, SiteHeader } from "@/components/site/site-header";
import styles from "../site-pages.module.css";

export const metadata: Metadata = {
  title: "Geometry in real life",
  description: "Choose architecture, nature or science and compare a geometric pattern directly with a real-world photograph.",
};

export default function ExplorePage() {
  return (
    <main className={styles.sitePage}>
      <SiteHeader active="explore" sticky />
      <RealLifeBrowser />
      <SiteFooter />
    </main>
  );
}
