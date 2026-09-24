import React, { useState } from 'react';
import { Folder, FileText, Terminal, Image, Trash2, FileCode } from 'lucide-react';
import { useWindowStore } from '../../store/useWindowStore';
import { APP_REGISTRY } from '../../apps/appRegistry';
import styles from './DesktopIcons.module.css';

const DEFAULT_DESKTOP_ICONS = [
  { id: 'icon-files', name: 'FILES', icon: Folder, appId: 'files', x: 28, y: 540 },
  { id: 'icon-terminal', name: 'TERMINAL', icon: Terminal, appId: 'terminal', x: 28, y: 640 },
  { id: 'icon-notes', name: 'NOTES', icon: FileText, appId: 'notes', x: 120, y: 540 },
  { id: 'icon-readme', name: 'README.TXT', icon: FileCode, appId: 'notes', x: 120, y: 640 },
  { id: 'icon-trash', name: 'TRASH', icon: Trash2, appId: 'files', x: 212, y: 540 },
];

export default function DesktopIcons() {
  const [selectedId, setSelectedId] = useState(null);
  const openApp = useWindowStore((state) => state.openApp);

  const handleDoubleClick = (item) => {
    const app = APP_REGISTRY[item.appId];
    if (app) {
      openApp(app);
    }
  };

  return (
    <div className={styles.iconsContainer} onClick={() => setSelectedId(null)}>
      {DEFAULT_DESKTOP_ICONS.map((item) => {
        const IconComponent = item.icon;
        const isSelected = selectedId === item.id;

        return (
          <div
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedId(item.id);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleDoubleClick(item);
            }}
            className={`${styles.iconItem} ${isSelected ? styles.selected : ''}`}
            style={{ left: `${item.x}px`, top: `${item.y}px` }}
          >
            <div className={styles.iconBox}>
              <IconComponent size={28} strokeWidth={1.5} />
            </div>
            <span className={styles.iconLabel}>{item.name}</span>
          </div>
        );
      })}
    </div>
  );
}
