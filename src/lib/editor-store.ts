import { create } from "zustand";

export type Vec3Tuple = [number, number, number];
export type GeometryPoint = { id: string; position: Vec3Tuple };
export type GeometryEdge = { id: string; a: string; b: string };

type GeometrySnapshot = {
  points: GeometryPoint[];
  edges: GeometryEdge[];
};

type EditorState = {
  points: GeometryPoint[];
  edges: GeometryEdge[];
  selectedIds: string[];
  snapToGrid: boolean;
  historyPast: GeometrySnapshot[];
  historyFuture: GeometrySnapshot[];
  gestureStart: GeometrySnapshot | null;
  addPoint: (position: Vec3Tuple) => void;
  togglePoint: (id: string) => void;
  connectSelected: () => void;
  updateSelectedAxis: (axis: 0 | 1 | 2, value: number) => void;
  movePoint: (id: string, position: Vec3Tuple) => void;
  beginGesture: () => void;
  endGesture: () => void;
  deleteSelected: () => void;
  loadDocument: (points: GeometryPoint[], edges: GeometryEdge[]) => void;
  reset: () => void;
  toggleSnap: () => void;
  undo: () => void;
  redo: () => void;
};

const HISTORY_LIMIT = 100;

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

export const useEditorStore = create<EditorState>((set) => ({
  points: cloneInitialPoints(),
  edges: cloneInitialEdges(),
  selectedIds: [],
  snapToGrid: true,
  historyPast: [],
  historyFuture: [],
  gestureStart: null,

  addPoint: (position) =>
    set((state) => ({
      points: [...state.points, { id: crypto.randomUUID(), position: [...position] as Vec3Tuple }],
      selectedIds: [],
      historyPast: pushHistory(state.historyPast, snapshotFrom(state)),
      historyFuture: [],
    })),

  togglePoint: (id) =>
    set((state) => {
      if (state.selectedIds.includes(id)) {
        return { selectedIds: state.selectedIds.filter((item) => item !== id) };
      }
      const next = [...state.selectedIds, id];
      return { selectedIds: next.slice(-2) };
    }),

  connectSelected: () =>
    set((state) => {
      if (state.selectedIds.length !== 2) return state;
      const [a, b] = state.selectedIds;
      const exists = state.edges.some((edge) => (edge.a === a && edge.b === b) || (edge.a === b && edge.b === a));
      if (exists) return state;

      return {
        edges: [...state.edges, { id: `${a}:${b}`, a, b }],
        selectedIds: [],
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
