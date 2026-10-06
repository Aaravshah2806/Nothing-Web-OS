import React, { useEffect, useState } from 'react';
import { useDesktopStore } from './store/useDesktopStore';
import Desktop from './os/desktop/Desktop';
import Dock from './os/dock/Dock';
import SpotlightSearch from './os/spotlight/SpotlightSearch';
import NotificationCenter from './os/notifications/NotificationCenter';
import LockScreen from './os/boot/LockScreen';
import BootScreen from './os/boot/BootScreen';
import StartMenu from './os/start/StartMenu';
import { MonitorX } from 'lucide-react';

export default function App() {
  const { theme, accentColor, isBooting, setBooting } = useDesktopStore();
  const [booting, setBootingState] = useState(true); // Always play authentic NothingOS boot intro on launch!

  // Listen to store reboot requests
  useEffect(() => {
    if (isBooting) {
      setBootingState(true);
    }
  }, [isBooting]);

  const handleBootComplete = () => {
    setBootingState(false);
    setBooting(false);
  };

  // Sync theme attribute and dynamic accent color on root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accentColor);
    // Dim accent
    document.documentElement.style.setProperty('--accent-glow', `${accentColor}44`);
  }, [accentColor]);

  return (
    <>
      {/* Mobile/Small Viewport Warning (< 1280px screen warning per PRD §8) */}
      <div className="viewport-warning">
        <MonitorX size={48} style={{ color: 'var(--accent)', marginBottom: '16px' }} />
        <h1 className="viewport-warning-title">DESKTOP DISPLAY REQUIRED</h1>
        <p className="viewport-warning-text">
          GLYPH OS (1) is engineered exclusively for laptop and desktop screens (1280px+ viewports). Please enlarge your browser window or switch to a desktop workstation for the intended experience.
        </p>
      </div>

      {/* NothingOS Dot-Matrix Boot Entry Animation */}
      {booting && <BootScreen onBootComplete={handleBootComplete} />}

      {/* Lock Screen */}
      <LockScreen />

      {/* Desktop Environment */}
      <Desktop />

      {/* OS Dock & System Tray */}
      <Dock />

      {/* Nothing OS / NThing-UI Start Menu Drawer */}
      <StartMenu />

      {/* Spotlight Search Overlay */}
      <SpotlightSearch />

      {/* Notification Center Drawer */}
      <NotificationCenter />
    </>
  );
}
