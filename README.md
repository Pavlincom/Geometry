# Geometry Studio

Independent web project for exploring geometry and creating interactive spatial artwork.

## MVP currently included

- Editorial landing page with themes: sacred geometry, science, dimensions
- `/create` 3D editor
- Double-click grid to add points
- Select points in the scene
- Select two points and connect them
- Edit X/Y/Z coordinates of one selected point
- Delete selection and reset scene
- Orbit and zoom camera

## Stack

- Next.js 16.3.3 / React 19.2
- TypeScript
- Three.js
- React Three Fiber + Drei
- Zustand

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Next milestones

1. Proper editor command/history system (undo/redo)
2. Dragging and snapping points in 3D
3. Save/load project schema
4. Auth + cloud persistence
5. Gallery and public artwork pages
6. True 4D coordinates and 4D -> 3D projection pipeline
7. Animation/export system
