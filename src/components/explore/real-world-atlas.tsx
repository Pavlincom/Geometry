"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./real-world-atlas.module.css";

type ThemeId = "churches" | "nature" | "science";
type Direction = "next" | "previous";
type PatternId =
  | "rose-radial"
  | "ribbed-vault"
  | "dome-sectors"
  | "facade-symmetry"
  | "mosaic-field"
  | "cloister-rhythm"
  | "nave-perspective"
  | "floor-tessellation"
  | "shell-spiral"
  | "phyllotaxis"
  | "honeycomb"
  | "fern-branching"
  | "crystal-axes"
  | "snowflake-sixfold"
  | "spider-radial"
  | "pinecone-dual-spiral"
  | "leaf-network"
  | "flower-radial"
  | "molecular-bonds"
  | "diffraction"
  | "parabola-focus"
  | "vlti-paths"
  | "michelson-paths"
  | "dna-helix"
  | "graph-network"
  | "optics-rays"
  | "atom-orbits"
  | "wave-interference";

type AtlasSlide = {
  title: string;
  kicker: string;
  description: string;
  focus: string;
  pattern: PatternId;
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
      "Church architecture turns circles, axes, repeated bays and proportional systems into space. Move through eight real examples, each paired with the pattern that best explains what you are seeing.",
    tags: ["Radial symmetry", "Vaults", "Axes", "Rhythm", "Tessellation"],
    slides: [
      {
        title: "Rose windows",
        kicker: "Pattern · Radial symmetry",
        description:
          "A rose window begins with a center, radial division and nested circles. Stone tracery turns those simple operations into a dense field of repeated geometry.",
        focus: "Look for the central hub, equal angular divisions and concentric rings.",
        pattern: "rose-radial",
        image: commonsImage("Triest Kathedrale - Fensterrose.jpg"),
        source: commonsSource("Triest Kathedrale - Fensterrose.jpg"),
        alt: "Gothic rose window on Trieste Cathedral",
      },
      {
        title: "Ribbed vaults",
        kicker: "Pattern · Intersecting arches",
        description:
          "Vault ribs behave like a spatial graph. Repeated curves meet at carefully positioned nodes, distributing loads while creating a strong visual rhythm.",
        focus: "Follow the ribs as edges and the bosses as structural nodes.",
        pattern: "ribbed-vault",
        image: commonsImage("Chester Cathedral - interior, view of choir vaulted ceiling.jpg"),
        source: commonsSource("Chester Cathedral - interior, view of choir vaulted ceiling.jpg"),
        alt: "Vaulted choir ceiling inside Chester Cathedral",
      },
      {
        title: "Domes and vertical axes",
        kicker: "Pattern · Rotational sectors",
        description:
          "A dome extends circular order into three dimensions. Repetition around a vertical axis creates a spatial system that is both structural and ceremonial.",
        focus: "Notice the center axis, circular perimeter and repeated sectors around it.",
        pattern: "dome-sectors",
        image: commonsImage("Barcelona Cathedral Interior - view of the dome.jpg"),
        source: commonsSource("Barcelona Cathedral Interior - view of the dome.jpg"),
        alt: "Interior dome and ceiling of Barcelona Cathedral",
      },
      {
        title: "Facade symmetry",
        kicker: "Pattern · Mirror axis",
        description:
          "Church facades use vertical axes, towers, windows and repeated bays to balance complex programs. Symmetry makes many individual elements read as one whole.",
        focus: "Compare the central axis with mirrored masses and repeated openings.",
        pattern: "facade-symmetry",
        image: commonsImage("St. Paul's Episcopal Cathedral, Pearl Street and Church Street, Buffalo, NY - 52674538022.jpg"),
        source: commonsSource("St. Paul's Episcopal Cathedral, Pearl Street and Church Street, Buffalo, NY - 52674538022.jpg"),
        alt: "Gothic Revival facade of St. Paul's Episcopal Cathedral in Buffalo",
      },
      {
        title: "Mosaic fields",
        kicker: "Pattern · Nested repetition",
        description:
          "Mosaics can repeat geometry at several scales at once: local motifs, larger rotational structures and an overall field that follows the architecture around it.",
        focus: "Look for repeated modules, rotational symmetry and nested visual scales.",
        pattern: "mosaic-field",
        image: commonsImage("San Vitale Central Ceiling Mosaic.jpg"),
        source: commonsSource("San Vitale Central Ceiling Mosaic.jpg"),
        alt: "Central ceiling mosaic in the Basilica of San Vitale",
      },
      {
        title: "Cloister rhythm",
        kicker: "Pattern · Repeated module",
        description:
          "A cloister turns one arch-and-column unit into a sequence. Equal spacing and repeated spans create a geometric rhythm that guides both movement and sight.",
        focus: "Track the repeated arch width, column spacing and baseline from bay to bay.",
        pattern: "cloister-rhythm",
        image: commonsImage("Mosteiro dos Jeronimos - Cloister - Arcades.jpg"),
        source: commonsSource("Mosteiro dos Jeronimos - Cloister - Arcades.jpg"),
        alt: "Repeated arcades in the cloister of Jeronimos Monastery",
      },
      {
        title: "The nave as an axis",
        kicker: "Pattern · Perspective convergence",
        description:
          "Long church naves organize many structural bays along one dominant line. Parallel edges appear to converge, making perspective itself part of the spatial experience.",
        focus: "Follow the central aisle and roof lines toward the shared vanishing region.",
        pattern: "nave-perspective",
        image: commonsImage("Reims Cathedral nave interior.JPG"),
        source: commonsSource("Reims Cathedral nave interior.JPG"),
        alt: "Interior view along the nave of Reims Cathedral",
      },
      {
        title: "Geometric floor mosaics",
        kicker: "Pattern · Tessellation",
        description:
          "Cathedral floors compress large architectural ideas into a plane. Repeated polygons, borders and directional fields create a walkable system of geometric order.",
        focus: "Look for repeating cells, shared edges and larger motifs built from smaller units.",
        pattern: "floor-tessellation",
        image: commonsImage("Floor mosaic in Cologne Cathedral.jpg"),
        source: commonsSource("Floor mosaic in Cologne Cathedral.jpg"),
        alt: "Geometric floor mosaic inside Cologne Cathedral",
      },
    ],
  },
  {
    id: "nature",
    index: "02",
    title: "Geometry in Nature",
    eyebrow: "Growth / packing / branching",
    intro:
      "Natural geometry is rarely a perfect diagram. It appears through growth rules, packing, branching and symmetry. Ten examples show how different patterns emerge from different biological and physical processes.",
    tags: ["Spirals", "Packing", "Branching", "Sixfold symmetry", "Networks"],
    slides: [
      {
        title: "Spirals in shells",
        kicker: "Pattern · Expanding spiral",
        description:
          "The chambered nautilus grows by adding new material around an expanding spiral. The shape changes scale while retaining a recognizable geometric relationship.",
        focus: "Trace the rotating growth around the center and compare chamber sizes.",
        pattern: "shell-spiral",
        image: commonsImage("Nautilus Shell.jpg"),
        source: commonsSource("Nautilus Shell.jpg"),
        alt: "Sectioned nautilus shell showing its spiral chambers",
      },
      {
        title: "Phyllotaxis",
        kicker: "Pattern · Counter-rotating spirals",
        description:
          "Sunflower florets organize around the center in intersecting spiral families. The result distributes many elements across a circular field without obvious rows.",
        focus: "Follow spiral families clockwise and counter-clockwise from the center.",
        pattern: "phyllotaxis",
        image: commonsImage("Sunflower closeup.jpg"),
        source: commonsSource("Sunflower closeup.jpg"),
        alt: "Close-up of a sunflower center",
      },
      {
        title: "Honeycomb",
        kicker: "Pattern · Hexagonal tiling",
        description:
          "A honeycomb turns a simple polygon into a dense tiling. Hexagonal cells share walls efficiently, producing a strong repeated structure with very little wasted space.",
        focus: "Notice how every interior cell meets six neighbors with shared edges.",
        pattern: "honeycomb",
        image: commonsImage("Western honey bee on a honeycomb.jpg"),
        source: commonsSource("Western honey bee on a honeycomb.jpg"),
        alt: "Western honey bee standing on a hexagonal honeycomb",
      },
      {
        title: "Fern curls",
        kicker: "Pattern · Recursive branching",
        description:
          "Fiddleheads reveal a spiral during growth, while the mature fern repeats branching structures from the main stem down toward smaller leaflets.",
        focus: "Compare the large curl with smaller repeated branching relationships.",
        pattern: "fern-branching",
        image: commonsImage("Fern fiddleheads.jpg"),
        source: commonsSource("Fern fiddleheads.jpg"),
        alt: "Curled fern fiddleheads",
      },
      {
        title: "Crystal form",
        kicker: "Pattern · Repeated axes",
        description:
          "Crystal growth makes microscopic ordering legible at human scale. Faces, edges and repeated angles arise from the internal arrangement of matter.",
        focus: "Look for planar faces, consistent edge directions and repeated angular relationships.",
        pattern: "crystal-axes",
        image: commonsImage("Quartz crystal.jpg"),
        source: commonsSource("Quartz crystal.jpg"),
        alt: "Large clear quartz crystal specimen",
      },
      {
        title: "Snowflake symmetry",
        kicker: "Pattern · Sixfold rotation",
        description:
          "Ice crystals repeatedly express sixfold symmetry because of the molecular arrangement of water. Each arm differs in detail while sharing the same rotational framework.",
        focus: "Find the six main directions and compare repeated branching on each arm.",
        pattern: "snowflake-sixfold",
        image: commonsImage("Snowflake macro photography 1.jpg"),
        source: commonsSource("Snowflake macro photography 1.jpg"),
        alt: "Macro photograph of a natural snowflake",
      },
      {
        title: "Spider webs",
        kicker: "Pattern · Radial network",
        description:
          "Orb webs combine radial spokes with a second family of connecting threads. The result is a flexible network where local irregularities still preserve a clear global structure.",
        focus: "Separate the spoke directions from the roughly concentric connecting paths.",
        pattern: "spider-radial",
        image: commonsImage("Spider web with dew.JPG"),
        source: commonsSource("Spider web with dew.JPG"),
        alt: "Spider web covered in dew",
      },
      {
        title: "Pine-cone spirals",
        kicker: "Pattern · Dual spiral families",
        description:
          "Scales on a pine cone align into visible diagonal families in opposite directions. Counting those families often reveals neighboring Fibonacci numbers.",
        focus: "Trace one diagonal family clockwise, then a second family in the opposite direction.",
        pattern: "pinecone-dual-spiral",
        image: commonsImage("Pine cone (3294144914).jpg"),
        source: commonsSource("Pine cone (3294144914).jpg"),
        alt: "Close-up photograph of a pine cone",
      },
      {
        title: "Leaf veins",
        kicker: "Pattern · Branching transport network",
        description:
          "Leaf venation distributes water and structural support through a branching graph. Major veins divide into smaller paths while loops create redundancy.",
        focus: "Read the main vein as a trunk, then follow repeated splitting and reconnecting branches.",
        pattern: "leaf-network",
        image: commonsImage("Leaf veins.jpg"),
        source: commonsSource("Leaf veins.jpg"),
        alt: "Macro photograph showing a leaf vein network",
      },
      {
        title: "Flower symmetry",
        kicker: "Pattern · Rotational repetition",
        description:
          "Many composite flowers arrange petals or ray florets around a shared center. Repetition by rotation makes the whole flower legible as one coherent form.",
        focus: "Locate the center, count repeated directions and compare angular spacing between petals.",
        pattern: "flower-radial",
        image: commonsImage("Symmetry and Ray Florets in a Composite Flower Head.jpg"),
        source: commonsSource("Symmetry and Ray Florets in a Composite Flower Head.jpg"),
        alt: "Composite flower head showing radial symmetry",
      },
    ],
  },
  {
    id: "science",
    index: "03",
    title: "Geometry in Science",
    eyebrow: "Models / measurement / observation",
    intro:
      "Science uses geometry to model hidden structure, organize data and build instruments. Ten examples connect abstract relationships to physical models, measurements and experiments.",
    tags: ["Molecules", "Diffraction", "Optics", "Graphs", "Waves"],
    slides: [
      {
        title: "Molecular geometry",
        kicker: "Pattern · Bond graph",
        description:
          "Physical molecule models make invisible spatial relationships tangible. Bond angles and connections determine how a molecule occupies three-dimensional space.",
        focus: "Read atoms as points and bonds as edges, then compare the angles between them.",
        pattern: "molecular-bonds",
        image: commonsImage("Molecule models.jpg"),
        source: commonsSource("Molecule models.jpg"),
        alt: "Physical ball-and-stick molecule models",
      },
      {
        title: "X-ray diffraction",
        kicker: "Pattern · Reciprocal symmetry",
        description:
          "Diffraction converts hidden microscopic order into a measurable geometric pattern. Scientists work backward from those spatial relationships to infer crystal structure.",
        focus: "Notice symmetry, radial distance and the repeated placement of diffraction spots.",
        pattern: "diffraction",
        image: commonsImage("X-ray diffraction pattern 3clpro.jpg"),
        source: commonsSource("X-ray diffraction pattern 3clpro.jpg"),
        alt: "X-ray diffraction pattern from a crystallized protein",
      },
      {
        title: "Radio telescopes",
        kicker: "Pattern · Parabola and focus",
        description:
          "A parabolic dish directs incoming waves toward a focal region. The instrument itself is a geometric solution to gathering weak signals from a large area.",
        focus: "Follow the dish curvature toward the focal support above its center.",
        pattern: "parabola-focus",
        image: commonsImage("KSC radio telescope.jpg"),
        source: commonsSource("KSC radio telescope.jpg"),
        alt: "Large radio telescope dish at Kennedy Space Center",
      },
      {
        title: "Astronomical interferometry",
        kicker: "Pattern · Measured optical paths",
        description:
          "Interferometers combine light collected along different paths. Their geometry has to be controlled with extraordinary precision for separate beams to produce useful measurements together.",
        focus: "Think of every mirror as a node and each light path as a measured edge.",
        pattern: "vlti-paths",
        image: commonsImage("The VLTI laboratory at Paranal (vlti-lab-mar2009-1021).jpg"),
        source: commonsSource("The VLTI laboratory at Paranal (vlti-lab-mar2009-1021).jpg"),
        alt: "Very Large Telescope Interferometer laboratory at Paranal",
      },
      {
        title: "Michelson interferometer",
        kicker: "Pattern · Perpendicular paths",
        description:
          "A Michelson interferometer splits light into two paths and combines it again. Tiny differences in distance become visible through interference, turning geometry into measurement.",
        focus: "Trace the two perpendicular light paths from splitter to mirrors and back.",
        pattern: "michelson-paths",
        image: commonsImage("Photo of a Michelson interferometer.jpg"),
        source: commonsSource("Photo of a Michelson interferometer.jpg"),
        alt: "Michelson interferometer in a university laboratory",
      },
      {
        title: "DNA double helix",
        kicker: "Pattern · Coupled helices",
        description:
          "DNA is modeled as two strands winding around a common axis. Repeated base-pair connections create a ladder-like relationship that rotates through space.",
        focus: "Follow the two offset strands and notice the repeated cross-connections between them.",
        pattern: "dna-helix",
        image: commonsImage("Dna-163466.jpg"),
        source: commonsSource("Dna-163466.jpg"),
        alt: "Model of the DNA double helix",
      },
      {
        title: "Network graphs",
        kicker: "Pattern · Nodes and edges",
        description:
          "Scientific network visualizations reduce complex systems to points and connections. Clusters, hubs and bridges become spatial clues to structure in the underlying data.",
        focus: "Look for dense clusters, highly connected hubs and sparse links between groups.",
        pattern: "graph-network",
        image: commonsImage("Network Visualization.png"),
        source: commonsSource("Network Visualization.png"),
        alt: "Scientific network visualization with nodes and links",
      },
      {
        title: "Optical benches",
        kicker: "Pattern · Ray paths and focal axes",
        description:
          "Optical experiments align lenses, mirrors and sensors along controlled paths. Small changes in angle or spacing alter where light converges and what the instrument measures.",
        focus: "Trace the main optical axis, then follow rays as they bend or reflect through components.",
        pattern: "optics-rays",
        image: commonsImage("Optical instruments.jpg"),
        source: commonsSource("Optical instruments.jpg"),
        alt: "Laboratory optical instruments mounted on an optical bench",
      },
      {
        title: "Atomic models",
        kicker: "Pattern · Nested orbital shells",
        description:
          "Physical atom models turn an abstract description into a spatial diagram. Nested paths around a center communicate scale, symmetry and the idea of organized shells.",
        focus: "Find the central nucleus and compare the orientation of surrounding orbital paths.",
        pattern: "atom-orbits",
        image: commonsImage("Atom Model at the American Museum of Science and Energy Oak Ridge (6945039114).jpg"),
        source: commonsSource("Atom Model at the American Museum of Science and Energy Oak Ridge (6945039114).jpg"),
        alt: "Large atom model at the American Museum of Science and Energy",
      },
      {
        title: "Wave interference",
        kicker: "Pattern · Overlapping wavefronts",
        description:
          "Circular waves expand from multiple sources and overlap. Where their phases meet, the combined surface forms a new interference geometry that changes through time.",
        focus: "Separate the two wave centers, then follow where circular fronts intersect.",
        pattern: "wave-interference",
        image: commonsImage("Water Interference.jpg"),
        source: commonsSource("Water Interference.jpg"),
        alt: "Photograph of interfering water waves",
      },
    ],
  },
];

function GeometryOverlay({ pattern }: { pattern: PatternId }) {
  const radialSpokes = (
    <>
      <circle cx="500" cy="310" r="170" />
      <circle cx="500" cy="310" r="105" />
      <path d="M500 120v380M310 310h380M366 176l268 268M634 176 366 444M405 145l190 330M595 145 405 475M335 215l330 190M665 215 335 405" />
      <circle cx="500" cy="310" r="10" />
    </>
  );

  switch (pattern) {
    case "rose-radial":
      return <svg viewBox="0 0 1000 620" aria-hidden="true">{radialSpokes}</svg>;
    case "ribbed-vault":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><path d="M120 560Q250 180 500 90Q750 180 880 560M220 560Q330 250 500 155Q670 250 780 560M120 560Q360 355 500 155Q640 355 880 560M220 560Q390 370 500 155Q610 370 780 560" /><path d="M500 90v470M120 560h760" /><circle cx="500" cy="155" r="10" /></svg>;
    case "dome-sectors":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><circle cx="540" cy="300" r="210" /><circle cx="540" cy="300" r="135" /><path d="M540 90v420M330 300h420M392 152l296 296M688 152 392 448M435 110l210 380M645 110 435 490M350 195l380 210M730 195 350 405" /><circle cx="540" cy="300" r="10" /></svg>;
    case "facade-symmetry":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><path d="M500 55v520M240 525h520M290 170h420M330 260h340M365 355h270" /><path d="M310 525V225M690 525V225M390 525V150M610 525V150" /><circle cx="500" cy="170" r="10" /></svg>;
    case "mosaic-field":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><circle cx="500" cy="310" r="205" /><circle cx="500" cy="310" r="135" /><circle cx="500" cy="310" r="70" /><path d="m500 105 145 60 60 145-60 145-145 60-145-60-60-145 60-145Zm0 70 95 40 40 95-40 95-95 40-95-40-40-95 40-95Z" /><circle cx="500" cy="310" r="9" /></svg>;
    case "cloister-rhythm":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><path d="M90 525h820M145 525V285Q205 175 265 285V525M325 525V285Q385 175 445 285V525M505 525V285Q565 175 625 285V525M685 525V285Q745 175 805 285V525" /><path d="M145 285h120M325 285h120M505 285h120M685 285h120" /><circle cx="565" cy="285" r="9" /></svg>;
    case "nave-perspective":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><path d="M500 205 80 600M500 205 920 600M500 205 250 600M500 205 750 600M500 205v395" /><path d="M180 510h640M250 445h500M315 385h370M370 330h260" /><circle cx="500" cy="205" r="10" /></svg>;
    case "floor-tessellation":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><path d="M90 160h820M90 280h820M90 400h820M90 520h820M170 100v470M310 100v470M450 100v470M590 100v470M730 100v470M870 100v470" /><path d="m170 160 70 60-70 60-70-60Zm280 120 70 60-70 60-70-60Zm280-120 70 60-70 60-70-60" /><circle cx="520" cy="340" r="9" /></svg>;
    case "shell-spiral":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><path d="M470 320c0-34 29-61 63-61 48 0 87 39 87 87 0 67-55 122-122 122-94 0-170-76-170-170 0-131 106-237 237-237 183 0 331 148 331 331" /><path d="M470 320 896 392M470 320 565 61M470 320 328 298" /><circle cx="470" cy="320" r="10" /></svg>;
    case "phyllotaxis":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><circle cx="520" cy="310" r="220" /><circle cx="520" cy="310" r="160" /><circle cx="520" cy="310" r="95" /><path d="M520 310c60-145 215-110 225 5 10 118-145 190-275 110-126-78-145-250-28-330M520 310c-80-125-220-75-220 45 0 122 150 174 270 80 110-86 108-250-15-322" /><circle cx="520" cy="310" r="9" /></svg>;
    case "honeycomb":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><path d="m250 170 55-32 55 32v64l-55 32-55-32Zm110 64 55-32 55 32v64l-55 32-55-32Zm110-64 55-32 55 32v64l-55 32-55-32Zm110 64 55-32 55 32v64l-55 32-55-32Zm-330 64 55-32 55 32v64l-55 32-55-32Zm220 0 55-32 55 32v64l-55 32-55-32Zm220 0 55-32 55 32v64l-55 32-55-32" /><circle cx="525" cy="330" r="9" /></svg>;
    case "fern-branching":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><path d="M500 560Q520 400 510 115M510 440l-160-100M510 440l165-110M512 360l-120-90M512 360l125-95M512 285l-90-70M512 285l95-72M512 215l-62-55M512 215l65-55" /><path d="M350 340l-70-10M350 340l-20-65M675 330l70-12M675 330l18-68M392 270l-55-8M392 270l-15-50M637 265l55-10M637 265l15-50" /><circle cx="510" cy="440" r="9" /></svg>;
    case "crystal-axes":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><path d="m500 75 145 95 55 215-200 160-200-160 55-215Zm0 0v470M355 170l290 0M300 385l400 0M355 170l345 215M645 170 300 385" /><circle cx="500" cy="310" r="9" /></svg>;
    case "snowflake-sixfold":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><path d="M500 75v470M297 192l406 236M297 428l406-236" /><path d="M500 150l-38 45M500 150l38 45M500 470l-38-45M500 470l38-45M360 235l58 2M360 235l28 50M640 385l-58-2M640 385l-28-50M360 385l58-2M360 385l28-50M640 235l-58 2M640 235l-28 50" /><circle cx="500" cy="310" r="78" /><circle cx="500" cy="310" r="9" /></svg>;
    case "spider-radial":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><circle cx="500" cy="300" r="65" /><circle cx="500" cy="300" r="125" /><circle cx="500" cy="300" r="190" /><circle cx="500" cy="300" r="245" /><path d="M500 45v510M245 300h510M320 120l360 360M680 120 320 480M400 70l200 460M600 70 400 530M270 210l460 180M730 210 270 390" /><circle cx="500" cy="300" r="9" /></svg>;
    case "pinecone-dual-spiral":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><path d="M485 320c0-40 34-72 75-72 56 0 102 46 102 102 0 80-65 145-145 145-112 0-203-91-203-203 0-156 126-282 282-282" /><path d="M535 320c0-40-34-72-75-72-56 0-102 46-102 102 0 80 65 145 145 145 112 0 203-91 203-203 0-156-126-282-282-282" /><circle cx="510" cy="320" r="9" /></svg>;
    case "leaf-network":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><path d="M180 520Q420 360 800 90M330 420l-75-145M330 420l120 15M445 340l-55-150M445 340l150 15M565 265l-25-135M565 265l145 10M675 190l40-95" /><path d="M255 275l-70-45M255 275l15-75M390 190l-85-38M390 190l25-75M540 130l-65-35M710 275l80-70M595 355l110 65M450 435l95 75" /><circle cx="445" cy="340" r="9" /></svg>;
    case "flower-radial":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><circle cx="500" cy="310" r="75" /><circle cx="500" cy="310" r="205" /><path d="M500 105v410M295 310h410M355 165l290 290M645 165 355 455M420 120l160 380M580 120 420 500M315 230l370 160M685 230 315 390" /><circle cx="500" cy="310" r="9" /></svg>;
    case "molecular-bonds":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><path d="M300 410 430 300 565 365 700 235M430 300 410 150M565 365 650 500M565 365 760 410M700 235 820 170" /><circle cx="300" cy="410" r="24" /><circle cx="430" cy="300" r="28" /><circle cx="565" cy="365" r="32" /><circle cx="700" cy="235" r="25" /><circle cx="410" cy="150" r="18" /><circle cx="650" cy="500" r="18" /><circle cx="760" cy="410" r="18" /><circle cx="820" cy="170" r="9" /></svg>;
    case "diffraction":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><circle cx="500" cy="310" r="80" /><circle cx="500" cy="310" r="160" /><circle cx="500" cy="310" r="240" /><path d="M500 60v500M250 310h500M323 133l354 354M677 133 323 487" /><circle cx="500" cy="310" r="9" /></svg>;
    case "parabola-focus":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><path d="M170 480Q500 110 830 480M500 120v390M250 120 500 290 750 120M320 120 500 290 680 120M390 120 500 290 610 120" /><circle cx="500" cy="290" r="10" /></svg>;
    case "vlti-paths":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><path d="M120 450 310 315 470 390 620 220 840 330M310 315 300 125M470 390 520 520M620 220 770 110M470 390 620 220" /><circle cx="120" cy="450" r="12" /><circle cx="310" cy="315" r="12" /><circle cx="470" cy="390" r="12" /><circle cx="620" cy="220" r="12" /><circle cx="840" cy="330" r="9" /></svg>;
    case "michelson-paths":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><path d="M150 310h350M500 310h330M500 310V95M500 310v215M465 275l70 70" /><path d="M810 270v80M460 105h80M460 505h80" /><circle cx="500" cy="310" r="10" /></svg>;
    case "dna-helix":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><path d="M360 70C700 135 700 235 360 300S20 465 360 550M640 70C300 135 300 235 640 300s340 165 0 250" /><path d="M430 105h140M360 170h280M420 235h160M420 365h160M360 430h280M430 500h140" /><circle cx="500" cy="300" r="9" /></svg>;
    case "graph-network":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><path d="M210 350 330 215 460 320 575 190 720 300 830 170M460 320 550 455M720 300 790 470M330 215 220 120M575 190 640 85M550 455 390 500M550 455 790 470" /><circle cx="210" cy="350" r="14" /><circle cx="330" cy="215" r="20" /><circle cx="460" cy="320" r="26" /><circle cx="575" cy="190" r="18" /><circle cx="720" cy="300" r="28" /><circle cx="830" cy="170" r="14" /><circle cx="550" cy="455" r="18" /><circle cx="790" cy="470" r="9" /></svg>;
    case "optics-rays":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><path d="M100 310h800M120 170 430 250 650 310 880 310M120 450 430 370 650 310 880 310" /><ellipse cx="430" cy="310" rx="28" ry="150" /><ellipse cx="650" cy="310" rx="24" ry="135" /><circle cx="650" cy="310" r="9" /></svg>;
    case "atom-orbits":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><ellipse cx="500" cy="310" rx="260" ry="105" /><ellipse cx="500" cy="310" rx="260" ry="105" transform="rotate(60 500 310)" /><ellipse cx="500" cy="310" rx="260" ry="105" transform="rotate(120 500 310)" /><circle cx="500" cy="310" r="34" /><circle cx="725" cy="360" r="9" /></svg>;
    case "wave-interference":
      return <svg viewBox="0 0 1000 620" aria-hidden="true"><circle cx="365" cy="315" r="55" /><circle cx="365" cy="315" r="110" /><circle cx="365" cy="315" r="165" /><circle cx="365" cy="315" r="220" /><circle cx="635" cy="315" r="55" /><circle cx="635" cy="315" r="110" /><circle cx="635" cy="315" r="165" /><circle cx="635" cy="315" r="220" /><circle cx="635" cy="315" r="9" /></svg>;
  }
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
              <GeometryOverlay pattern={active.pattern} />
            </div>
          </figure>

          <button className={`${styles.arrowButton} ${styles.arrowPrevious}`} type="button" onClick={() => step(-1)} aria-label={`Previous ${theme.title} example`}>←</button>
          <button className={`${styles.arrowButton} ${styles.arrowNext}`} type="button" onClick={() => step(1)} aria-label={`Next ${theme.title} example`}>→</button>

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
            <button type="button" className={`${styles.overlayToggle} ${overlay ? styles.overlayToggleActive : ""}`} aria-pressed={overlay} onClick={() => setOverlay((current) => !current)}>
              <span aria-hidden="true" />
              Geometry overlay
            </button>

            <div className={styles.dots} aria-label={`${theme.title} examples`}>
              {theme.slides.map((slide, slideIndex) => (
                <button key={slide.title} type="button" className={slideIndex === index ? styles.dotActive : ""} aria-label={`Show ${slide.title}`} aria-current={slideIndex === index ? "true" : undefined} onClick={() => goTo(slideIndex)} />
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
