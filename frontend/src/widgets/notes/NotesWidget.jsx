import React from 'react';
import { FileText, ArrowUpRight } from 'lucide-react';
import { useWindowStore } from '../../store/useWindowStore';
import { useDesktopStore } from '../../store/useDesktopStore';
import { APP_REGISTRY } from '../../apps/appRegistry';
import styles from './NotesWidget.module.css';

export default function NotesWidget() {
  const { quickNote, setQuickNote } = useDesktopStore();
  const openApp = useWindowStore((state) => state.openApp);

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <FileText size={13} className={styles.icon} />
          <span className={styles.title}>QUICK NOTE</span>
        </div>
        <button
          onClick={() => openApp(APP_REGISTRY.notes)}
          className={styles.openBtn}
          title="Open Full Notes App"
        >
          <ArrowUpRight size={14} />
        </button>
      </div>

      <textarea
        value={quickNote}
        onChange={(e) => setQuickNote(e.target.value)}
        placeholder="Type a desktop note..."
        className={styles.textarea}
        spellCheck="false"
      />
      <div className={styles.footer}>AUTO-SAVED • SYNCED TO NOTES</div>
    </div>
  );
}
