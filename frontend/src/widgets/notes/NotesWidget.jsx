import React, { useState, useEffect } from 'react';
import { FileText, ArrowUpRight } from 'lucide-react';
import { useWindowStore } from '../../store/useWindowStore';
import { APP_REGISTRY } from '../../apps/appRegistry';
import styles from './NotesWidget.module.css';

export default function NotesWidget() {
  const [quickNote, setQuickNote] = useState(() => {
    try {
      const saved = localStorage.getItem('glyph_quick_note');
      return saved || 'Quick thought:\n- Check Nothing OS specs\n- Configure Supabase RLS\n- Deploy Glyph OS (1)';
    } catch {
      return 'Quick thought:\n- Check Nothing OS specs';
    }
  });

  const openApp = useWindowStore((state) => state.openApp);

  useEffect(() => {
    try {
      localStorage.setItem('glyph_quick_note', quickNote);
    } catch (e) {
      console.error(e);
    }
  }, [quickNote]);

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
      />
      <div className={styles.footer}>AUTO-SAVED TO DISK</div>
    </div>
  );
}
