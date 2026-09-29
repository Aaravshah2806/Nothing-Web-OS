import React from 'react';
import { Search } from 'lucide-react';
import { useWindowStore } from '../../store/useWindowStore';
import { useDesktopStore } from '../../store/useDesktopStore';
import { getAppList } from '../../apps/appRegistry';
import SystemTray from './SystemTray';
import styles from './Dock.module.css';

export default function Dock() {
  const { windows, openApp, minimizeWindow, focusWindow, focusedWindowId } = useWindowStore();
  const toggleSpotlight = useDesktopStore((state) => state.toggleSpotlight);
  const toggleStartMenu = useDesktopStore((state) => state.toggleStartMenu);
  const startMenuOpen = useDesktopStore((state) => state.startMenuOpen);
  const apps = getAppList();

  const handleAppClick = (app) => {
    const existing = windows.find((w) => w.appId === app.id);
    if (!existing) {
      openApp(app);
    } else {
      if (existing.minimized) {
        focusWindow(existing.id);
      } else if (focusedWindowId === existing.id) {
        minimizeWindow(existing.id);
      } else {
        focusWindow(existing.id);
      }
    }
  };

  return (
    <footer className={styles.dockContainer}>
      <nav className={styles.dockPill} aria-label="Glyph OS App Dock">
        {/* NThing Start Menu Trigger */}
        <button
          onClick={toggleStartMenu}
          className={`${styles.dockItem} ${styles.startItem} ${startMenuOpen ? styles.startItemActive : ''}`}
          title="Start Menu (NThing UI)"
          aria-label="Start Menu"
        >
          <div className={styles.iconBox}>
            <div className={styles.nothingGlyphLogo}>
              <span className={styles.glyphDotCenter} />
              <span className={styles.glyphRing} />
            </div>
          </div>
        </button>

        {/* Spotlight Trigger */}
        <button
          onClick={toggleSpotlight}
          className={`${styles.dockItem} ${styles.searchItem}`}
          title="Spotlight Search (Ctrl+K)"
          aria-label="Spotlight Search (Ctrl+K)"
        >
          <div className={styles.iconBox}>
            <Search size={18} />
          </div>
          <span className={styles.shortcutHint}>⌘K</span>
        </button>

        <div className={styles.divider} />

        {/* Pinned / Running Apps */}
        <div className={styles.appsList}>
          {apps.map((app) => {
            const AppIcon = app.icon;
            const openInstance = windows.find((w) => w.appId === app.id);
            const isOpen = Boolean(openInstance);
            const isFocused = isOpen && focusedWindowId === openInstance?.id && !openInstance.minimized;

            return (
              <button
                key={app.id}
                onClick={() => handleAppClick(app)}
                className={`${styles.dockItem} ${isFocused ? styles.focusedItem : ''}`}
                title={app.name}
                aria-label={`Open ${app.name}`}
              >
                <div className={styles.iconBox}>
                  {app.imageIcon ? (
                    <img
                      src={app.imageIcon}
                      alt={app.name}
                      className={styles.dockIconImg}
                      draggable={false}
                    />
                  ) : (
                    <AppIcon size={20} strokeWidth={1.8} />
                  )}
                </div>
                {/* Active Indicator Dot */}
                <div className={`${styles.activeDot} ${isOpen ? styles.activeDotVisible : ''}`} />
              </button>
            );
          })}
        </div>

        <div className={styles.divider} />

        {/* System Tray */}
        <SystemTray />
      </nav>
    </footer>
  );
}
