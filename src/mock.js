// Mock data and presets for GestureForge Stark Hologram Lab
// Future backend endpoint replacement: /api/gestureforge/presets and /api/gestureforge/saved-artworks

export const initialSavedArtworks = [
  {
    id: "art-1",
    title: "Arc Reactor Core",
    date: "2026-07-24 14:32",
    thumbnail: "cyber-cyan",
    strokesCount: 142,
    objectsCount: 4,
  },
  {
    id: "art-2",
    title: "Mark VII Schematic",
    date: "2026-07-24 12:15",
    thumbnail: "neon-purple",
    strokesCount: 89,
    objectsCount: 2,
  },
  {
    id: "art-3",
    title: "Quantum Neural Node",
    date: "2026-07-23 21:45",
    thumbnail: "matrix-green",
    strokesCount: 230,
    objectsCount: 6,
  },
];

export const spawnableObjects = [
  {
    id: "cube",
    name: "Stark Quantum Cube",
    category: "Geometrics",
    color: "#00f0ff",
    description: "Multidimensional wireframe data container",
  },
  {
    id: "sphere",
    name: "Arc Reactor Sphere",
    category: "Energy Cores",
    color: "#a855f7",
    description: "Pulsating plasma energy sphere with gravitational pull",
  },
  {
    id: "pyramid",
    name: "Vibranium Tetrahedron",
    category: "Geometrics",
    color: "#22c55e",
    description: "Stabilized molecular structural lattice",
  },
  {
    id: "torus",
    name: "Tachyon Ring",
    category: "Holograms",
    color: "#ec4899",
    description: "Warp field generator ring with rotation matrix",
  },
  {
    id: "particle_emitter",
    name: "Nanobot Swarm",
    category: "Particles",
    color: "#38bdf8",
    description: "Autonomous self-assembling repair swarm",
  },
];

export const neonPalettes = [
  { id: "cyan", name: "Arc Cyan", hex: "#00f0ff" },
  { id: "purple", name: "Laser Purple", hex: "#a855f7" },
  { id: "green", name: "Matrix Green", hex: "#22c55e" },
  { id: "pink", name: "Plasma Pink", hex: "#ec4899" },
  { id: "amber", name: "Stark Gold", hex: "#fbbf24" },
  { id: "white", name: "Pure Xenon", hex: "#ffffff" },
];

export const gestureCheatSheet = [
  {
    gesture: "Single Index Up",
    action: "Air Draw Mode",
    desc: "Raise only your index finger to paint glowing neon lines in 3D space.",
  },
  {
    gesture: "Closed Fist",
    action: "Pause & Lock",
    desc: "Hold a closed fist to freeze drawing and stabilise cursor position.",
  },
  {
    gesture: "Pinch (Thumb + Index)",
    action: "Grab & Move / Eraser",
    desc: "Pinch near 3D objects to grab and move them, or erase air strokes.",
  },
  {
    gesture: "Open Palm (Two Hands)",
    action: "Scale & Rotate",
    desc: "Use both hands in frame to dynamically scale and rotate selected 3D models.",
  },
  {
    gesture: "Fast Swipe / Throw",
    action: "Physics Throw",
    desc: "Flick your hand rapidly to toss 3D objects with gravity and momentum.",
  },
];
