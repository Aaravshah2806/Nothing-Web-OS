import React, { useState, useRef } from 'react';
import {
  Folder,
  FileText,
  Terminal,
  Image as ImageIcon,
  Trash2,
  FileCode,
  Zap,
  Timer,
  Mic,
  Code,
  Music,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useWindowStore } from '../../store/useWindowStore';
import { useDesktopStore } from '../../store/useDesktopStore';
import { APP_REGISTRY } from '../../apps/appRegistry';
import styles from './DesktopIcons.module.css';

const ICON_MAP = {
  Folder,
  FileText,
  Terminal,
  Image: ImageIcon,
  Trash2,
  FileCode,
  Zap,
  Timer,
  Mic,
  Code,
  Music,
  Sliders,
  Sparkles,
};

function DraggableDesktopIcon({ item, isSelected, onSelect, onLaunch }) {
  const updateDesktopIconPosition = useDesktopStore((state) => state.updateDesktopIconPosition);
  const IconComponent = ICON_MAP[item.iconKey] || Folder;

  const isDragging = useRef(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, initX: item.x, initY: item.y });
  const hasMoved = useRef(false);

  const handlePointerDown = (e) => {
    e.stopPropagation();
    onSelect(item.id);

    isDragging.current = true;
    hasMoved.current = false;
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initX: item.x,
      initY: item.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.mouseX;
    const dy = e.clientY - dragStart.current.mouseY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasMoved.current = true;
    }

    // Snap to 8px grid
    const rawX = dragStart.current.initX + dx;
    const rawY = dragStart.current.initY + dy;
    const snappedX = Math.round(rawX / 8) * 8;
    const snappedY = Math.round(rawY / 8) * 8;

    const clampedX = Math.max(16, Math.min(window.innerWidth - 100, snappedX));
    const clampedY = Math.max(16, Math.min(window.innerHeight - 140, snappedY));

    updateDesktopIconPosition(item.id, clampedX, clampedY);
  };

  const handlePointerUp = (e) => {
    if (isDragging.current) {
      isDragging.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onLaunch(item);
      }}
      className={`${styles.iconItem} ${isSelected ? styles.selected : ''}`}
      style={{
        transform: `translate3d(${item.x}px, ${item.y}px, 0)`,
        position: 'absolute',
        top: 0,
        left: 0,
      }}
      title={`Double-click to open ${item.name}`}
    >
      <div className={styles.iconBox}>
        {item.imageIcon ? (
          <img
            src={item.imageIcon}
            alt={item.name}
            className={styles.iconImg}
            draggable={false}
          />
        ) : (
          <IconComponent size={28} strokeWidth={1.5} />
        )}
      </div>
      <span className={styles.iconLabel}>{item.name}</span>
    </div>
  );
}

export default function DesktopIcons() {
  const [selectedId, setSelectedId] = useState(null);
  const desktopIcons = useDesktopStore((state) => state.desktopIcons);
  const openApp = useWindowStore((state) => state.openApp);

  const handleLaunch = (item) => {
    const app = APP_REGISTRY[item.appId];
    if (app) {
      openApp(app);
    }
  };

  return (
    <div className={styles.iconsContainer} onClick={() => setSelectedId(null)}>
      {desktopIcons.map((item) => (
        <DraggableDesktopIcon
          key={item.id}
          item={item}
          isSelected={selectedId === item.id}
          onSelect={setSelectedId}
          onLaunch={handleLaunch}
        />
      ))}
    </div>
  );
}
