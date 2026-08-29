"use client";

import { Grid, Line, OrbitControls, TransformControls } from "@react-three/drei";
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Color, Group, Plane, Vector3 } from "three";
import { useEditorStore, Vec3Tuple } from "@/lib/editor-store";

const GRID_STEP = 0.5;

export type CameraPreset = "fit" | "iso" | "top" | "front" | "right";
export type CameraRequest = { preset: CameraPreset; version: number };

function snapCoordinate(value: number, enabled: boolean) {
  if (enabled) return Math.round(value / GRID_STEP) * GRID_STEP;
  return Math.round(value * 100) / 100;
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

function Scene({ cameraRequest }: { cameraRequest: CameraRequest }) {
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
  const [isGizmoDragging, setIsGizmoDragging] = useState(false);
  const dragPointId = useRef<string | null>(null);
  const dragY = useRef(0);
  const dragMoved = useRef(false);
  const suppressClickFor = useRef<string | null>(null);
  const gizmoTarget = useRef<Group>(null);
  const dragPlane = useMemo(() => new Plane(new Vector3(0, 1, 0), 0), []);
  const dragHit = useMemo(() => new Vector3(), []);

  const pointMap = useMemo(() => new Map(points.map((point) => [point.id, point.position])), [points]);
  const selectedPoint = selectedIds.length === 1
    ? points.find((point) => point.id === selectedIds[0])
    : undefined;

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
              if (event.button !== 0 || isGizmoDragging) return;
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

      {selectedPoint && (
        <TransformControls
          mode="translate"
          space="world"
          size={0.78}
          translationSnap={snapToGrid ? GRID_STEP : null}
          onMouseDown={() => {
            beginGesture();
            setIsGizmoDragging(true);
          }}
          onObjectChange={() => {
            const target = gizmoTarget.current;
            if (!target) return;

            const position: Vec3Tuple = [
              snapCoordinate(target.position.x, snapToGrid),
              snapCoordinate(target.position.y, snapToGrid),
              snapCoordinate(target.position.z, snapToGrid),
            ];

            movePoint(selectedPoint.id, position);
          }}
          onMouseUp={() => {
            setIsGizmoDragging(false);
            endGesture();
          }}
        >
          <group ref={gizmoTarget} position={selectedPoint.position} />
        </TransformControls>
      )}

      <OrbitControls
        makeDefault
        enabled={!isDragging && !isGizmoDragging}
        enableDamping
        dampingFactor={0.07}
        minDistance={3}
        maxDistance={60}
      />
      <CameraDirector request={cameraRequest} />
    </>
  );
}

export function GeometryCanvas({ cameraRequest }: { cameraRequest: CameraRequest }) {
  return (
    <Canvas camera={{ position: [6.5, 5.2, 7.2], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <Scene cameraRequest={cameraRequest} />
    </Canvas>
  );
}
