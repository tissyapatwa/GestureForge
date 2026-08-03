import React from "react";
import { Link } from "react-router-dom";
import { useSound } from "../context/SoundContext";
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Image as ImageIcon, 
  Settings, 
  Play, 
  Cpu, 
  Radio, 
  Layers
} from "lucide-react";
import { NAVBAR } from "../constants/testIds";

export default function Navbar({ onOpenCheatSheet, onOpenGallery, onOpenSettings }) {
  const { soundEnabled, setSoundEnabled, playClick } = useSound();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/20 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
      <div className="flex items-center space-x-3">
        <Link 
          to="/" 
          data-testid={NAVBAR.logo}
          onClick={playClick}
          className="flex items-center space-x-2 group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.5)] group-hover:scale-105 transition-transform">
            <Cpu className="w-5 h-5 text-slate-950 animate-pulse" />
            <div className="absolute inset-0 rounded-xl border border-cyan-300 animate-ping opacity-25"></div>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-purple-400 font-mono">
              GESTURE<span className="text-cyan-400">FORGE</span>
            </h1>
            <div className="flex items-center space-x-1.5 text-[10px] text-cyan-400/70 font-mono tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Stark Holo-OS v4.2</span>
            </div>
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-3">
        <button
          data-testid={NAVBAR.docsBtn}
          onClick={() => { playClick(); onOpenCheatSheet(); }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-400 text-xs font-mono transition-all shadow-[0_0_10px_rgba(0,240,255,0.15)]"
          title="Gesture Guide"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Gestures</span>
        </button>

        <button
          data-testid={NAVBAR.galleryBtn}
          onClick={() => { playClick(); onOpenGallery(); }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:bg-purple-900/50 hover:border-purple-400 text-xs font-mono transition-all shadow-[0_0_10px_rgba(168,85,247,0.15)]"
          title="Artwork Gallery"
        >
          <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Gallery</span>
        </button>

        <button
          data-testid={NAVBAR.soundToggle}
          onClick={() => {
            playClick();
            setSoundEnabled(!soundEnabled);
          }}
          className={`p-2 rounded-lg border text-xs font-mono transition-all ${
            soundEnabled 
              ? "bg-cyan-950/60 border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]" 
              : "bg-slate-900/60 border-slate-700 text-slate-500"
          }`}
          title={soundEnabled ? "Sound FX Enabled" : "Sound FX Muted"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        <button
          data-testid={NAVBAR.settingsBtn}
          onClick={() => { playClick(); onOpenSettings(); }}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 text-xs font-mono transition-all"
          title="Settings & Calibration"
        >
          <Settings className="w-4 h-4" />
        </button>

        <Link
          data-testid={NAVBAR.startBtn}
          to="#workspace"
          onClick={playClick}
          className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold hover:brightness-110 shadow-[0_0_20px_rgba(0,240,255,0.4)] text-xs font-mono transition-all transform hover:scale-105"
        >
          <Play className="w-3.5 h-3.5 fill-slate-950" />
          <span>Launch Holo</span>
        </Link>
      </div>
    </header>
  );
}
