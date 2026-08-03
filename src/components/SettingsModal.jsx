import React from "react";
import { X, Sliders, Volume2, Shield, Cpu, Check } from "lucide-react";
import { useSound } from "../context/SoundContext";

export default function SettingsModal({ isOpen, onClose }) {
  const { soundEnabled, setSoundEnabled, playClick } = useSound();
  const [cameraQuality, setCameraQuality] = React.useState("720p");
  const [fpsCap, setFpsCap] = React.useState("60");
  const [handSensitivity, setHandSensitivity] = React.useState("85");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        data-testid="settings-modal"
        className="relative w-full max-w-lg bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,240,255,0.25)] text-slate-100 font-mono"
      >
        <button
          data-testid="close-settings-btn"
          onClick={() => { playClick(); onClose(); }}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800/80 text-cyan-400 hover:bg-cyan-950 border border-cyan-500/30 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Sliders className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              STARK LAB SETTINGS
            </h2>
            <p className="text-xs text-cyan-400/70 tracking-widest uppercase">
              Hardware calibration & sensor configuration
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Volume2 className="w-5 h-5 text-cyan-400" />
              <div>
                <h4 className="text-sm font-bold text-slate-200">JARVIS Audio FX</h4>
                <p className="text-xs text-slate-400">Synthesized clicks and hologram hums</p>
              </div>
            </div>
            <button
              data-testid="settings-sound-toggle"
              onClick={() => { playClick(); setSoundEnabled(!soundEnabled); }}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${soundEnabled ? "bg-cyan-500" : "bg-slate-800"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${soundEnabled ? "translate-x-6" : "translate-x-0"}`}></div>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-cyan-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Webcam Resolution</span>
              <div className="flex space-x-2">
                {["480p", "720p", "1080p"].map((res) => (
                  <button
                    key={res}
                    data-testid={`cam-res-${res}`}
                    onClick={() => { playClick(); setCameraQuality(res); }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                      cameraQuality === res 
                        ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.4)]" 
                        : "bg-slate-900 text-slate-400 border-slate-700 hover:border-cyan-500/50"
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-cyan-500/10">
              <span className="text-xs font-bold text-slate-200">FPS Optimization</span>
              <div className="flex space-x-2">
                {["30", "60", "120"].map((fps) => (
                  <button
                    key={fps}
                    data-testid={`fps-cap-${fps}`}
                    onClick={() => { playClick(); setFpsCap(fps); }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                      fpsCap === fps 
                        ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.4)]" 
                        : "bg-slate-900 text-slate-400 border-slate-700 hover:border-cyan-500/50"
                    }`}
                  >
                    {fps} FPS
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-cyan-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Hand Tracking Sensitivity</span>
              <span className="text-xs text-cyan-400 font-bold">{handSensitivity}%</span>
            </div>
            <input
              data-testid="hand-sensitivity-slider"
              type="range"
              min="50"
              max="100"
              value={handSensitivity}
              onChange={(e) => setHandSensitivity(e.target.value)}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-cyan-500/20 flex justify-end">
          <button
            data-testid="settings-save-btn"
            onClick={() => { playClick(); onClose(); }}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Apply & Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}
