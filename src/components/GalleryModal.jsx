import React from "react";
import { X, Image as ImageIcon, Trash2, Download, Sparkles, Clock, Box } from "lucide-react";
import { initialSavedArtworks } from "../mock";
import { useSound } from "../context/SoundContext";

export default function GalleryModal({ isOpen, onClose, savedArtworks, onDeleteArtwork }) {
  const { playClick } = useSound();

  if (!isOpen) return null;

  const artworks = savedArtworks || initialSavedArtworks;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        data-testid="gallery-modal"
        className="relative w-full max-w-3xl bg-slate-900/90 border border-purple-500/40 rounded-2xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.25)] text-slate-100 font-mono"
      >
        <button
          data-testid="close-gallery-btn"
          onClick={() => { playClick(); onClose(); }}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800/80 text-purple-400 hover:bg-purple-950 border border-purple-500/30 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <ImageIcon className="w-6 h-6 text-purple-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              STARK HOLOGRAPHIC ARCHIVE
            </h2>
            <p className="text-xs text-purple-400/70 tracking-widest uppercase">
              Stored 3D Air Drawings & Quantum Sculptures
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2">
          {artworks.map((art) => (
            <div 
              key={art.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-purple-500/20 hover:border-purple-400/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-full h-32 rounded-lg bg-gradient-to-tr from-slate-900 via-purple-950/40 to-cyan-950/40 border border-purple-500/30 mb-3 flex items-center justify-center relative overflow-hidden group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-shadow">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0,transparent_70%)]"></div>
                  <Sparkles className="w-8 h-8 text-purple-400/60 animate-pulse" />
                  <div className="absolute bottom-2 left-2 text-[10px] text-cyan-300 font-mono bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    {art.strokesCount} strokes
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-200 mb-1">{art.title}</h3>
                <div className="flex items-center space-x-2 text-[11px] text-slate-400 mb-4">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>{art.date}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-purple-500/20">
                <button
                  data-testid={`load-art-${art.id}`}
                  onClick={() => { playClick(); alert(`Loading ${art.title} into holographic viewport...`); onClose(); }}
                  className="flex-1 py-1.5 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-300 hover:bg-purple-900 text-xs font-bold transition-all flex items-center justify-center space-x-1"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Load</span>
                </button>
                <button
                  data-testid={`delete-art-${art.id}`}
                  onClick={() => { playClick(); onDeleteArtwork(art.id); }}
                  className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/60 transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {artworks.length === 0 && (
            <div className="col-span-3 py-12 text-center text-slate-500 font-mono text-sm">
              No saved holographic artworks found in archive. Create and save one from the workspace!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
