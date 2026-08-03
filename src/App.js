import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { SoundProvider } from "./context/SoundContext";
import Navbar from "./components/Navbar";
import Workspace from "./components/Workspace";
import GestureCheatSheetModal from "./components/GestureCheatSheetModal";
import GalleryModal from "./components/GalleryModal";
import SettingsModal from "./components/SettingsModal";

function App() {
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <Router>
      <SoundProvider>
        <div className="w-screen h-screen bg-slate-950 text-white overflow-hidden relative flex flex-col">
          {/* Top Navigation Bar */}
          <Navbar 
            onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
            onOpenGallery={() => setIsGalleryOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Main 3D Canvas & Gesture Tracking Workspace */}
          <main className="flex-1 w-full h-full relative overflow-hidden">
            <Workspace />
          </main>

          {/* Modals */}
          {isCheatSheetOpen && (
            <GestureCheatSheetModal onClose={() => setIsCheatSheetOpen(false)} />
          )}
          {isGalleryOpen && (
            <GalleryModal onClose={() => setIsGalleryOpen(false)} />
          )}
          {isSettingsOpen && (
            <SettingsModal onClose={() => setIsSettingsOpen(false)} />
          )}
        </div>
      </SoundProvider>
    </Router>
  );
}

export default App;