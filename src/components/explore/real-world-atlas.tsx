"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./real-world-atlas.module.css";

type ThemeId = "churches" | "nature" | "science";
type Direction = "next" | "previous";

type AtlasSlide = {
  title: string;
  kicker: string;
  description: string;
  focus: string;
  image: string;
  source: string;
  alt: string;
};

type AtlasTheme = {
  id: ThemeId;
  index: string;
  title: string;
  eyebrow: string;
  intro: string;
  tags: string[];
  slides: AtlasSlide[];
};

const commonsImage = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1600`;

const commonsSource = (file: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;

const themes: AtlasTheme[] = [
  {
    id: "churches",
    index: "01",
    title: "Geometry in Churches",
    eyebrow: "Sacred space / proportion / symmetry",
    intro:
      "Church architecture turns circles, axes, repeated bays and proportional systems into space. Move through five real examples without leaving the page.",
    tags: ["Rose windows", "Vaults", "Domes", "Symmetry", "Mosaics"],
    slides: [
      {
        title: "Rose windows",
        kicker: "Radial construction",
        description:
          "A rose window begins with a center, radial division and nested circles. Stone tracery turns those simple operations into a dense field of repeated geometry.",
        focus: "Look for the central hub, equal angular divisions and concentric rings.",
        image: commonsImage("Triest Kathedrale - Fensterrose.jpg"),
        source: commonsSource("Triest Kathedrale - Fensterrose.jpg"),
        alt: "Gothic rose window on Trieste Cathedral",
      },
      {
        title: "Ribbed vaults",
        kicker: "Structure through intersection",
        description:
          "Vault ribs behave like a spatial graph. Repeated curves meet at carefully positioned nodes, distributing loads while creating a strong visual rhythm.",
        focus: "Follow the ribs as edges and the bosses as structural nodes.",
        image: commonsImage("Chester Cathedral - interior, view of choir vaulted ceiling.jpg"),
        source: commonsSource("Chester Cathedral - interior, view of choir vaulted ceiling.jpg"),
        alt: "Vaulted choir ceiling inside Chester Cathedral",
      },
      {
        title: "Domes and vertical axes",
        kicker: "Circle becomes volume",
        description:
          "A dome extends circular order into three dimensions. Repetition around a vertical axis creates a spatial system that is both structural and ceremonial.",
        focus: "Notice the center axis, circular perimeter and repeated sectors around it.",
        image: commonsImage("Barcelona Cathedral Interior - view of the dome.jpg"),
        source: commonsSource("Barcelona Cathedral Interior - view of the dome.jpg"),
        alt: "Interior dome and ceiling of Barcelona Cathedral",
      },
      {
        title: "Facade symmetry",
        kicker: "Order on an elevation",
        description:
          "Church facades use vertical axes, towers, windows and repeated bays to balance complex programs. Symmetry makes many individual elements read as one whole.",
        focus: "Compare the central axis with mirrored masses and repeated openings.",
        image: commonsImage("St. Paul's Episcopal Cathedral, Pearl Street and Church Street, Buffalo, NY - 52674538022.jpg"),
        source: commonsSource("St. Paul's Episcopal Cathedral, Pearl Street and Church Street, Buffalo, NY - 52674538022.jpg"),
        alt: "Gothic Revival facade of St. Paul's Episcopal Cathedral in Buffalo",
      },
      {
        title: "Mosaic fields",
        kicker: "Pattern across a surface",
        description:
          "Mosaics can repeat geometry at several scales at once: local motifs, larger rotational structures and an overall field that follows the architecture around it.",
        focus: "Look for repeated modules, rotational symmetry and nested visual scales.",
        image: commonsImage("San Vitale Central Ceiling Mosaic.jpg"),
        source: commonsSource("San Vitale Central Ceiling Mosaic.jpg"),
        alt: "Central ceiling mosaic in the Basilica of San Vitale",
      },
    ],
  },
  {
    id: "nature",
    index: "02",
    title: "Geometry in Nature",
    eyebrow: "Growth / packing / branching",
    intro:
      "Natural geometry is rarely a perfect diagram. It appears through growth rules, efficient packing and repeated structures that adapt while preserving an underlying order.",
    tags: ["Spirals", "Phyllotaxis", "Hexagons", "Branching", "Crystals"],
    slides: [
      {
        title: "Spirals in shells",
        kicker: "Growth without changing form",
        description:
          "The chambered nautilus grows by adding new material around an expanding spiral. The shape changes scale while retaining a recognizable geometric relationship.",
        focus: "Trace the rotating growth around the center and compare chamber sizes.",
        image: commonsImage("Nautilus Shell.jpg"),
        source: commonsSource("Nautilus Shell.jpg"),
        alt: "Sectioned nautilus shell showing its spiral chambers",
      },
      {
        title: "Phyllotaxis",
        kicker: "Efficient radial packing",
        description:
          "Sunflower florets organize around the center in intersecting spiral families. The result distributes many elements across a circular field without obvious rows.",
        focus: "Follow spiral families clockwise and counter-clockwise from the center.",
        image: commonsImage("Sunflower closeup.jpg"),
        source: commonsSource("Sunflower closeup.jpg"),
        alt: "Close-up of a sunflower center",
      },
      {
        title: "Honeycomb",
        kicker: "Repeated hexagonal cells",
        description:
          "A honeycomb turns a simple polygon into a dense tiling. Hexagonal cells share walls efficiently, producing a strong repeated structure with very little wasted space.",
        focus: "Notice how every interior cell meets six neighbors with shared edges.",
        image: commonsImage("Western honey bee on a honeycomb.jpg"),
        source: commonsSource("Western honey bee on a honeycomb.jpg"),
        alt: "Western honey bee standing on a hexagonal honeycomb",
      },
      {
        title: "Fern curls",
        kicker: "Pattern across scales",
        description:
          "Fiddleheads reveal a spiral during growth, while the mature fern repeats branching structures from the main stem down toward smaller leaflets.",
        focus: "Compare the large curl with smaller repeated branching relationships.",
        image: commonsImage("Fern fiddleheads.jpg"),
        source: commonsSource("Fern fiddleheads.jpg"),
        alt: "Curled fern fiddleheads",
      },
      {
        title: "Crystal form",
        kicker: "Angles made visible",
        description:
          "Crystal growth makes microscopic ordering legible at human scale. Faces, edges and repeated angles arise from the internal arrangement of matter.",
        focus: "Look for planar faces, consistent edge directions and repeated angular relationships.",
        image: commonsImage("Quartz crystal.jpg"),
        source: commonsSource("Quartz crystal.jpg"),
        alt: "Large clear quartz crystal specimen",
      },
    ],
  },
  {
    id: "science",
    index: "03",
    title: "Geometry in Science",
    eyebrow: "Models / measurement / observation",
    intro:
      "Science uses geometry both to describe structures and to build instruments. The same ideas appear in molecular models, diffraction, telescopes and precision measurement.",
    tags: ["Molecules", "Diffraction", "Orbits", "Interferometry", "Precision"],
    slides: [
      {
        title: "Molecular geometry",
        kicker: "Angles and connectivity",
        description:
          "Physical molecule models make invisible spatial relationships tangible. Bond angles and connections determine how a molecule occupies three-dimensional space.",
        focus: "Read atoms as points and bonds as edges, then compare the angles between them.",
        image: commonsImage("Molecule models.jpg"),
        source: commonsSource("Molecule models.jpg"),
        alt: "Physical ball-and-stick molecule models",
      },
      {
        title: "X-ray diffraction",
        kicker: "Structure inferred from pattern",
        description:
          "Diffraction converts hidden microscopic order into a measurable geometric pattern. Scientists work backward from those spatial relationships to infer crystal structure.",
        focus: "Notice symmetry, radial distance and the repeated placement of diffraction spots.",
        image: commonsImage("X-ray diffraction pattern 3clpro.jpg"),
        source: commonsSource("X-ray diffraction pattern 3clpro.jpg"),
        alt: "X-ray diffraction pattern from a crystallized protein",
      },
      {
        title: "Radio telescopes",
        kicker: "Geometry for collecting signals",
        description:
          "A parabolic dish directs incoming waves toward a focal region. The instrument itself is a geometric solution to gathering weak signals from a large area.",
        focus: "Follow the dish curvature toward the focal support above its center.",
        image: commonsImage("KSC radio telescope.jpg"),
        source: commonsSource("KSC radio telescope.jpg"),
        alt: "Large radio telescope dish at Kennedy Space Center",
      },
      {
        title: "Astronomical interferometry",
        kicker: "Equal paths, extreme precision",
        description:
          "Interferometers combine light collected along different paths. Their geometry has to be controlled with extraordinary precision for separate beams to produce useful measurements together.",
        focus: "Think of every mirror as a node and each light path as a measured edge.",
        image: commonsImage("The VLTI laboratory at Paranal (vlti-lab-mar2009-1021).jpg"),
        source: commonsSource("The VLTI laboratory at Paranal (vlti-lab-mar2009-1021).jpg"),
        alt: "Very Large Telescope Interferometer laboratory at Paranal",
      },
      {
        title: "Michelson interferometer",
        kicker: "Measurement through path difference",
        description:
          "A Michelson interferometer splits light into two paths and combines it again. Tiny differences in distance become visible through interference, turning geometry into measurement.",
        focus: "Trace the two perpendicular light paths from splitter to mirrors and back.",
        image: commonsImage("Photo of a Michelson interferometer.jpg"),
        source: commonsSource("Photo of a Michelson interferometer.jpg"),
        alt: "Michelson interferometer in a university laboratory",
      },
    ],
  },
];

function GeometryOverlay({ theme }: { theme: ThemeId }) {
  if (theme === "churches") {
    return (
      <svg viewBox="0 0 1000 620" aria-hidden="true">
        <circle cx="610" cy="292" r="172" />
        <circle cx="610" cy="292" r="104" />
        <path d="M610 80v424M398 292h424M460 142l300 300M760 142 460 442" />
      </svg>
    );
  }

  if (theme === "nature") {
    return (
      <svg viewBox="0 0 1000 620" aria-hidden="true">
        <path d="M494 314c0-34 29-61 63-61 48 0 87 39 87 87 0 67-55 122-122 122-94 0-170-76-170-170 0-131 106-237 237-237 183 0 331 148 331 331" />
        <circle cx="494" cy="314" r="11" />
        <path d="M494 314 920 386M494 314 589 55M494 314 352 292" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 1000 620" aria-hidden="true">
      <ellipse cx="610" cy="305" rx="260" ry="118" />
      <ellipse cx="610" cy="305" rx="122" ry="260" transform="rotate(42 610 305)" />
      <circle cx="610" cy="305" r="16" />
      <path d="M350 305h520M610 45v520M410 160l400 290" />
      <circle cx="818" cy="356" r="10" />
      <circle cx="487" cy="98" r="8" />
    </svg>
  );
}

function AtlasSection({ theme }: { theme: AtlasTheme }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>("next");
  const [overlay, setOverlay] = useState(true);
  const active = theme.slides[index];

  function goTo(nextIndex: number) {
    const normalized = (nextIndex + theme.slides.length) % theme.slides.length;
    if (normalized === index) return;
    setDirection(nextIndex > index || (index === theme.slides.length - 1 && normalized === 0) ? "next" : "previous");
    setIndex(normalized);
  }

  function step(amount: number) {
    setDirection(amount > 0 ? "next" : "previous");
    setIndex((current) => (current + amount + theme.slides.length) % theme.slides.length);
  }

  return (
    <article
      className={styles.atlasSection}
      id={theme.id}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          step(1);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          step(-1);
        }
      }}
    >
      <div className={styles.chapterCopy}>
        <div className={styles.chapterIndex}>{theme.index} / 03</div>
        <p className={styles.eyebrow}>{theme.eyebrow}</p>
        <h2>{theme.title}<span>.</span></h2>
        <p className={styles.chapterIntro}>{theme.intro}</p>
        <div className={styles.tagRow}>
          {theme.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <Link href="/create" className={styles.studioLink}>Carry an idea into Studio ↗</Link>
      </div>

      <div className={styles.viewer}>
        <div className={styles.mediaShell}>
          <figure
            className={`${styles.mediaFigure} ${direction === "next" ? styles.enterNext : styles.enterPrevious}`}
            key={`${theme.id}-${index}`}
          >
            {/* Wikimedia Commons photographs are linked to their original file pages below. */}
            <img src={active.image} alt={active.alt} loading={index === 0 ? "eager" : "lazy"} />
            <div className={`${styles.geometryOverlay} ${overlay ? styles.overlayVisible : ""}`}>
              <GeometryOverlay theme={theme.id} />
            </div>
          </figure>

          <button
            className={`${styles.arrowButton} ${styles.arrowPrevious}`}
            type="button"
            onClick={() => step(-1)}
            aria-label={`Previous ${theme.title} example`}
          >
            ←
          </button>
          <button
            className={`${styles.arrowButton} ${styles.arrowNext}`}
            type="button"
            onClick={() => step(1)}
            aria-label={`Next ${theme.title} example`}
          >
            →
          </button>

          <div className={styles.photoCounter} aria-live="polite">
            {String(index + 1).padStart(2, "0")} / {String(theme.slides.length).padStart(2, "0")}
          </div>
        </div>

        <div className={styles.viewerFooter}>
          <div className={styles.slideCopy} key={`${theme.id}-copy-${index}`}>
            <p>{active.kicker}</p>
            <h3>{active.title}</h3>
            <p className={styles.description}>{active.description}</p>
            <div className={styles.focusLine}>
              <span>What to notice</span>
              <strong>{active.focus}</strong>
            </div>
            <a href={active.source} target="_blank" rel="noreferrer">Photo source · Wikimedia Commons ↗</a>
          </div>

          <div className={styles.viewerControls}>
            <button
              type="button"
              className={`${styles.overlayToggle} ${overlay ? styles.overlayToggleActive : ""}`}
              aria-pressed={overlay}
              onClick={() => setOverlay((current) => !current)}
            >
              <span aria-hidden="true" />
              Geometry overlay
            </button>

            <div className={styles.dots} aria-label={`${theme.title} examples`}>
              {theme.slides.map((slide, slideIndex) => (
                <button
                  key={slide.title}
                  type="button"
                  className={slideIndex === index ? styles.dotActive : ""}
                  aria-label={`Show ${slide.title}`}
                  aria-current={slideIndex === index ? "true" : undefined}
                  onClick={() => goTo(slideIndex)}
                />
              ))}
            </div>

            <div className={styles.progressTrack} aria-hidden="true">
              <span style={{ width: `${((index + 1) / theme.slides.length) * 100}%` }} />
            </div>
            <p className={styles.keyboardHint}>Use ← → when this chapter is focused.</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export function RealWorldAtlas() {
  return (
    <section className={styles.atlas} aria-label="Real-world geometry atlas">
      {themes.map((theme) => <AtlasSection key={theme.id} theme={theme} />)}
    </section>
  );
}
