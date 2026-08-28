"use client";

import { Grid, Line, OrbitControls } from "@react-three/drei";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { useMemo } from "react";
import { Color } from "three";
import { useEditorStore } from "@/lib/editor-store";

function Scene() {
  const points = useEditorStore((state) => state.points);
  const edges = useEditorStore((state) => state.edges);
  const selectedIds = useEditorStore((state) => state.selectedIds);
  const addPoint = useEditorStore((state) => state.addPoint);
  const togglePoint = useEditorStore((state) => state.togglePoint);

  const pointMap = useMemo(() => new Map(points.map((point) => [point.id, point.position])), [points]);

  const handleFloorClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    const x = Math.round(event.point.x * 10) / 10;
    const z = Math.round(event.point.z * 10) / 10;
    addPoint([x, 0, z]);
  };

  return (
    <>
      <color attach="background" args={[new Color("#0a0b0d")]} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 8, 5]} intensity={2.1} />

      <Grid
        position={[0, -0.02, 0]}
        args={[30, 30]}
        cellSize={0.5}
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
            onClick={(event) => {
              event.stopPropagation();
              togglePoint(point.id);
            }}
          >
            <sphereGeometry args={[0.105, 32, 32]} />
            <meshStandardMaterial color={selected ? "#ff7a59" : "#f4f5f6"} emissive={selected ? "#8e2c16" : "#25272b"} />
          </mesh>
        );
      })}

      <OrbitControls makeDefault enableDamping dampingFactor={0.07} minDistance={3} maxDistance={24} />
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
