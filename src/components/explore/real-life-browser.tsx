"use client";

import { useMemo, useState } from "react";
import styles from "./real-life-browser.module.css";

type CategoryId = "architecture" | "nature" | "science";
type PatternId =
  | "rose" | "vault" | "dome" | "symmetry" | "mosaic" | "rhythm" | "perspective" | "tessellation"
  | "spiral" | "phyllotaxis" | "honeycomb" | "branching" | "crystal" | "snowflake" | "web" | "dual-spiral" | "leaf" | "flower"
  | "molecule" | "diffraction" | "parabola" | "paths" | "michelson" | "helix" | "graph" | "rays" | "atom" | "waves";

type Example = {
  title: string;
  patternName: string;
  note: string;
  pattern: PatternId;
  image: string;
  source: string;
  alt: string;
};

type Category = {
  id: CategoryId;
  label: string;
  description: string;
  examples: Example[];
};

const commonsImage = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1600`;
const commonsSource = (file: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;

const categories: Category[] = [
  {
    id: "architecture",
    label: "In architecture",
    description: "Symmetry, proportion, repetition and spatial order in sacred architecture.",
    examples: [
      { title: "Rose windows", patternName: "Radial symmetry", note: "A center, equal angular divisions and concentric rings organize the entire window.", pattern: "rose", image: commonsImage("Triest Kathedrale - Fensterrose.jpg"), source: commonsSource("Triest Kathedrale - Fensterrose.jpg"), alt: "Gothic rose window on Trieste Cathedral" },
      { title: "Ribbed vaults", patternName: "Intersecting arches", note: "Curved ribs meet at shared nodes and repeat across the ceiling as a structural graph.", pattern: "vault", image: commonsImage("Chester Cathedral - interior, view of choir vaulted ceiling.jpg"), source: commonsSource("Chester Cathedral - interior, view of choir vaulted ceiling.jpg"), alt: "Vaulted choir ceiling inside Chester Cathedral" },
      { title: "Domes", patternName: "Rotational sectors", note: "A circular plan becomes volume through repeated sectors around one vertical axis.", pattern: "dome", image: commonsImage("Barcelona Cathedral Interior - view of the dome.jpg"), source: commonsSource("Barcelona Cathedral Interior - view of the dome.jpg"), alt: "Interior dome of Barcelona Cathedral" },
      { title: "Facade symmetry", patternName: "Mirror axis", note: "A dominant center line balances towers, openings and repeated architectural masses.", pattern: "symmetry", image: commonsImage("St. Paul's Episcopal Cathedral, Pearl Street and Church Street, Buffalo, NY - 52674538022.jpg"), source: commonsSource("St. Paul's Episcopal Cathedral, Pearl Street and Church Street, Buffalo, NY - 52674538022.jpg"), alt: "Cathedral facade in Buffalo" },
      { title: "Mosaic fields", patternName: "Nested repetition", note: "Small repeated modules combine into larger rotational and polygonal structures.", pattern: "mosaic", image: commonsImage("San Vitale Central Ceiling Mosaic.jpg"), source: commonsSource("San Vitale Central Ceiling Mosaic.jpg"), alt: "Central ceiling mosaic in San Vitale" },
      { title: "Cloister rhythm", patternName: "Repeated module", note: "Equal arch spans and column spacing turn one bay into a continuous visual rhythm.", pattern: "rhythm", image: commonsImage("Mosteiro dos Jeronimos - Cloister - Arcades.jpg"), source: commonsSource("Mosteiro dos Jeronimos - Cloister - Arcades.jpg"), alt: "Arcades in Jeronimos Monastery cloister" },
      { title: "Nave perspective", patternName: "Vanishing point", note: "Parallel aisle and roof lines visually converge toward a shared region in depth.", pattern: "perspective", image: commonsImage("Reims Cathedral nave interior.JPG"), source: commonsSource("Reims Cathedral nave interior.JPG"), alt: "Nave of Reims Cathedral" },
      { title: "Geometric floors", patternName: "Tessellation", note: "Polygons share edges and repeat across the plane to create a walkable geometric field.", pattern: "tessellation", image: commonsImage("Floor mosaic in Cologne Cathedral.jpg"), source: commonsSource("Floor mosaic in Cologne Cathedral.jpg"), alt: "Geometric floor mosaic in Cologne Cathedral" },
    ],
  },
  {
    id: "nature",
    label: "In nature",
    description: "Growth, packing, branching and symmetry made visible by living and physical systems.",
    examples: [
      { title: "Nautilus shell", patternName: "Expanding spiral", note: "Growth rotates around a center while the overall relationship between chambers remains recognizable.", pattern: "spiral", image: commonsImage("Nautilus Shell.jpg"), source: commonsSource("Nautilus Shell.jpg"), alt: "Sectioned nautilus shell" },
      { title: "Sunflower", patternName: "Phyllotaxis", note: "Two families of counter-rotating spirals pack florets efficiently around the center.", pattern: "phyllotaxis", image: commonsImage("Sunflower closeup.jpg"), source: commonsSource("Sunflower closeup.jpg"), alt: "Close-up of a sunflower center" },
      { title: "Honeycomb", patternName: "Hexagonal tiling", note: "Six-sided cells share walls efficiently and fill the plane without gaps.", pattern: "honeycomb", image: commonsImage("Western honey bee on a honeycomb.jpg"), source: commonsSource("Western honey bee on a honeycomb.jpg"), alt: "Bee on honeycomb" },
      { title: "Fern", patternName: "Recursive branching", note: "A main stem divides into smaller structures that repeat similar relationships at different scales.", pattern: "branching", image: commonsImage("Fern fiddleheads.jpg"), source: commonsSource("Fern fiddleheads.jpg"), alt: "Fern fiddleheads" },
      { title: "Quartz", patternName: "Crystal axes", note: "Repeated face directions and angles make microscopic order visible at human scale.", pattern: "crystal", image: commonsImage("Quartz crystal.jpg"), source: commonsSource("Quartz crystal.jpg"), alt: "Quartz crystal" },
      { title: "Snowflake", patternName: "Sixfold symmetry", note: "Six principal directions repeat around one center while each branch develops unique detail.", pattern: "snowflake", image: commonsImage("Snowflake macro photography 1.jpg"), source: commonsSource("Snowflake macro photography 1.jpg"), alt: "Macro snowflake" },
      { title: "Spider web", patternName: "Radial network", note: "Spokes radiate from a center and are connected by a second family of roughly concentric threads.", pattern: "web", image: commonsImage("Spider web with dew.JPG"), source: commonsSource("Spider web with dew.JPG"), alt: "Spider web with dew" },
      { title: "Pine cone", patternName: "Dual spirals", note: "Scales align into diagonal families that rotate in opposite directions around the cone.", pattern: "dual-spiral", image: commonsImage("Pine cone (3294144914).jpg"), source: commonsSource("Pine cone (3294144914).jpg"), alt: "Pine cone close-up" },
      { title: "Leaf veins", patternName: "Branching network", note: "A main vein splits into smaller paths while loops create redundancy across the leaf surface.", pattern: "leaf", image: commonsImage("Leaf veins.jpg"), source: commonsSource("Leaf veins.jpg"), alt: "Leaf vein network" },
      { title: "Flower", patternName: "Rotational repetition", note: "Petals repeat around a shared center with related angular spacing.", pattern: "flower", image: commonsImage("Symmetry and Ray Florets in a Composite Flower Head.jpg"), source: commonsSource("Symmetry and Ray Florets in a Composite Flower Head.jpg"), alt: "Composite flower head" },
    ],
  },
  {
    id: "science",
    label: "In science",
    description: "Geometry used to model hidden structure, build instruments and read measurable patterns.",
    examples: [
      { title: "Molecular geometry", patternName: "Bond graph", note: "Atoms become nodes and bonds become edges whose angles determine three-dimensional form.", pattern: "molecule", image: commonsImage("Molecule models.jpg"), source: commonsSource("Molecule models.jpg"), alt: "Molecule models" },
      { title: "X-ray diffraction", patternName: "Reciprocal symmetry", note: "Hidden microscopic order appears as a measurable arrangement of repeated spots and radial distances.", pattern: "diffraction", image: commonsImage("X-ray diffraction pattern 3clpro.jpg"), source: commonsSource("X-ray diffraction pattern 3clpro.jpg"), alt: "X-ray diffraction pattern" },
      { title: "Radio telescope", patternName: "Parabola and focus", note: "A curved reflector redirects incoming parallel signals toward a focal region.", pattern: "parabola", image: commonsImage("KSC radio telescope.jpg"), source: commonsSource("KSC radio telescope.jpg"), alt: "Radio telescope dish" },
      { title: "Interferometry", patternName: "Measured paths", note: "Multiple optical paths must remain geometrically controlled before their signals can be combined.", pattern: "paths", image: commonsImage("The VLTI laboratory at Paranal (vlti-lab-mar2009-1021).jpg"), source: commonsSource("The VLTI laboratory at Paranal (vlti-lab-mar2009-1021).jpg"), alt: "VLTI laboratory at Paranal" },
      { title: "Michelson interferometer", patternName: "Perpendicular paths", note: "One beam splits into two perpendicular paths and recombines to reveal tiny differences in distance.", pattern: "michelson", image: commonsImage("Photo of a Michelson interferometer.jpg"), source: commonsSource("Photo of a Michelson interferometer.jpg"), alt: "Michelson interferometer" },
      { title: "DNA", patternName: "Double helix", note: "Two offset strands rotate around one axis while repeated cross-connections link them.", pattern: "helix", image: commonsImage("Dna-163466.jpg"), source: commonsSource("Dna-163466.jpg"), alt: "DNA double helix model" },
      { title: "Network graph", patternName: "Nodes and edges", note: "Clusters, hubs and bridges reveal structure by reducing a complex system to points and relationships.", pattern: "graph", image: commonsImage("Network Visualization.png"), source: commonsSource("Network Visualization.png"), alt: "Network visualization" },
      { title: "Optical bench", patternName: "Ray paths", note: "Lenses and mirrors are positioned around a controlled axis that redirects and focuses light.", pattern: "rays", image: commonsImage("Optical instruments.jpg"), source: commonsSource("Optical instruments.jpg"), alt: "Optical instruments" },
      { title: "Atomic model", patternName: "Orbital shells", note: "Nested paths around a center communicate organized shells, orientation and scale.", pattern: "atom", image: commonsImage("Atom Model at the American Museum of Science and Energy Oak Ridge (6945039114).jpg"), source: commonsSource("Atom Model at the American Museum of Science and Energy Oak Ridge (6945039114).jpg"), alt: "Large atom model" },
      { title: "Wave interference", patternName: "Overlapping wavefronts", note: "Circular fronts from two sources intersect and produce a new spatial interference pattern.", pattern: "waves", image: commonsImage("Water Interference.jpg"), source: commonsSource("Water Interference.jpg"), alt: "Interfering water waves" },
    ],
  },
];

function PatternDiagram({ pattern }: { pattern: PatternId }) {
  const common = { viewBox: "0 0 640 420", "aria-hidden": true } as const;
  switch (pattern) {
    case "rose": return <svg {...common}><circle cx="320" cy="210" r="145"/><circle cx="320" cy="210" r="82"/><path d="M320 55v310M165 210h310M210 100l220 220M430 100 210 320M245 70l150 280M395 70 245 350"/><circle cx="320" cy="210" r="7"/></svg>;
    case "vault": return <svg {...common}><path d="M65 370Q175 90 320 65Q465 90 575 370M150 370Q225 155 320 105Q415 155 490 370M65 370Q230 250 320 105Q410 250 575 370M150 370Q260 265 320 105Q380 265 490 370"/><circle cx="320" cy="105" r="7"/></svg>;
    case "dome": return <svg {...common}><circle cx="320" cy="210" r="155"/><circle cx="320" cy="210" r="95"/><path d="M320 55v310M165 210h310M210 100l220 220M430 100 210 320M250 70l140 280M390 70 250 350"/><circle cx="320" cy="210" r="7"/></svg>;
    case "symmetry": return <svg {...common}><path d="M320 40v340M115 340h410M150 125h340M185 210h270M220 285h200M185 340V160M455 340V160M245 340V100M395 340V100"/><circle cx="320" cy="125" r="7"/></svg>;
    case "mosaic": return <svg {...common}><circle cx="320" cy="210" r="155"/><circle cx="320" cy="210" r="100"/><circle cx="320" cy="210" r="50"/><path d="m320 55 110 45 45 110-45 110-110 45-110-45-45-110 45-110Zm0 65 64 26 26 64-26 64-64 26-64-26-26-64 26-64Z"/></svg>;
    case "rhythm": return <svg {...common}><path d="M40 350h560M70 350V195Q115 115 160 195V350M205 350V195Q250 115 295 195V350M340 350V195Q385 115 430 195V350M475 350V195Q520 115 565 195V350"/></svg>;
    case "perspective": return <svg {...common}><path d="M320 125 40 400M320 125 600 400M320 125 155 400M320 125 485 400M320 125v275M100 340h440M155 285h330M205 235h230"/><circle cx="320" cy="125" r="7"/></svg>;
    case "tessellation": return <svg {...common}><path d="M45 85h550M45 175h550M45 265h550M45 355h550M120 40v340M230 40v340M340 40v340M450 40v340M560 40v340"/><path d="m120 85 55 45-55 45-55-45Zm220 90 55 45-55 45-55-45Zm220-90 55 45-55 45-55-45"/></svg>;
    case "spiral": return <svg {...common}><path d="M295 215c0-25 21-45 46-45 35 0 64 29 64 64 0 49-40 89-89 89-69 0-124-55-124-124 0-96 78-174 174-174 134 0 242 108 242 242"/><circle cx="295" cy="215" r="7"/></svg>;
    case "phyllotaxis": return <svg {...common}><circle cx="320" cy="210" r="155"/><circle cx="320" cy="210" r="105"/><path d="M320 210c45-105 160-80 168 5 7 85-105 138-200 80-92-57-106-182-20-242M320 210c-60-90-160-55-160 33 0 88 108 126 196 58 80-62 78-182-10-235"/></svg>;
    case "honeycomb": return <svg {...common}><path d="m130 100 42-24 42 24v48l-42 24-42-24Zm84 48 42-24 42 24v48l-42 24-42-24Zm84-48 42-24 42 24v48l-42 24-42-24Zm84 48 42-24 42 24v48l-42 24-42-24Zm-252 48 42-24 42 24v48l-42 24-42-24Zm168 0 42-24 42 24v48l-42 24-42-24Zm168 0 42-24 42 24v48l-42 24-42-24"/></svg>;
    case "branching": return <svg {...common}><path d="M320 390Q330 285 325 70M325 300l-120-75M325 300l125-82M326 240l-90-65M326 240l95-68M326 180l-66-52M326 180l70-55M205 225l-50-8M205 225l-18-48M450 218l50-10M450 218l15-48"/></svg>;
    case "crystal": return <svg {...common}><path d="m320 45 110 72 42 163-152 120-152-120 42-163Zm0 0v355M210 117h220M168 280h304M210 117l262 163M430 117 168 280"/></svg>;
    case "snowflake": return <svg {...common}><path d="M320 45v330M170 125l300 170M170 295l300-170M320 100l-28 34M320 100l28 34M320 320l-28-34M320 320l28-34M215 155l45 3M215 155l22 40M425 265l-45-3M425 265l-22-40"/><circle cx="320" cy="210" r="58"/></svg>;
    case "web": return <svg {...common}><circle cx="320" cy="210" r="45"/><circle cx="320" cy="210" r="90"/><circle cx="320" cy="210" r="140"/><path d="M320 40v340M150 210h340M200 90l240 240M440 90 200 330M250 50l140 320M390 50 250 370"/></svg>;
    case "dual-spiral": return <svg {...common}><path d="M305 215c0-30 26-54 56-54 42 0 76 34 76 76 0 60-49 109-109 109-84 0-152-68-152-152 0-117 95-212 212-212M335 215c0-30-26-54-56-54-42 0-76 34-76 76 0 60 49 109 109 109 84 0 152-68 152-152 0-117-95-212-212-212"/></svg>;
    case "leaf": return <svg {...common}><path d="M80 365Q250 260 555 60M190 295l-55-105M190 295l90 12M280 235l-42-110M280 235l115 12M375 180l-20-100M375 180l110 10M460 125l32-70M135 190l-55-35M238 125l-65-30M395 247l85 55M280 307l75 60"/></svg>;
    case "flower": return <svg {...common}><circle cx="320" cy="210" r="55"/><circle cx="320" cy="210" r="150"/><path d="M320 60v300M170 210h300M215 105l210 210M425 105 215 315M260 75l120 270M380 75 260 345M185 150l270 120M455 150 185 270"/></svg>;
    case "molecule": return <svg {...common}><path d="M155 285 245 205 345 250 445 155M245 205 230 90M345 250 410 350M345 250 490 285M445 155 535 105"/><circle cx="155" cy="285" r="18"/><circle cx="245" cy="205" r="22"/><circle cx="345" cy="250" r="25"/><circle cx="445" cy="155" r="20"/><circle cx="230" cy="90" r="14"/><circle cx="410" cy="350" r="14"/><circle cx="490" cy="285" r="14"/></svg>;
    case "diffraction": return <svg {...common}><circle cx="320" cy="210" r="60"/><circle cx="320" cy="210" r="120"/><circle cx="320" cy="210" r="175"/><path d="M320 30v360M140 210h360M193 83l254 254M447 83 193 337"/><circle cx="320" cy="210" r="7"/></svg>;
    case "parabola": return <svg {...common}><path d="M100 350Q320 75 540 350M320 80v300M150 85 320 220 490 85M205 85 320 220 435 85M260 85 320 220 380 85"/><circle cx="320" cy="220" r="7"/></svg>;
    case "paths": return <svg {...common}><path d="M75 320 205 225 315 280 420 155 575 235M205 225 198 85M315 280 350 380M420 155 525 75M315 280 420 155"/><circle cx="205" cy="225" r="8"/><circle cx="315" cy="280" r="8"/><circle cx="420" cy="155" r="8"/></svg>;
    case "michelson": return <svg {...common}><path d="M85 210h235M320 210h235M320 210V55M320 210v155M295 185l50 50M535 180v60M290 65h60M290 345h60"/><circle cx="320" cy="210" r="7"/></svg>;
    case "helix": return <svg {...common}><path d="M220 45C470 95 470 165 220 210S-30 325 220 375M420 45C170 95 170 165 420 210s250 115 0 165M270 75h100M220 120h200M265 165h110M265 255h110M220 300h200M270 345h100"/></svg>;
    case "graph": return <svg {...common}><path d="M105 250 195 145 290 220 375 125 480 205 555 110M290 220 355 325M480 205 530 335M195 145 115 75M355 325 235 360M355 325 530 335"/><circle cx="105" cy="250" r="11"/><circle cx="195" cy="145" r="15"/><circle cx="290" cy="220" r="20"/><circle cx="375" cy="125" r="14"/><circle cx="480" cy="205" r="21"/><circle cx="555" cy="110" r="11"/></svg>;
    case "rays": return <svg {...common}><path d="M55 210h530M70 110 265 165 415 210 570 210M70 310 265 255 415 210 570 210"/><ellipse cx="265" cy="210" rx="20" ry="105"/><ellipse cx="415" cy="210" rx="18" ry="95"/></svg>;
    case "atom": return <svg {...common}><ellipse cx="320" cy="210" rx="185" ry="75"/><ellipse cx="320" cy="210" rx="185" ry="75" transform="rotate(60 320 210)"/><ellipse cx="320" cy="210" rx="185" ry="75" transform="rotate(120 320 210)"/><circle cx="320" cy="210" r="25"/></svg>;
    case "waves": return <svg {...common}><circle cx="230" cy="210" r="40"/><circle cx="230" cy="210" r="80"/><circle cx="230" cy="210" r="120"/><circle cx="230" cy="210" r="160"/><circle cx="410" cy="210" r="40"/><circle cx="410" cy="210" r="80"/><circle cx="410" cy="210" r="120"/><circle cx="410" cy="210" r="160"/></svg>;
  }
}

export function RealLifeBrowser() {
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<CategoryId | null>(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "previous">("next");

  const category = useMemo(() => categories.find((item) => item.id === categoryId) ?? null, [categoryId]);
  const active = category?.examples[index] ?? null;

  function selectCategory(id: CategoryId) {
    setCategoryId(id);
    setIndex(0);
    setDirection("next");
  }

  function step(amount: number) {
    if (!category) return;
    setDirection(amount > 0 ? "next" : "previous");
    setIndex((current) => (current + amount + category.examples.length) % category.examples.length);
  }

  return (
    <section className={styles.browser} aria-label="Geometry in real life">
      <button type="button" className={`${styles.entry} ${open ? styles.entryOpen : ""}`} aria-expanded={open} onClick={() => { setOpen((value) => !value); if (open) setCategoryId(null); }}>
        <span><small>Explore</small><strong>Geometry in real life</strong></span>
        <span className={styles.entryArrow} aria-hidden="true">{open ? "×" : "↘"}</span>
      </button>

      {open && (
        <div className={styles.reveal}>
          {!category ? (
            <div className={styles.categoryChooser}>
              {categories.map((item) => (
                <button key={item.id} type="button" onClick={() => selectCategory(item.id)}>
                  <span>{item.label}</span><p>{item.description}</p><b aria-hidden="true">→</b>
                </button>
              ))}
            </div>
          ) : active ? (
            <div className={styles.experience} tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); step(1); } if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); } }}>
              <div className={styles.experienceHead}>
                <button type="button" onClick={() => setCategoryId(null)}>← All fields</button>
                <div className={styles.categoryTabs}>{categories.map((item) => <button key={item.id} type="button" className={item.id === category.id ? styles.activeTab : ""} onClick={() => selectCategory(item.id)}>{item.label}</button>)}</div>
                <span>{String(index + 1).padStart(2, "0")} / {String(category.examples.length).padStart(2, "0")}</span>
              </div>

              <div className={`${styles.pair} ${direction === "next" ? styles.moveNext : styles.movePrevious}`} key={`${category.id}-${index}`}>
                <div className={styles.patternPanel}>
                  <div className={styles.patternMeta}><small>Pattern</small><h2>{active.patternName}</h2></div>
                  <div className={styles.patternCanvas}><PatternDiagram pattern={active.pattern} /></div>
                  <p>{active.note}</p>
                </div>
                <figure className={styles.photoPanel}>
                  <img src={active.image} alt={active.alt} />
                  <figcaption><div><small>Real example</small><h2>{active.title}</h2></div><a href={active.source} target="_blank" rel="noreferrer">Source ↗</a></figcaption>
                </figure>
              </div>

              <div className={styles.navigation}>
                <button type="button" onClick={() => step(-1)} aria-label="Previous example">←</button>
                <div className={styles.dots}>{category.examples.map((example, dotIndex) => <button key={example.title} type="button" className={dotIndex === index ? styles.activeDot : ""} aria-label={`Show ${example.title}`} onClick={() => { setDirection(dotIndex > index ? "next" : "previous"); setIndex(dotIndex); }} />)}</div>
                <button type="button" className={styles.nextButton} onClick={() => step(1)} aria-label="Next example">→</button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
