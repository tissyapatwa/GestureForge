import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  RotateCcw, 
  RotateCw, 
  Trash2, 
  Save, 
  Box, 
  Camera, 
  Sliders, 
  Eraser, 
  Layers, 
  Activity, 
  Zap, 
  Play, 
  Square, 
  Circle, 
  Triangle, 
  Compass,
  Cpu
} from "lucide-react";
import { Hands } from "@mediapipe/hands";
import { Camera as MediaPipeCamera } from "@mediapipe/camera_utils";
import { WORKSPACE } from "../constants/testIds";
import { spawnableObjects, neonPalettes } from "../mock";
import { useSound } from "../context/SoundContext";

export default function Workspace({ onSaveArtwork }) {
  const { playClick, playSpawn, playGrab, playThrow } = useSound();

  // State
  const [selectedColor, setSelectedColor] = useState("#00f0ff");
  const [brushSize, setBrushSize] = useState(8);
  const [glowIntensity, setGlowIntensity] = useState(25);
  const [isEraser, setIsEraser] = useState(false);
  const [activeGesture, setActiveGesture] = useState("Air Drawing (Index Up)");
  const [fps, setFps] = useState(60);
  const [handCount, setHandCount] = useState(0);
  const [selectedObject, setSelectedObject] = useState("cube");
  const [spawnedObjectsList, setSpawnedObjectsList] = useState([
    { id: 1, type: "cube", x: 0, y: 1, z: -3, color: "#00f0ff", scale: 1, rotation: 0 }
  ]);
  const [isWebcamActive, setIsWebcamActive] = useState(true);

  // Refs for Tracking & Drawing
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef(null);
  const historyRef = useRef([]);

  // Sync state values with refs for tracking loop
  const colorRef = useRef(selectedColor);
  const sizeRef = useRef(brushSize);
  const glowRef = useRef(glowIntensity);
  const eraserRef = useRef(isEraser);

  useEffect(() => { colorRef.current = selectedColor; }, [selectedColor]);
  useEffect(() => { sizeRef.current = brushSize; }, [brushSize]);
  useEffect(() => { glowRef.current = glowIntensity; }, [glowIntensity]);
  useEffect(() => { eraserRef.current = isEraser; }, [isEraser]);

  // Setup Canvas and MediaPipe Tracking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    if (!videoRef.current) return;

    let isMounted = true;
    let cameraInstance = null;
    let handsInstance = null;

    try {
      handsInstance = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      handsInstance.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });

      handsInstance.onResults((results) => {
        if (!isMounted || !canvas) return;
        const ctx = canvas.getContext("2d");

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          setHandCount(results.multiHandLandmarks.length);

          const landmarks = results.multiHandLandmarks[0];
          const indexTip = landmarks[8];
          const indexPip = landmarks[6];
          const thumbTip = landmarks[4];

          // Mirrored X coordinates
          const x = (1 - indexTip.x) * canvas.width;
          const y = indexTip.y * canvas.height;

          const pinchDist = Math.hypot(
            (1 - indexTip.x) - (1 - thumbTip.x),
            indexTip.y - thumbTip.y
          );

          const isIndexUp = indexTip.y < indexPip.y;

          if (pinchDist < 0.05) {
            setActiveGesture("Pinch Gesture (Eraser Active)");
            ctx.save();
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(x, y, sizeRef.current * 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            lastPosRef.current = null;
          } else if (isIndexUp) {
            setActiveGesture(eraserRef.current ? "Air Erasing..." : "Air Drawing (Index Up)");

            if (lastPosRef.current) {
              ctx.save();
              ctx.strokeStyle = eraserRef.current ? "#a855f7" : colorRef.current;
              ctx.lineWidth = eraserRef.current ? sizeRef.current * 3 : sizeRef.current;
              ctx.lineCap = "round";
              ctx.lineJoin = "round";
              ctx.shadowColor = eraserRef.current ? "#a855f7" : colorRef.current;
              ctx.shadowBlur = eraserRef.current ? 0 : glowRef.current;

              if (eraserRef.current) {
                ctx.globalCompositeOperation = "destination-out";
              } else {
                ctx.globalCompositeOperation = "source-over";
              }

              ctx.beginPath();
              ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
              ctx.lineTo(x, y);
              ctx.stroke();
              ctx.restore();
            }

            lastPosRef.current = { x, y };
          } else {
            setActiveGesture("Tracking Hand (Point Index Finger to Draw)");
            lastPosRef.current = null;
          }
        } else {
          setHandCount(0);
          setActiveGesture("No Hand Detected");
          lastPosRef.current = null;
        }
      });

      cameraInstance = new MediaPipeCamera(videoRef.current, {
        onFrame: async () => {
          if (isMounted && videoRef.current && isWebcamActive && handsInstance) {
            try {
              await handsInstance.send({ image: videoRef.current });
            } catch (err) {}
          }
        },
        width: 1280,
        height: 720,
      });

      cameraInstance.start();
    } catch (e) {
      console.error("MediaPipe tracking error:", e);
    }

    return () => {
      isMounted = false;
      window.removeEventListener("resize", updateCanvasSize);
      if (cameraInstance) {
        try { cameraInstance.stop(); } catch (e) {}
      }
      if (handsInstance) {
        try { handsInstance.close(); } catch (e) {}
      }
    };
  }, [isWebcamActive]);

  const startDrawing = (e) => {
    isDrawingRef.current = true;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastPosRef.current = { x, y };
  };

  const draw = (e) => {
    if (!isDrawingRef.current || !lastPosRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.save();
    ctx.strokeStyle = isEraser ? "#000000" : selectedColor;
    ctx.lineWidth = isEraser ? brushSize * 3 : brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = selectedColor;
    ctx.shadowBlur = isEraser ? 0 : glowIntensity;

    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
    }

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.restore();

    lastPosRef.current = { x, y };
  };

  const stopDrawing = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastPosRef.current = null;
      const canvas = canvasRef.current;
      if (canvas) {
        historyRef.current.push(canvas.toDataURL());
      }
    }
  };

  const handleClear = () => {
    playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    historyRef.current = [];
  };

  const handleSpawnObject = (type) => {
    playSpawn();
    const newObj = {
      id: Date.now(),
      type,
      x: (Math.random() - 0.5) * 4,
      y: Math.random() * 2,
      z: -3 - Math.random() * 2,
      color: selectedColor,
      scale: 1,
      rotation: 0
    };
    setSpawnedObjectsList((prev) => [...prev, newObj]);
  };

  const handleThrowObjects = () => {
    playThrow();
    setSpawnedObjectsList((prev) =>
      prev.map((obj) => ({
        ...obj,
        x: obj.x + (Math.random() - 0.5) * 6,
        y: obj.y + 3,
        z: obj.z - 2,
        rotation: obj.rotation + 45
      }))
    );
  };

  return (
    <div 
      id="workspace" 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#020617",
        overflow: "hidden",
        fontFamily: "monospace",
        zIndex: 50
      }}
    >
      
      {/* Background Webcam Feed Layer (Forced Full Screen) */}
      <div 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1
        }}
      >
        {isWebcamActive ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scaleX(-1)",
              opacity: 0.7
            }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#00f0ff" }}>
            [Webcam Feed Paused]
          </div>
        )}
      </div>

      {/* Drawing Canvas Layer (Forced Full Screen Overlay) */}
      <canvas
        ref={canvasRef}
        data-testid={WORKSPACE.threeCanvas}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 10,
          cursor: "crosshair",
          touchAction: "none"
        }}
      />

      {/* Top Telemetry HUD Bar */}
      <div 
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          right: "20px",
          zIndex: 30,
          display: "flex",
          justify: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(0, 240, 255, 0.3)",
          borderRadius: "12px",
          color: "#00f0ff",
          fontSize: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span>GESTURE: <strong>{activeGesture}</strong></span>
          <span>HANDS: <strong>{handCount} Active</strong></span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span>{fps} FPS</span>
          <button
            onClick={() => { playClick(); setIsWebcamActive(!isWebcamActive); }}
            style={{
              padding: "5px 12px",
              backgroundColor: "rgba(0, 240, 255, 0.2)",
              border: "1px solid #00f0ff",
              color: "#fff",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {isWebcamActive ? "Cam ON" : "Cam OFF"}
          </button>
        </div>
      </div>

      {/* Floating Bottom Control Deck */}
      <div 
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 30,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justify: "center",
          gap: "15px",
          padding: "12px 24px",
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 240, 255, 0.4)",
          borderRadius: "20px",
          boxShadow: "0 0 30px rgba(0, 240, 255, 0.2)"
        }}
      >
        {/* Colors */}
        <div style={{ display: "flex", gap: "8px" }}>
          {neonPalettes.map((palette) => (
            <button
              key={palette.id}
              onClick={() => {
                playClick();
                setSelectedColor(palette.hex);
                setIsEraser(false);
              }}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                backgroundColor: palette.hex,
                border: selectedColor === palette.hex && !isEraser ? "2px solid #fff" : "none",
                cursor: "pointer",
                boxShadow: `0 0 10px ${palette.hex}`
              }}
            />
          ))}

          <button
            onClick={() => { playClick(); setIsEraser(!isEraser); }}
            style={{
              padding: "6px 10px",
              borderRadius: "8px",
              backgroundColor: isEraser ? "#a855f7" : "#0f172a",
              color: "#fff",
              border: "1px solid #a855f7",
              cursor: "pointer"
            }}
          >
            Eraser
          </button>
        </div>

        {/* Sliders */}
        <div style={{ display: "flex", gap: "15px", color: "#00f0ff", fontSize: "11px" }}>
          <div>
            <div>Brush: {brushSize}px</div>
            <input
              type="range"
              min="2"
              max="30"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
            />
          </div>
          <div>
            <div>Glow: {glowIntensity}px</div>
            <input
              type="range"
              min="0"
              max="50"
              value={glowIntensity}
              onChange={(e) => setGlowIntensity(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          <select
            value={selectedObject}
            onChange={(e) => {
              playClick();
              setSelectedObject(e.target.value);
              handleSpawnObject(e.target.value);
            }}
            style={{
              padding: "6px 10px",
              borderRadius: "8px",
              backgroundColor: "#020617",
              color: "#00f0ff",
              border: "1px solid #00f0ff",
              cursor: "pointer"
            }}
          >
            <option value="cube">Spawn Cube</option>
            <option value="sphere">Spawn Sphere</option>
            <option value="pyramid">Spawn Pyramid</option>
            <option value="torus">Spawn Torus</option>
          </select>

          <button
            onClick={handleClear}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              color: "#ef4444",
              border: "1px solid #ef4444",
              cursor: "pointer"
            }}
          >
            Clear
          </button>

          <button
            onClick={() => {
              playClick();
              onSaveArtwork({
                id: `art-${Date.now()}`,
                title: `Stark Hologram #${Math.floor(Math.random() * 900 + 100)}`,
                date: new Date().toISOString().replace("T", " ").substring(0, 16),
                strokesCount: 50,
                objectsCount: spawnedObjectsList.length
              });
              alert("Holographic Air Drawing Saved!");
            }}
            style={{
              padding: "6px 16px",
              borderRadius: "8px",
              backgroundColor: "#00f0ff",
              color: "#020617",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Save
          </button>
        </div>

      </div>

    </div>
  );
}