"use client";

import { Grid, Line, OrbitControls } from "@react-three/drei";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Color, Plane, Vector3 } from "three";
import { useEditorStore, Vec3Tuple } from "@/lib/editor-store";

const GRID_STEP = 0.5;

function snapCoordinate(value: number, enabled: boolean) {
  if (enabled) return Math.round(value / GRID_STEP) * GRID_STEP;
  return Math.round(value * 100) / 100;
}

function Scene() {
  const points = useEditorStore((state) => state.points);
  const edges = useEditorStore((state) => state.edges);
  const selectedIds = useEditorStore((state) => state.selectedIds);
  const snapToGrid = useEditorStore((state) => state.snapToGrid);
  const addPoint = useEditorStore((state) => state.addPoint);
  const togglePoint = useEditorStore((state) => state.togglePoint);
  const movePoint = useEditorStore((state) => state.movePoint);
  const beginGesture = useEditorStore((state) => state.beginGesture);
  const endGesture = useEditorStore((state) => state.endGesture);

  const [isDragging, setIsDragging] = useState(false);
  const dragPointId = useRef<string | null>(null);
  const dragY = useRef(0);
  const dragMoved = useRef(false);
  const suppressClickFor = useRef<string | null>(null);
  const dragPlane = useMemo(() => new Plane(new Vector3(0, 1, 0), 0), []);
  const dragHit = useMemo(() => new Vector3(), []);

  const pointMap = useMemo(() => new Map(points.map((point) => [point.id, point.position])), [points]);

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
    dragMoved.current = false;
    setIsDragging(false);
    endGesture();

    const target = event.target as unknown as {
      releasePointerCapture?: (pointerId: number) => void;
    };
    target.releasePointerCapture?.(event.pointerId);
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

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} onDoubleClick={handleFloorClick}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {edges.map((edge) => {
        const a = pointMap.get(edge.a);
        const b = pointMap.get(edge.b);
        if (!a || !b) return null;
        return <Line key={edge.id} points={[a, b]} color="#d9dce2" lineWidth={1.3} transparent opacity={0.72} />;
      })}

      {points.map((point) => {
        const selected = selectedIds.includes(point.id);

        return (
          <mesh
            key={point.id}
            position={point.position}
            scale={selected ? 1.35 : 1}
            onPointerDown={(event) => {
              if (event.button !== 0) return;
              event.stopPropagation();

              beginGesture();
              dragPointId.current = point.id;
              dragY.current = point.position[1];
              dragMoved.current = false;
              dragPlane.setFromNormalAndCoplanarPoint(
                new Vector3(0, 1, 0),
                new Vector3(0, point.position[1], 0)
              );
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

              const position: Vec3Tuple = [
                snapCoordinate(hit.x, snapToGrid),
                dragY.current,
                snapCoordinate(hit.z, snapToGrid),
              ];
              const current = pointMap.get(point.id);

              if (
                current &&
                (current[0] !== position[0] || current[1] !== position[1] || current[2] !== position[2])
              ) {
                dragMoved.current = true;
                movePoint(point.id, position);
              }
            }}
            onPointerUp={(event) => finishDrag(event, point.id)}
            onClick={(event) => {
              event.stopPropagation();
              if (suppressClickFor.current === point.id) {
                suppressClickFor.current = null;
                return;
              }
              togglePoint(point.id);
            }}
            onDoubleClick={(event) => event.stopPropagation()}
          >
            <sphereGeometry args={[0.105, 32, 32]} />
            <meshStandardMaterial color={selected ? "#ff7a59" : "#f4f5f6"} emissive={selected ? "#8e2c16" : "#25272b"} />
          </mesh>
        );
      })}

      <OrbitControls
        makeDefault
        enabled={!isDragging}
        enableDamping
        dampingFactor={0.07}
        minDistance={3}
        maxDistance={24}
      />
    </>
  );
}

export function GeometryCanvas() {
  return (
    <Canvas camera={{ position: [6.5, 5.2, 7.2], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <Scene />
    </Canvas>
  );
}
