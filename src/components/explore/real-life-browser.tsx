"use client";

import { useMemo, useState } from "react";
import styles from "./real-life-browser.module.css";

type CategoryId = "architecture" | "nature" | "science";
type Level = "Basic" | "Intermediate" | "Advanced";
type PatternId =
  | "rose" | "vault" | "dome" | "symmetry" | "mosaic" | "rhythm" | "perspective" | "tessellation"
  | "spiral" | "phyllotaxis" | "honeycomb" | "branching" | "crystal" | "snowflake" | "web" | "dual-spiral" | "leaf" | "flower" | "packing" | "fractal"
  | "molecule" | "diffraction" | "parabola" | "michelson" | "helix" | "graph" | "rays" | "atom" | "waves" | "magnetic" | "rings" | "chladni";

type Example = {
  title: string;
  patternName: string;
  level: Level;
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
    description: "Start with symmetry and repetition, then move toward radial systems, vaults and perspective.",
    examples: [
      { title: "Facade symmetry", patternName: "Mirror axis", level: "Basic", note: "One dominant center line makes mirrored masses and openings easy to compare.", pattern: "symmetry", image: commonsImage("St. Paul's Episcopal Cathedral, Pearl Street and Church Street, Buffalo, NY - 52674538022.jpg"), source: commonsSource("St. Paul's Episcopal Cathedral, Pearl Street and Church Street, Buffalo, NY - 52674538022.jpg"), alt: "Symmetrical cathedral facade in Buffalo" },
      { title: "St. Peter's colonnade", patternName: "Repeated spacing", level: "Basic", note: "A single column interval repeats many times, making rhythm visible before any calculation is needed.", pattern: "rhythm", image: commonsImage("Colonnades in Saint Peter's Square.jpg"), source: commonsSource("Colonnades in Saint Peter's Square.jpg"), alt: "Repeated columns in Saint Peter's Square" },
      { title: "Tessellated floor", patternName: "Repeated cells", level: "Basic", note: "A small tile unit repeats across the plane, sharing edges without leaving empty space.", pattern: "tessellation", image: commonsImage("Tesselated tile floor pattern.jpg"), source: commonsSource("Tesselated tile floor pattern.jpg"), alt: "Clear tessellated architectural floor pattern" },
      { title: "Roman arcade", patternName: "Repeated arches", level: "Basic", note: "Equal arch spans form a simple sequence of curves and vertical supports.", pattern: "rhythm", image: commonsImage("Roman arcade Museo Atarazanas Reales CCSD 12 2019 0709.jpg"), source: commonsSource("Roman arcade Museo Atarazanas Reales CCSD 12 2019 0709.jpg"), alt: "Romanesque arcade with repeated arches" },
      { title: "Rose window", patternName: "Radial symmetry", level: "Intermediate", note: "A center, concentric rings and equal angular divisions organize many details into one system.", pattern: "rose", image: commonsImage("Triest Kathedrale - Fensterrose.jpg"), source: commonsSource("Triest Kathedrale - Fensterrose.jpg"), alt: "Gothic rose window with clear radial symmetry" },
      { title: "Spiral staircase", patternName: "Rotating spiral", level: "Intermediate", note: "Each step advances while rotating around a shared vertical center, turning a spiral into built space.", pattern: "spiral", image: commonsImage("Spiral stairs (Art Deco, Nebotičnik, Ljubljana).jpg"), source: commonsSource("Spiral stairs (Art Deco, Nebotičnik, Ljubljana).jpg"), alt: "Spiral staircase in Neboticnik in Ljubljana seen from below" },
      { title: "Pantheon dome", patternName: "Radial sectors", level: "Intermediate", note: "The oculus anchors a circular field while coffers repeat across curved radial bands.", pattern: "dome", image: commonsImage("Rome-Pantheon.jpg"), source: commonsSource("Rome-Pantheon.jpg"), alt: "Pantheon dome and central oculus with repeated coffers" },
      { title: "Cloister rhythm", patternName: "Repeated module", level: "Intermediate", note: "Arch width, column spacing and baseline repeat as a measured architectural cadence.", pattern: "rhythm", image: commonsImage("Mosteiro dos Jeronimos - Cloister - Arcades.jpg"), source: commonsSource("Mosteiro dos Jeronimos - Cloister - Arcades.jpg"), alt: "Repeated cloister arcades at Jeronimos Monastery" },
      { title: "Cathedral floor mosaic", patternName: "Layered tessellation", level: "Advanced", note: "Several polygon scales work together, so a local cell becomes part of a larger geometric field.", pattern: "tessellation", image: commonsImage("Floor mosaic in Cologne Cathedral.jpg"), source: commonsSource("Floor mosaic in Cologne Cathedral.jpg"), alt: "Geometric mosaic floor inside Cologne Cathedral" },
      { title: "San Vitale mosaic", patternName: "Nested repetition", level: "Advanced", note: "Rotational geometry, borders and smaller repeated units operate simultaneously at different scales.", pattern: "mosaic", image: commonsImage("San Vitale Central Ceiling Mosaic.jpg"), source: commonsSource("San Vitale Central Ceiling Mosaic.jpg"), alt: "Central ceiling mosaic in San Vitale with nested geometric repetition" },
      { title: "Ribbed vaults", patternName: "Intersecting arches", level: "Advanced", note: "Multiple curved ribs cross at shared structural nodes and repeat through three-dimensional space.", pattern: "vault", image: commonsImage("Chester Cathedral - interior, view of choir vaulted ceiling.jpg"), source: commonsSource("Chester Cathedral - interior, view of choir vaulted ceiling.jpg"), alt: "Ribbed vaulted ceiling in Chester Cathedral" },
      { title: "Nave perspective", patternName: "Vanishing point", level: "Advanced", note: "Parallel lines in depth appear to converge, combining repetition, scale and projective geometry.", pattern: "perspective", image: commonsImage("Reims Cathedral nave interior.JPG"), source: commonsSource("Reims Cathedral nave interior.JPG"), alt: "Long nave of Reims Cathedral showing strong perspective convergence" },
    ],
  },
  {
    id: "nature",
    label: "In nature",
    description: "Begin with visible symmetry and packing, then follow growth, networks and self-similar structures.",
    examples: [
      { title: "Daisy", patternName: "Rotational symmetry", level: "Basic", note: "Petals repeat around a single center, making equal angular spacing easy to see.", pattern: "flower", image: commonsImage("Closeup of a daisy flower.jpg"), source: commonsSource("Closeup of a daisy flower.jpg"), alt: "Close-up daisy with clear radial petal symmetry" },
      { title: "Honeycomb", patternName: "Hexagonal tiling", level: "Basic", note: "Six-sided cells share walls and fill a surface with an immediately recognizable repeated unit.", pattern: "honeycomb", image: commonsImage("Western honey bee on a honeycomb.jpg"), source: commonsSource("Western honey bee on a honeycomb.jpg"), alt: "Honeycomb with clearly visible hexagonal cells" },
      { title: "Soap bubbles", patternName: "Circle packing", level: "Basic", note: "Neighboring bubbles press against one another, revealing packing, shared boundaries and changing cell sizes.", pattern: "packing", image: commonsImage("Soap bubbles.JPG"), source: commonsSource("Soap bubbles.JPG"), alt: "Close-up soap bubbles showing circle packing" },
      { title: "Quartz", patternName: "Repeated axes", level: "Basic", note: "Flat faces and repeated edge directions make angular order visible directly in the crystal form.", pattern: "crystal", image: commonsImage("Quartz crystal.jpg"), source: commonsSource("Quartz crystal.jpg"), alt: "Quartz crystal with clear planar faces and repeated axes" },
      { title: "Snowflake", patternName: "Sixfold symmetry", level: "Intermediate", note: "Six principal directions repeat around one center while smaller branches elaborate the same framework.", pattern: "snowflake", image: commonsImage("Snowflake macro photography 1.jpg"), source: commonsSource("Snowflake macro photography 1.jpg"), alt: "Macro snowflake with sixfold symmetry" },
      { title: "Nautilus shell", patternName: "Expanding spiral", level: "Intermediate", note: "The shell grows while rotating around a center, so later chambers echo the earlier shape at a larger scale.", pattern: "spiral", image: commonsImage("Nautilus Shell.jpg"), source: commonsSource("Nautilus Shell.jpg"), alt: "Sectioned nautilus shell with visible expanding spiral" },
      { title: "Sunflower", patternName: "Phyllotaxis", level: "Intermediate", note: "Two counter-rotating spiral families organize many florets around a common center.", pattern: "phyllotaxis", image: commonsImage("Sunflower closeup.jpg"), source: commonsSource("Sunflower closeup.jpg"), alt: "Sunflower center with visible phyllotaxis spirals" },
      { title: "Leaf veins", patternName: "Branching network", level: "Intermediate", note: "One main vein divides into smaller paths and loops, combining hierarchy with redundancy.", pattern: "leaf", image: commonsImage("Leaf veins.jpg"), source: commonsSource("Leaf veins.jpg"), alt: "Leaf surface with a clear branching vein network" },
      { title: "Spider web", patternName: "Radial network", level: "Advanced", note: "Radial spokes and connecting threads overlap into a flexible network with several geometric families.", pattern: "web", image: commonsImage("Spider web with dew.JPG"), source: commonsSource("Spider web with dew.JPG"), alt: "Spider web with dew showing radial spokes and connecting threads" },
      { title: "Fern frond", patternName: "Recursive branching", level: "Advanced", note: "A large frond divides into leaflets that repeat similar branching relationships at smaller scales.", pattern: "branching", image: commonsImage("Fern leaf.jpg"), source: commonsSource("Fern leaf.jpg"), alt: "Fern frond with repeated branching leaflets" },
      { title: "Pine cone", patternName: "Dual spirals", level: "Advanced", note: "Scales align into two diagonal spiral families winding in opposite directions around the cone.", pattern: "dual-spiral", image: commonsImage("Pine cone (3294144914).jpg"), source: commonsSource("Pine cone (3294144914).jpg"), alt: "Pine cone close-up with opposing spiral families" },
      { title: "Romanesco broccoli", patternName: "Self-similarity", level: "Advanced", note: "Large cones are built from smaller cone-like forms, making repeated structure visible across several scales.", pattern: "fractal", image: commonsImage("Fractal Broccoli.jpg"), source: commonsSource("Fractal Broccoli.jpg"), alt: "Romanesco broccoli showing clear self-similar fractal structure" },
    ],
  },
  {
    id: "science",
    label: "In science",
    description: "Start with simple models and fields, then move toward optics, interference and complex measured patterns.",
    examples: [
      { title: "Molecular model", patternName: "Nodes and bonds", level: "Basic", note: "Atoms become points and bonds become edges, turning invisible molecular structure into a spatial graph.", pattern: "molecule", image: commonsImage("Molecule models.jpg"), source: commonsSource("Molecule models.jpg"), alt: "Ball-and-stick molecular models with visible bond geometry" },
      { title: "Atomic model", patternName: "Nested orbits", level: "Basic", note: "A central nucleus and repeated surrounding paths create an immediate center-and-orbit model.", pattern: "atom", image: commonsImage("Atom Model at the American Museum of Science and Energy Oak Ridge (6945039114).jpg"), source: commonsSource("Atom Model at the American Museum of Science and Energy Oak Ridge (6945039114).jpg"), alt: "Large physical atom model with nested orbital paths" },
      { title: "Magnetic field", patternName: "Field lines", level: "Basic", note: "Iron filings align into curved paths around a magnet, making an otherwise invisible field directly visible.", pattern: "magnetic", image: commonsImage("Iron-filings-around-magnet.jpg"), source: commonsSource("Iron-filings-around-magnet.jpg"), alt: "Iron filings revealing magnetic field lines around a bar magnet" },
      { title: "Radio telescope", patternName: "Parabola and focus", level: "Basic", note: "A parabolic reflector redirects approximately parallel incoming signals toward one focal region.", pattern: "parabola", image: commonsImage("KSC radio telescope.jpg"), source: commonsSource("KSC radio telescope.jpg"), alt: "Radio telescope dish showing a clear parabolic form" },
      { title: "Optical bench", patternName: "Ray paths", level: "Intermediate", note: "Lenses and mirrors are aligned around controlled axes so light bends, reflects and converges predictably.", pattern: "rays", image: commonsImage("Optical instruments.jpg"), source: commonsSource("Optical instruments.jpg"), alt: "Laboratory optical instruments arranged along controlled paths" },
      { title: "Michelson interferometer", patternName: "Perpendicular paths", level: "Intermediate", note: "A beam splits into two perpendicular paths and recombines, turning path difference into a measurable effect.", pattern: "michelson", image: commonsImage("Photo of a Michelson interferometer.jpg"), source: commonsSource("Photo of a Michelson interferometer.jpg"), alt: "Michelson interferometer with visible orthogonal optical layout" },
      { title: "DNA model", patternName: "Double helix", level: "Intermediate", note: "Two strands rotate around the same axis while repeated cross-connections maintain their relationship.", pattern: "helix", image: commonsImage("Dna-163466.jpg"), source: commonsSource("Dna-163466.jpg"), alt: "Physical DNA double helix model" },
      { title: "Network graph", patternName: "Nodes and edges", level: "Intermediate", note: "Clusters, hubs and bridges become visible when a complex system is reduced to points and connections.", pattern: "graph", image: commonsImage("Network Visualization.png"), source: commonsSource("Network Visualization.png"), alt: "Scientific network visualization with clear nodes and edges" },
      { title: "Newton's rings", patternName: "Concentric interference", level: "Advanced", note: "Interference appears directly as nested bright and dark rings centered around a contact region.", pattern: "rings", image: commonsImage("Newton rings.jpg"), source: commonsSource("Newton rings.jpg"), alt: "Newton rings showing clear concentric interference fringes" },
      { title: "X-ray diffraction", patternName: "Reciprocal symmetry", level: "Advanced", note: "Microscopic crystal order is transformed into a symmetric field of measurable spots and distances.", pattern: "diffraction", image: commonsImage("X-ray diffraction pattern 3clpro.jpg"), source: commonsSource("X-ray diffraction pattern 3clpro.jpg"), alt: "X-ray diffraction image with symmetric repeated spots" },
      { title: "Laser interference", patternName: "Interference fringes", level: "Advanced", note: "Recombined coherent light produces repeated bright and dark bands that expose tiny path differences.", pattern: "rings", image: commonsImage("Michelson Interferometer Green Laser Interference.jpg"), source: commonsSource("Michelson Interferometer Green Laser Interference.jpg"), alt: "Green laser interference pattern with clearly visible fringes" },
      { title: "Chladni figure", patternName: "Standing-wave nodes", level: "Advanced", note: "Sand collects along nodal lines of a vibrating plate, turning a standing-wave mode into a complex geometric drawing.", pattern: "chladni", image: commonsImage("Chladni Plate Pattern 2.jpg"), source: commonsSource("Chladni Plate Pattern 2.jpg"), alt: "Chladni plate with geometric sand pattern formed by standing waves" },
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
    case "packing": return <svg {...common}><circle cx="230" cy="210" r="88"/><circle cx="390" cy="205" r="72"/><circle cx="320" cy="105" r="58"/><circle cx="330" cy="318" r="66"/><circle cx="145" cy="112" r="42"/><circle cx="495" cy="112" r="46"/><circle cx="505" cy="315" r="52"/></svg>;
    case "branching": return <svg {...common}><path d="M320 390Q330 285 325 70M325 300l-120-75M325 300l125-82M326 240l-90-65M326 240l95-68M326 180l-66-52M326 180l70-55M205 225l-50-8M205 225l-18-48M450 218l50-10M450 218l15-48"/></svg>;
    case "crystal": return <svg {...common}><path d="m320 45 110 72 42 163-152 120-152-120 42-163Zm0 0v355M210 117h220M168 280h304M210 117l262 163M430 117 168 280"/></svg>;
    case "snowflake": return <svg {...common}><path d="M320 45v330M170 125l300 170M170 295l300-170M320 100l-28 34M320 100l28 34M320 320l-28-34M320 320l28-34M215 155l45 3M215 155l22 40M425 265l-45-3M425 265l-22-40"/><circle cx="320" cy="210" r="58"/></svg>;
    case "web": return <svg {...common}><circle cx="320" cy="210" r="45"/><circle cx="320" cy="210" r="90"/><circle cx="320" cy="210" r="140"/><path d="M320 40v340M150 210h340M200 90l240 240M440 90 200 330M250 50l140 320M390 50 250 370"/></svg>;
    case "dual-spiral": return <svg {...common}><path d="M305 215c0-30 26-54 56-54 42 0 76 34 76 76 0 60-49 109-109 109-84 0-152-68-152-152 0-117 95-212 212-212M335 215c0-30-26-54-56-54-42 0-76 34-76 76 0 60 49 109 109 109 84 0 152-68 152-152 0-117-95-212-212-212"/></svg>;
    case "leaf": return <svg {...common}><path d="M80 365Q250 260 555 60M190 295l-55-105M190 295l90 12M280 235l-42-110M280 235l115 12M375 180l-20-100M375 180l110 10M460 125l32-70M135 190l-55-35M238 125l-65-30M395 247l85 55M280 307l75 60"/></svg>;
    case "flower": return <svg {...common}><circle cx="320" cy="210" r="55"/><circle cx="320" cy="210" r="150"/><path d="M320 60v300M170 210h300M215 105l210 210M425 105 215 315M260 75l120 270M380 75 260 345M185 150l270 120M455 150 185 270"/></svg>;
    case "fractal": return <svg {...common}><path d="M320 45 520 360H120ZM320 45 320 205 220 360M320 205 420 360M220 205 320 360M420 205 320 360"/><path d="m320 85 42 72h-84Zm-100 165 42 72h-84Zm200 0 42 72h-84Zm-100 72 28 48h-56"/></svg>;
    case "molecule": return <svg {...common}><path d="M155 285 245 205 345 250 445 155M245 205 230 90M345 250 410 350M345 250 490 285M445 155 535 105"/><circle cx="155" cy="285" r="18"/><circle cx="245" cy="205" r="22"/><circle cx="345" cy="250" r="25"/><circle cx="445" cy="155" r="20"/><circle cx="230" cy="90" r="14"/><circle cx="410" cy="350" r="14"/><circle cx="490" cy="285" r="14"/></svg>;
    case "diffraction": return <svg {...common}><circle cx="320" cy="210" r="60"/><circle cx="320" cy="210" r="120"/><circle cx="320" cy="210" r="175"/><path d="M320 30v360M140 210h360M193 83l254 254M447 83 193 337"/><circle cx="320" cy="210" r="7"/></svg>;
    case "parabola": return <svg {...common}><path d="M100 350Q320 75 540 350M320 80v300M150 85 320 220 490 85M205 85 320 220 435 85M260 85 320 220 380 85"/><circle cx="320" cy="220" r="7"/></svg>;
    case "michelson": return <svg {...common}><path d="M85 210h235M320 210h235M320 210V55M320 210v155M295 185l50 50M535 180v60M290 65h60M290 345h60"/><circle cx="320" cy="210" r="7"/></svg>;
    case "helix": return <svg {...common}><path d="M220 45C470 95 470 165 220 210S-30 325 220 375M420 45C170 95 170 165 420 210s250 115 0 165M270 75h100M220 120h200M265 165h110M265 255h110M220 300h200M270 345h100"/></svg>;
    case "graph": return <svg {...common}><path d="M105 250 195 145 290 220 375 125 480 205 555 110M290 220 355 325M480 205 530 335M195 145 115 75M355 325 235 360M355 325 530 335"/><circle cx="105" cy="250" r="11"/><circle cx="195" cy="145" r="15"/><circle cx="290" cy="220" r="20"/><circle cx="375" cy="125" r="14"/><circle cx="480" cy="205" r="21"/><circle cx="555" cy="110" r="11"/></svg>;
    case "rays": return <svg {...common}><path d="M55 210h530M70 110 265 165 415 210 570 210M70 310 265 255 415 210 570 210"/><ellipse cx="265" cy="210" rx="20" ry="105"/><ellipse cx="415" cy="210" rx="18" ry="95"/></svg>;
    case "atom": return <svg {...common}><ellipse cx="320" cy="210" rx="185" ry="75"/><ellipse cx="320" cy="210" rx="185" ry="75" transform="rotate(60 320 210)"/><ellipse cx="320" cy="210" rx="185" ry="75" transform="rotate(120 320 210)"/><circle cx="320" cy="210" r="25"/></svg>;
    case "waves": return <svg {...common}><circle cx="230" cy="210" r="40"/><circle cx="230" cy="210" r="80"/><circle cx="230" cy="210" r="120"/><circle cx="230" cy="210" r="160"/><circle cx="410" cy="210" r="40"/><circle cx="410" cy="210" r="80"/><circle cx="410" cy="210" r="120"/><circle cx="410" cy="210" r="160"/></svg>;
    case "magnetic": return <svg {...common}><rect x="255" y="180" width="130" height="60" rx="5"/><path d="M255 190C150 80 90 120 72 210M255 205C165 145 125 165 110 210M255 225C170 280 125 260 110 215M385 190C490 80 550 120 568 210M385 205C475 145 515 165 530 210M385 225C470 280 515 260 530 215M255 180C190 50 450 50 385 180M255 240C190 370 450 370 385 240"/></svg>;
    case "rings": return <svg {...common}><circle cx="320" cy="210" r="35"/><circle cx="320" cy="210" r="65"/><circle cx="320" cy="210" r="95"/><circle cx="320" cy="210" r="125"/><circle cx="320" cy="210" r="155"/><circle cx="320" cy="210" r="7"/></svg>;
    case "chladni": return <svg {...common}><path d="M110 70h420v280H110zM320 70v280M110 210h420"/><path d="M150 95C245 115 235 195 320 210C405 225 395 305 490 325M490 95C395 115 405 195 320 210C235 225 245 305 150 325M185 70C205 145 275 150 320 210C365 270 435 275 455 350M455 70C435 145 365 150 320 210C275 270 205 275 185 350"/></svg>;
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

  function goTo(nextIndex: number) {
    if (!category || nextIndex === index) return;
    setDirection(nextIndex > index ? "next" : "previous");
    setIndex(nextIndex);
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
                <span>{active.level} · {String(index + 1).padStart(2, "0")} / {String(category.examples.length).padStart(2, "0")}</span>
              </div>

              <div className={styles.viewerStage}>
                <button type="button" className={`${styles.sideArrow} ${styles.sideArrowLeft}`} onClick={() => step(-1)} aria-label="Previous example"><span aria-hidden="true">←</span><small>Previous</small></button>
                <div className={`${styles.pair} ${direction === "next" ? styles.moveNext : styles.movePrevious}`} key={`${category.id}-${index}`}>
                  <div className={styles.patternPanel}>
                    <div className={styles.patternMeta}><div><small>Pattern</small><h2>{active.patternName}</h2></div><span className={`${styles.levelBadge} ${styles[`level${active.level}`]}`}>{active.level}</span></div>
                    <div className={styles.patternCanvas}><PatternDiagram pattern={active.pattern} /></div>
                    <p>{active.note}</p>
                  </div>
                  <figure className={styles.photoPanel}>
                    <img src={active.image} alt={active.alt} decoding="async" />
                    <figcaption><div><small>Real example</small><h2>{active.title}</h2></div><a href={active.source} target="_blank" rel="noreferrer">Source ↗</a></figcaption>
                  </figure>
                </div>
                <button type="button" className={`${styles.sideArrow} ${styles.sideArrowRight}`} onClick={() => step(1)} aria-label="Next example"><small>Next</small><span aria-hidden="true">→</span></button>
              </div>

              <div className={styles.navigation}>
                <button type="button" onClick={() => step(-1)} aria-label="Previous example">←</button>
                <div className={styles.dots}>{category.examples.map((example, dotIndex) => <button key={example.title} type="button" className={`${dotIndex === index ? styles.activeDot : ""} ${styles[`dot${example.level}`]}`} title={`${example.level}: ${example.title}`} aria-label={`Show ${example.title}, ${example.level}`} onClick={() => goTo(dotIndex)} />)}</div>
                <button type="button" className={styles.nextButton} onClick={() => step(1)} aria-label="Next example">→</button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
