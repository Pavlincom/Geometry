import { create } from "zustand";

export type Vec3Tuple = [number, number, number];
export type GeometryPoint = { id: string; position: Vec3Tuple };
export type GeometryEdge = { id: string; a: string; b: string };

type EditorState = {
  points: GeometryPoint[];
  edges: GeometryEdge[];
  selectedIds: string[];
  addPoint: (position: Vec3Tuple) => void;
  togglePoint: (id: string) => void;
  connectSelected: () => void;
  updateSelectedAxis: (axis: 0 | 1 | 2, value: number) => void;
  deleteSelected: () => void;
  reset: () => void;
};

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

const cloneInitialPoints = () => initialPoints.map((point) => ({ ...point, position: [...point.position] as Vec3Tuple }));
const cloneInitialEdges = () => initialEdges.map((edge) => ({ ...edge }));

export const useEditorStore = create<EditorState>((set, get) => ({
  points: cloneInitialPoints(),
  edges: cloneInitialEdges(),
  selectedIds: [],

  addPoint: (position) =>
    set((state) => ({
      points: [...state.points, { id: crypto.randomUUID(), position }],
      selectedIds: [],
    })),

  togglePoint: (id) =>
    set((state) => {
      if (state.selectedIds.includes(id)) {
        return { selectedIds: state.selectedIds.filter((item) => item !== id) };
      }
      const next = [...state.selectedIds, id];
      return { selectedIds: next.slice(-2) };
    }),

  connectSelected: () => {
    const { selectedIds, edges } = get();
    if (selectedIds.length !== 2) return;
    const [a, b] = selectedIds;
    const exists = edges.some((edge) => (edge.a === a && edge.b === b) || (edge.a === b && edge.b === a));
    if (exists) return;
    set({ edges: [...edges, { id: `${a}:${b}`, a, b }], selectedIds: [] });
  },

  updateSelectedAxis: (axis, value) =>
    set((state) => {
      if (state.selectedIds.length !== 1) return state;
      const selected = state.selectedIds[0];
      return {
        points: state.points.map((point) => {
          if (point.id !== selected) return point;
          const position = [...point.position] as Vec3Tuple;
          position[axis] = value;
          return { ...point, position };
        }),
      };
    }),

  deleteSelected: () =>
    set((state) => {
      const selected = new Set(state.selectedIds);
      return {
        points: state.points.filter((point) => !selected.has(point.id)),
        edges: state.edges.filter((edge) => !selected.has(edge.a) && !selected.has(edge.b)),
        selectedIds: [],
      };
    }),

  reset: () => set({ points: cloneInitialPoints(), edges: cloneInitialEdges(), selectedIds: [] }),
}));
