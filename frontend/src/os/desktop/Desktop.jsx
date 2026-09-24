import React from 'react';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useWindowStore } from '../../store/useWindowStore';
import { APP_REGISTRY } from '../../apps/appRegistry';
import WidgetGrid from './WidgetGrid';
import DesktopIcons from './DesktopIcons';
import MarqueeSelection from './MarqueeSelection';
import WindowManager from '../window-manager/WindowManager';
import SnapPreviewOverlay from '../window-manager/SnapPreviewOverlay';
import AltTabSwitcher from '../window-manager/AltTabSwitcher';
import { Sliders, LayoutGrid, Lock, FileText, Monitor, Terminal } from 'lucide-react';
import styles from './Desktop.module.css';

export default function Desktop() {
  const {
    wallpaper,
    setWallpaper,
    desktopContextMenu,
    openContextMenu,
    closeContextMenu,
    setLocked,
    addNotification,
  } = useDesktopStore();

  const openApp = useWindowStore((state) => state.openApp);

  const handleContextMenu = (e) => {
    // Only trigger if clicking on desktop background or widget layer (not inside an app window)
    if (e.target.closest('[class*="Window_window"]')) {
      return;
    }
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY);
  };

  const handleDesktopClick = () => {
    if (desktopContextMenu.visible) {
      closeContextMenu();
    }
  };

  const cycleWallpaper = () => {
    const nextWp =
      wallpaper === 'dot-grid'
        ? 'glyph-lines'
        : wallpaper === 'glyph-lines'
        ? 'minimal-gradient'
        : 'dot-grid';
    setWallpaper(nextWp);
    addNotification({
      title: 'WALLPAPER APPLIED',
      message: `Switched desktop canvas to ${nextWp.toUpperCase()}.`,
    });
    closeContextMenu();
  };

  const wallpaperClass =
    wallpaper === 'glyph-lines'
      ? 'wallpaper-glyph-lines'
      : wallpaper === 'minimal-gradient'
      ? 'wallpaper-minimal-gradient'
      : 'wallpaper-dot-grid';

  return (
    <div
      className={`${styles.desktopCanvas} ${wallpaperClass}`}
      onContextMenu={handleContextMenu}
      onClick={handleDesktopClick}
    >
      {/* Desktop File Icons */}
      <DesktopIcons />

      {/* Marquee Rubberband Box Selection */}
      <MarqueeSelection />

      {/* Interactive Widget Layer */}
      <WidgetGrid />

      {/* Dynamic Window Manager */}
      <WindowManager />

      {/* Edge Snapping Preview Overlay */}
      <SnapPreviewOverlay />

      {/* Alt + Tab Task Switcher */}
      <AltTabSwitcher />

      {/* Custom Desktop Context Menu */}
      {desktopContextMenu.visible && (
        <div
          className={styles.contextMenu}
          style={{ top: `${desktopContextMenu.y}px`, left: `${desktopContextMenu.x}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.contextHeader}>GLYPH OS (1)</div>

          <button onClick={cycleWallpaper} className={styles.menuItem}>
            <Monitor size={14} />
            <span>CHANGE WALLPAPER</span>
          </button>

          <button
            onClick={() => {
              openApp(APP_REGISTRY.terminal);
              closeContextMenu();
            }}
            className={styles.menuItem}
          >
            <Terminal size={14} />
            <span>OPEN TERMINAL</span>
          </button>

          <button
            onClick={() => {
              openApp(APP_REGISTRY.notes);
              closeContextMenu();
            }}
            className={styles.menuItem}
          >
            <FileText size={14} />
            <span>NEW NOTE</span>
          </button>

          <button
            onClick={() => {
              openApp(APP_REGISTRY.settings);
              closeContextMenu();
            }}
            className={styles.menuItem}
          >
            <LayoutGrid size={14} />
            <span>WIDGET SETTINGS</span>
          </button>

          <div className={styles.divider} />

          <button
            onClick={() => {
              openApp(APP_REGISTRY.settings);
              closeContextMenu();
            }}
            className={styles.menuItem}
          >
            <Sliders size={14} />
            <span>SYSTEM SETTINGS</span>
          </button>

          <button
            onClick={() => {
              setLocked(true);
              closeContextMenu();
            }}
            className={styles.menuItem}
          >
            <Lock size={14} />
            <span>LOCK SCREEN</span>
          </button>
        </div>
      )}
    </div>
  );
}
