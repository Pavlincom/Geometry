"use client";

import { Grid, Line, OrbitControls, TransformControls } from "@react-three/drei";
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Camera, Color, Group, Plane, Vector3 } from "three";
import { useEditorStore, Vec3Tuple } from "@/lib/editor-store";
import styles from "./editor-controls.module.css";

const GRID_STEP = 0.5;

export type CameraPreset = "fit" | "iso" | "top" | "front" | "right";
export type CameraRequest = { preset: CameraPreset; version: number };
export type TransformMode = "translate" | "rotate" | "scale";

type SelectionBox = {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  additive: boolean;
};

const TRANSFORM_MODES: Array<{ mode: TransformMode; label: string; key: string }> = [
  { mode: "translate", label: "Move", key: "W" },
  { mode: "rotate", label: "Rotate", key: "E" },
  { mode: "scale", label: "Scale", key: "R" },
];

function snapCoordinate(value: number, enabled: boolean) {
  if (enabled) return Math.round(value / GRID_STEP) * GRID_STEP;
  return Math.round(value * 100) / 100;
}

function CameraBridge({ cameraRef }: { cameraRef: { current: Camera | null } }) {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    cameraRef.current = camera;
    return () => {
      cameraRef.current = null;
    };
  }, [camera, cameraRef]);

  return null;
}

function CameraDirector({ request }: { request: CameraRequest }) {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls);
  const points = useEditorStore((state) => state.points);
  const pointsRef = useRef(points);
  pointsRef.current = points;

  useEffect(() => {
    if (request.version === 0) return;

    const currentPoints = pointsRef.current;
    let center = new Vector3(0, 1, 0);
    let span = 4;

    if (currentPoints.length > 0) {
      let minX = Infinity;
      let minY = Infinity;
      let minZ = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      let maxZ = -Infinity;

      currentPoints.forEach((point) => {
        minX = Math.min(minX, point.position[0]);
        minY = Math.min(minY, point.position[1]);
        minZ = Math.min(minZ, point.position[2]);
        maxX = Math.max(maxX, point.position[0]);
        maxY = Math.max(maxY, point.position[1]);
        maxZ = Math.max(maxZ, point.position[2]);
      });

      center = new Vector3((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2);
      span = Math.max(maxX - minX, maxY - minY, maxZ - minZ, 2);
    }

    const distance = Math.max(4.8, span * 2.1);
    let direction: Vector3;

    if (request.preset === "fit") {
      direction = camera.position.clone().sub(center);
      if (direction.lengthSq() < 0.001) direction.set(1, 0.8, 1);
    } else if (request.preset === "top") {
      direction = new Vector3(0, 1, 0.001);
    } else if (request.preset === "front") {
      direction = new Vector3(0, 0, 1);
    } else if (request.preset === "right") {
      direction = new Vector3(1, 0, 0);
    } else {
      direction = new Vector3(1, 0.8, 1);
    }

    direction.normalize();
    camera.up.set(0, 1, 0);
    if (request.preset === "top") camera.up.set(0, 0, -1);
    camera.position.copy(center).addScaledVector(direction, distance);
    camera.lookAt(center);

    const orbit = controls as unknown as {
      target?: Vector3;
      update?: () => void;
    } | null;
    orbit?.target?.copy(center);
    orbit?.update?.();
  }, [camera, controls, request]);

  return null;
}

function Scene({
  cameraRequest,
  transformMode,
  boxSelectEnabled,
  cameraRef,
}: {
  cameraRequest: CameraRequest;
  transformMode: TransformMode;
  boxSelectEnabled: boolean;
  cameraRef: { current: Camera | null };
}) {
  const points = useEditorStore((state) => state.points);
  const edges = useEditorStore((state) => state.edges);
  const selectedIds = useEditorStore((state) => state.selectedIds);
  const snapToGrid = useEditorStore((state) => state.snapToGrid);
  const addPoint = useEditorStore((state) => state.addPoint);
  const selectPoint = useEditorStore((state) => state.selectPoint);
  const movePoints = useEditorStore((state) => state.movePoints);
  const beginGesture = useEditorStore((state) => state.beginGesture);
  const endGesture = useEditorStore((state) => state.endGesture);

  const [isDragging, setIsDragging] = useState(false);
  const [isGizmoDragging, setIsGizmoDragging] = useState(false);

  const dragPointId = useRef<string | null>(null);
  const dragIds = useRef<string[]>([]);
  const dragStartPositions = useRef(new Map<string, Vec3Tuple>());
  const dragStartHit = useRef(new Vector3());
  const dragMoved = useRef(false);
  const suppressClickFor = useRef<string | null>(null);

  const gizmoTarget = useRef<Group>(null);
  const gizmoStartCenter = useRef(new Vector3());
  const gizmoStartPositions = useRef(new Map<string, Vec3Tuple>());

  const dragPlane = useMemo(() => new Plane(new Vector3(0, 1, 0), 0), []);
  const dragHit = useMemo(() => new Vector3(), []);

  const pointMap = useMemo(
    () => new Map(points.map((point) => [point.id, point.position])),
    [points]
  );
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectedPoints = useMemo(
    () => points.filter((point) => selectedSet.has(point.id)),
    [points, selectedSet]
  );
  const selectionCenter = useMemo<Vec3Tuple | null>(() => {
    if (selectedPoints.length === 0) return null;

    const sum = selectedPoints.reduce(
      (acc, point) => {
        acc[0] += point.position[0];
        acc[1] += point.position[1];
        acc[2] += point.position[2];
        return acc;
      },
      [0, 0, 0] as Vec3Tuple
    );

    return [
      sum[0] / selectedPoints.length,
      sum[1] / selectedPoints.length,
      sum[2] / selectedPoints.length,
    ];
  }, [selectedPoints]);

  const handleFloorClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    const x = snapCoordinate(event.point.x, snapToGrid);
    const z = snapCoordinate(event.point.z, snapToGrid);
    addPoint([x, 0, z]);
  };

  const finishDrag = (event: ThreeEvent<PointerEvent>, pointId: string) => {
    if (dragPointId.current !== pointId) return;

    event.stopPropagation();
    if (dragMoved.current) suppressClickFor.current = pointId;

    dragPointId.current = null;
    dragIds.current = [];
    dragStartPositions.current = new Map();
    dragMoved.current = false;
    setIsDragging(false);
    endGesture();

    const target = event.target as unknown as {
      releasePointerCapture?: (pointerId: number) => void;
    };
    target.releasePointerCapture?.(event.pointerId);
  };

  const transformSelection = () => {
    const target = gizmoTarget.current;
    if (!target) return;

    if (transformMode === "translate") {
      const dx = target.position.x - gizmoStartCenter.current.x;
      const dy = target.position.y - gizmoStartCenter.current.y;
      const dz = target.position.z - gizmoStartCenter.current.z;

      movePoints(
        Array.from(gizmoStartPositions.current.entries()).map(([id, start]) => ({
          id,
          position: [start[0] + dx, start[1] + dy, start[2] + dz] as Vec3Tuple,
        }))
      );
      return;
    }

    const center = gizmoStartCenter.current;

    if (transformMode === "rotate") {
      movePoints(
        Array.from(gizmoStartPositions.current.entries()).map(([id, start]) => {
          const relative = new Vector3(
            start[0] - center.x,
            start[1] - center.y,
            start[2] - center.z
          ).applyQuaternion(target.quaternion);

          return {
            id,
            position: [
              center.x + relative.x,
              center.y + relative.y,
              center.z + relative.z,
            ] as Vec3Tuple,
          };
        })
      );
      return;
    }

    movePoints(
      Array.from(gizmoStartPositions.current.entries()).map(([id, start]) => {
        const relative = new Vector3(
          start[0] - center.x,
          start[1] - center.y,
          start[2] - center.z
        ).multiply(target.scale);

        return {
          id,
          position: [
            center.x + relative.x,
            center.y + relative.y,
            center.z + relative.z,
          ] as Vec3Tuple,
        };
      })
    );
  };

  return (
    <>
      <color attach="background" args={[new Color("#0a0b0d")]} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 8, 5]} intensity={2.1} />

      <Grid
        position={[0, -0.02, 0]}
        args={[30, 30]}
        cellSize={GRID_STEP}
        cellThickness={0.45}
        cellColor="#2b2e34"
        sectionSize={2.5}
        sectionThickness={0.8}
        sectionColor="#4b505a"
        fadeDistance={18}
        fadeStrength={1.5}
        infiniteGrid
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.04, 0]}
        onDoubleClick={handleFloorClick}
      >
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {edges.map((edge) => {
        const a = pointMap.get(edge.a);
        const b = pointMap.get(edge.b);
        if (!a || !b) return null;

        const selectedEdge = selectedSet.has(edge.a) && selectedSet.has(edge.b);

        return (
          <Line
            key={edge.id}
            points={[a, b]}
            color={selectedEdge ? "#ff8a68" : "#d9dce2"}
            lineWidth={selectedEdge ? 2 : 1.3}
            transparent
            opacity={selectedEdge ? 0.95 : 0.72}
          />
        );
      })}

      {points.map((point) => {
        const selected = selectedSet.has(point.id);

        return (
          <mesh
            key={point.id}
            position={point.position}
            scale={selected ? 1.35 : 1}
            onPointerDown={(event) => {
              if (event.button !== 0 || isGizmoDragging) return;
              if (transformMode !== "translate") {
                event.stopPropagation();
                return;
              }
              event.stopPropagation();

              const movingIds = selected && selectedIds.length > 1 ? [...selectedIds] : [point.id];

              if (!selected) selectPoint(point.id);

              dragPlane.setFromNormalAndCoplanarPoint(
                new Vector3(0, 1, 0),
                new Vector3(0, point.position[1], 0)
              );

              const hit = event.ray.intersectPlane(dragPlane, dragStartHit.current);
              if (!hit) return;

              beginGesture();
              dragPointId.current = point.id;
              dragIds.current = movingIds;
              dragStartPositions.current = new Map(
                movingIds.flatMap((id) => {
                  const position = pointMap.get(id);
                  return position ? [[id, [...position] as Vec3Tuple] as const] : [];
                })
              );
              dragMoved.current = false;
              setIsDragging(true);

              const target = event.target as unknown as {
                setPointerCapture?: (pointerId: number) => void;
              };
              target.setPointerCapture?.(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (dragPointId.current !== point.id) return;
              event.stopPropagation();

              const hit = event.ray.intersectPlane(dragPlane, dragHit);
              if (!hit) return;

              const anchor = dragStartPositions.current.get(point.id);
              if (!anchor) return;

              const rawDx = hit.x - dragStartHit.current.x;
              const rawDz = hit.z - dragStartHit.current.z;
              const targetX = snapCoordinate(anchor[0] + rawDx, snapToGrid);
              const targetZ = snapCoordinate(anchor[2] + rawDz, snapToGrid);
              const dx = targetX - anchor[0];
              const dz = targetZ - anchor[2];

              if (Math.abs(dx) > 0.0001 || Math.abs(dz) > 0.0001) dragMoved.current = true;

              movePoints(
                dragIds.current.flatMap((id) => {
                  const start = dragStartPositions.current.get(id);
                  if (!start) return [];

                  return [{
                    id,
                    position: [start[0] + dx, start[1], start[2] + dz] as Vec3Tuple,
                  }];
                })
              );
            }}
            onPointerUp={(event) => finishDrag(event, point.id)}
            onClick={(event) => {
              event.stopPropagation();

              if (suppressClickFor.current === point.id) {
                suppressClickFor.current = null;
                return;
              }

              const additive = event.shiftKey || event.ctrlKey || event.metaKey;
              selectPoint(point.id, additive);
            }}
            onDoubleClick={(event) => event.stopPropagation()}
          >
            <sphereGeometry args={[0.105, 32, 32]} />
            <meshStandardMaterial
              color={selected ? "#ff7a59" : "#f4f5f6"}
              emissive={selected ? "#8e2c16" : "#25272b"}
            />
          </mesh>
        );
      })}

      {selectionCenter && !boxSelectEnabled && (
        <TransformControls
          mode={transformMode}
          space="world"
          size={0.78}
          translationSnap={snapToGrid ? GRID_STEP : null}
          onMouseDown={() => {
            const target = gizmoTarget.current;
            if (!target) return;

            beginGesture();
            setIsGizmoDragging(true);

            gizmoStartCenter.current.set(selectionCenter[0], selectionCenter[1], selectionCenter[2]);
            gizmoStartPositions.current = new Map(
              selectedPoints.map((point) => [point.id, [...point.position] as Vec3Tuple])
            );

            target.position.set(selectionCenter[0], selectionCenter[1], selectionCenter[2]);
            target.rotation.set(0, 0, 0);
            target.scale.set(1, 1, 1);
            target.updateMatrixWorld();
          }}
          onObjectChange={transformSelection}
          onMouseUp={() => {
            const target = gizmoTarget.current;
            if (target) {
              target.rotation.set(0, 0, 0);
              target.scale.set(1, 1, 1);
            }

            setIsGizmoDragging(false);
            gizmoStartPositions.current = new Map();
            endGesture();
          }}
        >
          <group ref={gizmoTarget} position={selectionCenter} />
        </TransformControls>
      )}

      <OrbitControls
        makeDefault
        enabled={!isDragging && !isGizmoDragging && !boxSelectEnabled}
        enableDamping
        dampingFactor={0.07}
        minDistance={3}
        maxDistance={60}
      />
      <CameraBridge cameraRef={cameraRef} />
      <CameraDirector request={cameraRequest} />
    </>
  );
}

export function GeometryCanvas({ cameraRequest }: { cameraRequest: CameraRequest }) {
  const points = useEditorStore((state) => state.points);
  const selectedIds = useEditorStore((state) => state.selectedIds);
  const selectPoint = useEditorStore((state) => state.selectPoint);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const selectedCount = selectedIds.length;

  const cameraRef = useRef<Camera | null>(null);
  const [transformMode, setTransformMode] = useState<TransformMode>("translate");
  const [boxSelectEnabled, setBoxSelectEnabled] = useState(false);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);

  useEffect(() => {
    if (selectedCount < 2 && transformMode !== "translate") {
      setTransformMode("translate");
    }
  }, [selectedCount, transformMode]);

  useEffect(() => {
    if (!boxSelectEnabled) setSelectionBox(null);
  }, [boxSelectEnabled]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (isTyping || event.metaKey || event.ctrlKey || event.altKey) return;

      const key = event.key.toLowerCase();
      if (key === "b") {
        setBoxSelectEnabled((current) => !current);
        return;
      }
      if (key === "w") {
        setBoxSelectEnabled(false);
        setTransformMode("translate");
      }
      if (key === "e" && selectedCount > 1) {
        setBoxSelectEnabled(false);
        setTransformMode("rotate");
      }
      if (key === "r" && selectedCount > 1) {
        setBoxSelectEnabled(false);
        setTransformMode("scale");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCount]);

  function pointerPosition(event: ReactPointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      bounds,
    };
  }

  function beginBoxSelection(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    const { x, y } = pointerPosition(event);
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelectionBox({
      startX: x,
      startY: y,
      currentX: x,
      currentY: y,
      additive: event.shiftKey || event.ctrlKey || event.metaKey,
    });
  }

  function moveBoxSelection(event: ReactPointerEvent<HTMLDivElement>) {
    if (!selectionBox) return;
    const { x, y } = pointerPosition(event);
    setSelectionBox((current) => current ? { ...current, currentX: x, currentY: y } : null);
  }

  function finishBoxSelection(event: ReactPointerEvent<HTMLDivElement>) {
    if (!selectionBox) return;

    const { x, y, bounds } = pointerPosition(event);
    const completed = { ...selectionBox, currentX: x, currentY: y };
    const camera = cameraRef.current;

    if (camera) {
      camera.updateMatrixWorld();
      const minX = Math.min(completed.startX, completed.currentX);
      const maxX = Math.max(completed.startX, completed.currentX);
      const minY = Math.min(completed.startY, completed.currentY);
      const maxY = Math.max(completed.startY, completed.currentY);

      const ids = points.flatMap((point) => {
        const projected = new Vector3(...point.position).project(camera);
        if (projected.z < -1 || projected.z > 1) return [];

        const screenX = ((projected.x + 1) / 2) * bounds.width;
        const screenY = ((1 - projected.y) / 2) * bounds.height;
        const inside = screenX >= minX && screenX <= maxX && screenY >= minY && screenY <= maxY;
        return inside ? [point.id] : [];
      });

      if (!completed.additive) clearSelection();
      ids.forEach((id) => {
        if (!completed.additive || !selectedIds.includes(id)) selectPoint(id, true);
      });
    }

    setSelectionBox(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const marqueeStyle = selectionBox
    ? {
        left: Math.min(selectionBox.startX, selectionBox.currentX),
        top: Math.min(selectionBox.startY, selectionBox.currentY),
        width: Math.abs(selectionBox.currentX - selectionBox.startX),
        height: Math.abs(selectionBox.currentY - selectionBox.startY),
      }
    : undefined;

  return (
    <>
      <div className={styles.transformToolbar} aria-label="Studio mode">
        {TRANSFORM_MODES.map((item) => {
          const groupOnly = item.mode !== "translate";
          const disabled = groupOnly && selectedCount < 2;
          return (
            <button
              key={item.mode}
              type="button"
              className={!boxSelectEnabled && transformMode === item.mode ? styles.activeTransform : ""}
              disabled={disabled}
              onClick={() => {
                setBoxSelectEnabled(false);
                setTransformMode(item.mode);
              }}
              title={`${item.label} (${item.key})${groupOnly ? " · select 2+ points" : ""}`}
            >
              <span>{item.key}</span>{item.label}
            </button>
          );
        })}
        <button
          type="button"
          className={boxSelectEnabled ? styles.activeTransform : ""}
          aria-pressed={boxSelectEnabled}
          onClick={() => setBoxSelectEnabled((current) => !current)}
          title="Box select (B) · Shift-drag adds to the current selection"
        >
          <span>B</span>Box
        </button>
      </div>

      <Canvas
        camera={{ position: [6.5, 5.2, 7.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Scene
          cameraRequest={cameraRequest}
          transformMode={transformMode}
          boxSelectEnabled={boxSelectEnabled}
          cameraRef={cameraRef}
        />
      </Canvas>

      {boxSelectEnabled && (
        <div
          className={styles.boxSelectionLayer}
          onPointerDown={beginBoxSelection}
          onPointerMove={moveBoxSelection}
          onPointerUp={finishBoxSelection}
          onPointerCancel={() => setSelectionBox(null)}
        >
          {selectionBox && <div className={styles.selectionMarquee} style={marqueeStyle} />}
          <div className={styles.boxSelectionHint}>Drag to select · Shift adds</div>
        </div>
      )}
    </>
  );
}
