import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useWindowStore } from '../../store/useWindowStore';
import { getAppList } from '../../apps/appRegistry';
import styles from './SpotlightSearch.module.css';

export default function SpotlightSearch() {
  const { spotlightOpen, setSpotlightOpen } = useDesktopStore();
  const openApp = useWindowStore((state) => state.openApp);

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const apps = getAppList();

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (spotlightOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [spotlightOpen]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSpotlightOpen(!spotlightOpen);
      } else if (e.key === 'Escape' && spotlightOpen) {
        setSpotlightOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spotlightOpen, setSpotlightOpen]);

  const handleKeyDownInInput = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredApps.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredApps.length) % Math.max(1, filteredApps.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredApps[selectedIndex]) {
        openApp(filteredApps[selectedIndex]);
        setSpotlightOpen(false);
      }
    }
  };

  if (!spotlightOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => setSpotlightOpen(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar */}
        <div className={styles.inputWrapper}>
          <Search size={20} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownInInput}
            placeholder="SEARCH APPS, SETTINGS, COMMANDS..."
            className={styles.input}
          />
          <kbd className={styles.kbdBadge}>ESC</kbd>
        </div>

        {/* Results List */}
        <div className={styles.resultsList}>
          {filteredApps.length === 0 ? (
            <div className={styles.noResults}>NO MATCHING SYSTEM APPS FOUND</div>
          ) : (
            filteredApps.map((app, idx) => {
              const AppIcon = app.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={app.id}
                  onClick={() => {
                    openApp(app);
                    setSpotlightOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`${styles.resultRow} ${isSelected ? styles.selectedRow : ''}`}
                >
                  <div className={styles.appIconBox}>
                    <AppIcon size={18} />
                  </div>
                  <div className={styles.appInfo}>
                    <span className={styles.appName}>{app.name}</span>
                    <span className={styles.appCategory}>GLYPH OS APPLICATION</span>
                  </div>
                  {isSelected && (
                    <div className={styles.enterHint}>
                      <span>OPEN</span>
                      <CornerDownLeft size={12} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
