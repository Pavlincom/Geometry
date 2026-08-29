import { create } from "zustand";

export type Vec3Tuple = [number, number, number];
export type GeometryPoint = { id: string; position: Vec3Tuple };
export type GeometryEdge = { id: string; a: string; b: string };
export type PrimitiveKind = "cube" | "tetrahedron" | "octahedron" | "star";

type GeometrySnapshot = {
  points: GeometryPoint[];
  edges: GeometryEdge[];
};

type GeometryClipboard = {
  points: GeometryPoint[];
  edges: GeometryEdge[];
};

type PointMove = {
  id: string;
  position: Vec3Tuple;
};

type EditorState = {
  points: GeometryPoint[];
  edges: GeometryEdge[];
  selectedIds: string[];
  snapToGrid: boolean;
  historyPast: GeometrySnapshot[];
  historyFuture: GeometrySnapshot[];
  gestureStart: GeometrySnapshot | null;
  clipboard: GeometryClipboard | null;
  pasteGeneration: number;
  addPoint: (position: Vec3Tuple) => void;
  insertPrimitive: (kind: PrimitiveKind) => void;
  selectPoint: (id: string, additive?: boolean) => void;
  selectAll: () => void;
  clearSelection: () => void;
  connectSelected: () => void;
  updateSelectedAxis: (axis: 0 | 1 | 2, value: number) => void;
  movePoint: (id: string, position: Vec3Tuple) => void;
  movePoints: (moves: PointMove[]) => void;
  beginGesture: () => void;
  endGesture: () => void;
  copySelected: () => void;
  pasteClipboard: () => void;
  duplicateSelected: () => void;
  deleteSelected: () => void;
  loadDocument: (points: GeometryPoint[], edges: GeometryEdge[]) => void;
  reset: () => void;
  toggleSnap: () => void;
  undo: () => void;
  redo: () => void;
};

const HISTORY_LIMIT = 100;
const DUPLICATE_STEP = 0.5;

const initialPoints: GeometryPoint[] = [
  { id: "p1", position: [-2.4, 0.2, -1.4] },
  { id: "p2", position: [2.1, 0.4, -1.1] },
  { id: "p3", position: [0.4, 2.8, 0.2] },
  { id: "p4", position: [0.1, 0.8, 2.4] },
];

const initialEdges: GeometryEdge[] = [
  { id: "p1:p2", a: "p1", b: "p2" },
  { id: "p2:p3", a: "p2", b: "p3" },
  { id: "p3:p1", a: "p3", b: "p1" },
  { id: "p1:p4", a: "p1", b: "p4" },
  { id: "p2:p4", a: "p2", b: "p4" },
  { id: "p3:p4", a: "p3", b: "p4" },
];

const clonePoints = (points: GeometryPoint[]) =>
  points.map((point) => ({ ...point, position: [...point.position] as Vec3Tuple }));

const cloneEdges = (edges: GeometryEdge[]) => edges.map((edge) => ({ ...edge }));

const cloneInitialPoints = () => clonePoints(initialPoints);
const cloneInitialEdges = () => cloneEdges(initialEdges);

const snapshotFrom = (state: Pick<EditorState, "points" | "edges">): GeometrySnapshot => ({
  points: clonePoints(state.points),
  edges: cloneEdges(state.edges),
});

const snapshotsEqual = (a: GeometrySnapshot, b: GeometrySnapshot) => {
  if (a.points.length !== b.points.length || a.edges.length !== b.edges.length) return false;

  const samePoints = a.points.every((point, index) => {
    const other = b.points[index];
    return (
      point.id === other?.id &&
      point.position[0] === other.position[0] &&
      point.position[1] === other.position[1] &&
      point.position[2] === other.position[2]
    );
  });

  if (!samePoints) return false;

  return a.edges.every((edge, index) => {
    const other = b.edges[index];
    return edge.id === other?.id && edge.a === other.a && edge.b === other.b;
  });
};

const pushHistory = (history: GeometrySnapshot[], snapshot: GeometrySnapshot) =>
  [...history.slice(-(HISTORY_LIMIT - 1)), snapshot];

const completeGraphEdges = (indices: number[]) => {
  const edges: Array<[number, number]> = [];
  for (let a = 0; a < indices.length; a += 1) {
    for (let b = a + 1; b < indices.length; b += 1) {
      edges.push([indices[a], indices[b]]);
    }
  }
  return edges;
};

function primitiveDefinition(kind: PrimitiveKind): {
  positions: Vec3Tuple[];
  edges: Array<[number, number]>;
} {
  if (kind === "cube") {
    return {
      positions: [
        [-1, 0, -1], [1, 0, -1], [1, 0, 1], [-1, 0, 1],
        [-1, 2, -1], [1, 2, -1], [1, 2, 1], [-1, 2, 1],
      ],
      edges: [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
      ],
    };
  }

  if (kind === "tetrahedron") {
    return {
      positions: [[-1, 0, -1], [1, 0, -1], [0, 0, 1], [0, 2, 0]],
      edges: completeGraphEdges([0, 1, 2, 3]),
    };
  }

  if (kind === "octahedron") {
    return {
      positions: [[-1, 1, 0], [1, 1, 0], [0, 1, -1], [0, 1, 1], [0, 0, 0], [0, 2, 0]],
      edges: [
        [0, 2], [2, 1], [1, 3], [3, 0],
        [4, 0], [4, 1], [4, 2], [4, 3],
        [5, 0], [5, 1], [5, 2], [5, 3],
      ],
    };
  }

  return {
    positions: [
      [-1, 0, -1], [1, 0, -1], [1, 0, 1], [-1, 0, 1],
      [-1, 2, -1], [1, 2, -1], [1, 2, 1], [-1, 2, 1],
    ],
    edges: [
      ...completeGraphEdges([0, 2, 5, 7]),
      ...completeGraphEdges([1, 3, 4, 6]),
    ],
  };
}

function geometryFromSelection(
  state: Pick<EditorState, "points" | "edges" | "selectedIds">
): GeometryClipboard | null {
  if (state.selectedIds.length === 0) return null;

  const selected = new Set(state.selectedIds);
  const points = state.points.filter((point) => selected.has(point.id));

  if (points.length === 0) return null;

  return {
    points: clonePoints(points),
    edges: cloneEdges(
      state.edges.filter((edge) => selected.has(edge.a) && selected.has(edge.b))
    ),
  };
}

function cloneGeometry(
  source: GeometryClipboard,
  offset: Vec3Tuple
): GeometryClipboard {
  const idMap = new Map<string, string>();

  const points = source.points.map((point) => {
    const id = crypto.randomUUID();
    idMap.set(point.id, id);

    return {
      id,
      position: [
        point.position[0] + offset[0],
        point.position[1] + offset[1],
        point.position[2] + offset[2],
      ] as Vec3Tuple,
    };
  });

  const edges = source.edges.flatMap((edge) => {
    const a = idMap.get(edge.a);
    const b = idMap.get(edge.b);
    if (!a || !b) return [];

    return [{
      id: crypto.randomUUID(),
      a,
      b,
    }];
  });

  return { points, edges };
}

export const useEditorStore = create<EditorState>((set) => ({
  points: cloneInitialPoints(),
  edges: cloneInitialEdges(),
  selectedIds: [],
  snapToGrid: true,
  historyPast: [],
  historyFuture: [],
  gestureStart: null,
  clipboard: null,
  pasteGeneration: 0,

  addPoint: (position) =>
    set((state) => {
      const point = { id: crypto.randomUUID(), position: [...position] as Vec3Tuple };

      return {
        points: [...state.points, point],
        selectedIds: [point.id],
        historyPast: pushHistory(state.historyPast, snapshotFrom(state)),
        historyFuture: [],
      };
    }),

  insertPrimitive: (kind) =>
    set((state) => {
      const definition = primitiveDefinition(kind);
      const baseId = crypto.randomUUID();
      const maxX = state.points.length > 0
        ? Math.max(...state.points.map((point) => point.position[0]))
        : -3;
      const centerX = state.points.length > 0 ? Math.ceil((maxX + 3) * 2) / 2 : 0;

      const newPoints = definition.positions.map((position, index) => ({
        id: `${baseId}-p${index}`,
        position: [position[0] + centerX, position[1], position[2]] as Vec3Tuple,
      }));

      const newEdges = definition.edges.map(([a, b], index) => ({
        id: `${baseId}-e${index}`,
        a: newPoints[a].id,
        b: newPoints[b].id,
      }));

      return {
        points: [...state.points, ...newPoints],
        edges: [...state.edges, ...newEdges],
        selectedIds: newPoints.map((point) => point.id),
        historyPast: pushHistory(state.historyPast, snapshotFrom(state)),
        historyFuture: [],
      };
    }),

  selectPoint: (id, additive = false) =>
    set((state) => {
      if (!additive) {
        return { selectedIds: [id] };
      }

      if (state.selectedIds.includes(id)) {
        return { selectedIds: state.selectedIds.filter((item) => item !== id) };
      }

      return { selectedIds: [...state.selectedIds, id] };
    }),

  selectAll: () => set((state) => ({ selectedIds: state.points.map((point) => point.id) })),

  clearSelection: () => set({ selectedIds: [] }),

  connectSelected: () =>
    set((state) => {
      if (state.selectedIds.length !== 2) return state;
      const [a, b] = state.selectedIds;
      const exists = state.edges.some(
        (edge) => (edge.a === a && edge.b === b) || (edge.a === b && edge.b === a)
      );
      if (exists) return state;

      return {
        edges: [...state.edges, { id: `${a}:${b}`, a, b }],
        historyPast: pushHistory(state.historyPast, snapshotFrom(state)),
        historyFuture: [],
      };
    }),

  updateSelectedAxis: (axis, value) =>
    set((state) => {
      if (state.selectedIds.length !== 1 || !Number.isFinite(value)) return state;
      const selected = state.selectedIds[0];
      const selectedPoint = state.points.find((point) => point.id === selected);
      if (!selectedPoint || selectedPoint.position[axis] === value) return state;

      return {
        points: state.points.map((point) => {
          if (point.id !== selected) return point;
          const position = [...point.position] as Vec3Tuple;
          position[axis] = value;
          return { ...point, position };
        }),
        historyPast: pushHistory(state.historyPast, snapshotFrom(state)),
        historyFuture: [],
      };
    }),

  movePoint: (id, position) =>
    set((state) => {
      if (!position.every(Number.isFinite)) return state;
      return {
        points: state.points.map((point) =>
          point.id === id ? { ...point, position: [...position] as Vec3Tuple } : point
        ),
      };
    }),

  movePoints: (moves) =>
    set((state) => {
      if (moves.length === 0) return state;
      const moveMap = new Map(
        moves
          .filter((move) => move.position.every(Number.isFinite))
          .map((move) => [move.id, move.position] as const)
      );

      if (moveMap.size === 0) return state;

      return {
        points: state.points.map((point) => {
          const position = moveMap.get(point.id);
          return position
            ? { ...point, position: [...position] as Vec3Tuple }
            : point;
        }),
      };
    }),

  beginGesture: () =>
    set((state) => (state.gestureStart ? state : { gestureStart: snapshotFrom(state) })),

  endGesture: () =>
    set((state) => {
      if (!state.gestureStart) return state;
      const current = snapshotFrom(state);

      if (snapshotsEqual(state.gestureStart, current)) {
        return { gestureStart: null };
      }

      return {
        gestureStart: null,
        historyPast: pushHistory(state.historyPast, state.gestureStart),
        historyFuture: [],
      };
    }),

  copySelected: () =>
    set((state) => {
      const clipboard = geometryFromSelection(state);
      if (!clipboard) return state;

      return {
        clipboard,
        pasteGeneration: 0,
      };
    }),

  pasteClipboard: () =>
    set((state) => {
      if (!state.clipboard) return state;

      const generation = state.pasteGeneration + 1;
      const offset = generation * DUPLICATE_STEP;
      const clone = cloneGeometry(state.clipboard, [offset, 0, offset]);

      return {
        points: [...state.points, ...clone.points],
        edges: [...state.edges, ...clone.edges],
        selectedIds: clone.points.map((point) => point.id),
        pasteGeneration: generation,
        historyPast: pushHistory(state.historyPast, snapshotFrom(state)),
        historyFuture: [],
      };
    }),

  duplicateSelected: () =>
    set((state) => {
      const source = geometryFromSelection(state);
      if (!source) return state;

      const clone = cloneGeometry(source, [DUPLICATE_STEP, 0, DUPLICATE_STEP]);

      return {
        points: [...state.points, ...clone.points],
        edges: [...state.edges, ...clone.edges],
        selectedIds: clone.points.map((point) => point.id),
        historyPast: pushHistory(state.historyPast, snapshotFrom(state)),
        historyFuture: [],
      };
    }),

  deleteSelected: () =>
    set((state) => {
      if (state.selectedIds.length === 0) return state;
      const selected = new Set(state.selectedIds);

      return {
        points: state.points.filter((point) => !selected.has(point.id)),
        edges: state.edges.filter((edge) => !selected.has(edge.a) && !selected.has(edge.b)),
        selectedIds: [],
        historyPast: pushHistory(state.historyPast, snapshotFrom(state)),
        historyFuture: [],
      };
    }),

  loadDocument: (points, edges) =>
    set({
      points: clonePoints(points),
      edges: cloneEdges(edges),
      selectedIds: [],
      historyPast: [],
      historyFuture: [],
      gestureStart: null,
    }),

  reset: () =>
    set((state) => {
      const target: GeometrySnapshot = { points: cloneInitialPoints(), edges: cloneInitialEdges() };
      const current = snapshotFrom(state);
      if (snapshotsEqual(current, target)) return { selectedIds: [] };

      return {
        points: target.points,
        edges: target.edges,
        selectedIds: [],
        historyPast: pushHistory(state.historyPast, current),
        historyFuture: [],
        gestureStart: null,
      };
    }),

  toggleSnap: () => set((state) => ({ snapToGrid: !state.snapToGrid })),

  undo: () =>
    set((state) => {
      if (state.historyPast.length === 0) return state;
      const previous = state.historyPast[state.historyPast.length - 1];
      const current = snapshotFrom(state);

      return {
        points: clonePoints(previous.points),
        edges: cloneEdges(previous.edges),
        selectedIds: [],
        historyPast: state.historyPast.slice(0, -1),
        historyFuture: pushHistory(state.historyFuture, current),
        gestureStart: null,
      };
    }),

  redo: () =>
    set((state) => {
      if (state.historyFuture.length === 0) return state;
      const next = state.historyFuture[state.historyFuture.length - 1];
      const current = snapshotFrom(state);

      return {
        points: clonePoints(next.points),
        edges: cloneEdges(next.edges),
        selectedIds: [],
        historyPast: pushHistory(state.historyPast, current),
        historyFuture: state.historyFuture.slice(0, -1),
        gestureStart: null,
      };
    }),
}));
