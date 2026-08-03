import React from "react";
import { X, Sparkles, CheckCircle2, Zap } from "lucide-react";
import { gestureCheatSheet } from "../mock";
import { useSound } from "../context/SoundContext";

export default function GestureCheatSheetModal({ isOpen, onClose }) {
  const { playClick } = useSound();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        data-testid="gesture-cheat-sheet-modal"
        className="relative w-full max-w-2xl bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,240,255,0.25)] text-slate-100 font-mono"
      >
        <button
          data-testid="close-cheat-sheet-btn"
          onClick={() => { playClick(); onClose(); }}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800/80 text-cyan-400 hover:bg-cyan-950 border border-cyan-500/30 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              STARK HOLOGRAPHIC GESTURE INDEX
            </h2>
            <p className="text-xs text-cyan-400/70 tracking-widest uppercase">
              Master air drawing & 3D object manipulation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
          {gestureCheatSheet.map((item, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-cyan-500/20 hover:border-cyan-400/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                    {item.gesture}
                  </span>
                  <Zap className="w-4 h-4 text-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-sm font-bold text-slate-200 mb-1">{item.action}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-cyan-400/80">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Ensure good webcam lighting for optimal tracking accuracy.</span>
          </div>
          <button
            data-testid="cheat-sheet-got-it-btn"
            onClick={() => { playClick(); onClose(); }}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
