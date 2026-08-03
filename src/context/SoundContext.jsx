import { createContext, useContext, useState, useEffect, useRef } from "react";

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef(null);

  const initAudio = () => {
    if (!audioCtxRef.current && typeof window !== "undefined") {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtxRef.current = new AudioContext();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const playTone = (freq, type = "sine", duration = 0.1, gainVal = 0.05) => {
    if (!soundEnabled) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.error(e);
    }
  };

  const playClick = () => playTone(800, "sine", 0.05, 0.03);
  const playSpawn = () => {
    playTone(400, "triangle", 0.15, 0.06);
    setTimeout(() => playTone(800, "sine", 0.15, 0.05), 100);
  };
  const playHover = () => playTone(1200, "sine", 0.03, 0.01);
  const playGrab = () => playTone(300, "sawtooth", 0.12, 0.04);
  const playThrow = () => {
    playTone(600, "sine", 0.2, 0.05);
    setTimeout(() => playTone(200, "sine", 0.2, 0.06), 100);
  };
  const playHologramHum = () => {
    playTone(150, "sine", 0.5, 0.02);
  };

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        setSoundEnabled,
        playClick,
        playSpawn,
        playHover,
        playGrab,
        playThrow,
        playHologramHum,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
