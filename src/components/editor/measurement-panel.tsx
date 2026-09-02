"use client";

import { useMemo } from "react";
import { useEditorStore, Vec3Tuple } from "@/lib/editor-store";
import styles from "./measurement-panel.module.css";

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 3,
});

function formatValue(value: number) {
  if (!Number.isFinite(value)) return "—";
  return numberFormatter.format(Math.abs(value) < 0.0005 ? 0 : value);
}

function subtract(a: Vec3Tuple, b: Vec3Tuple): Vec3Tuple {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function length(vector: Vec3Tuple) {
  return Math.hypot(vector[0], vector[1], vector[2]);
}

function distance(a: Vec3Tuple, b: Vec3Tuple) {
  return length(subtract(b, a));
}

function angleAt(a: Vec3Tuple, b: Vec3Tuple, c: Vec3Tuple) {
  const ba = subtract(a, b);
  const bc = subtract(c, b);
  const baLength = length(ba);
  const bcLength = length(bc);

  if (baLength < 1e-9 || bcLength < 1e-9) return null;

  const dot = ba[0] * bc[0] + ba[1] * bc[1] + ba[2] * bc[2];
  const cosine = Math.max(-1, Math.min(1, dot / (baLength * bcLength)));
  return (Math.acos(cosine) * 180) / Math.PI;
}

export function MeasurementPanel() {
  const points = useEditorStore((state) => state.points);
  const selectedIds = useEditorStore((state) => state.selectedIds);

  const selectedPoints = useMemo(() => {
    const pointMap = new Map(points.map((point) => [point.id, point]));
    return selectedIds.flatMap((id) => {
      const point = pointMap.get(id);
      return point ? [point] : [];
    });
  }, [points, selectedIds]);

  const measurement = useMemo(() => {
    if (selectedPoints.length === 2) {
      const [a, b] = selectedPoints;
      const delta = subtract(b.position, a.position);
      return {
        kind: "distance" as const,
        distance: distance(a.position, b.position),
        delta,
      };
    }

    if (selectedPoints.length === 3) {
      const [a, b, c] = selectedPoints;
      return {
        kind: "angle" as const,
        angle: angleAt(a.position, b.position, c.position),
        ab: distance(a.position, b.position),
        bc: distance(b.position, c.position),
      };
    }

    return null;
  }, [selectedPoints]);

  return (
    <aside className={styles.panel} aria-live="polite" aria-label="Geometry measurements">
      <div className={styles.heading}>
        <span>Measure</span>
        <strong>{selectedPoints.length} selected</strong>
      </div>

      {!measurement && (
        <p className={styles.empty}>
          Select 2 points for distance or 3 points for an angle.
        </p>
      )}

      {measurement?.kind === "distance" && (
        <>
          <div className={styles.primaryMeasure}>
            <span>Distance A → B</span>
            <strong>{formatValue(measurement.distance)} <small>u</small></strong>
          </div>
          <div className={styles.detailGrid}>
            <div><span>ΔX</span><strong>{formatValue(measurement.delta[0])}</strong></div>
            <div><span>ΔY</span><strong>{formatValue(measurement.delta[1])}</strong></div>
            <div><span>ΔZ</span><strong>{formatValue(measurement.delta[2])}</strong></div>
          </div>
        </>
      )}

      {measurement?.kind === "angle" && (
        <>
          <div className={styles.primaryMeasure}>
            <span>Angle A–B–C</span>
            <strong>
              {measurement.angle === null ? "Undefined" : `${formatValue(measurement.angle)}°`}
            </strong>
          </div>
          <p className={styles.angleHint}>B is the second point selected and acts as the vertex.</p>
          <div className={styles.detailGridTwo}>
            <div><span>A–B</span><strong>{formatValue(measurement.ab)} u</strong></div>
            <div><span>B–C</span><strong>{formatValue(measurement.bc)} u</strong></div>
          </div>
        </>
      )}
    </aside>
  );
}
