import React, { useEffect } from 'react';
import { useWindowStore } from '../../store/useWindowStore';
import { APP_REGISTRY } from '../../apps/appRegistry';
import styles from './AltTabSwitcher.module.css';

export default function AltTabSwitcher() {
  const { windows, altTabOpen, altTabSelectedIdx } = useWindowStore();

  useEffect(() => {
    let altPressed = false;

    const handleKeyDown = (e) => {
      if (e.key === 'Alt') {
        altPressed = true;
      }
      if (altPressed && e.key === 'Tab') {
        e.preventDefault();
        const store = useWindowStore.getState();
        if (!store.altTabOpen) {
          store.openAltTab();
        } else {
          store.cycleAltTab(!e.shiftKey);
        }
      }
      if (e.key === 'Escape' && useWindowStore.getState().altTabOpen) {
        useWindowStore.getState().cancelAltTab();
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Alt') {
        altPressed = false;
        if (useWindowStore.getState().altTabOpen) {
          useWindowStore.getState().commitAltTab();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  if (!altTabOpen || windows.length === 0) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.hud}>
        <div className={styles.header}>ACTIVE APPLICATIONS</div>
        <div className={styles.grid}>
          {windows.map((win, idx) => {
            const app = APP_REGISTRY[win.appId];
            const AppIcon = app?.icon;
            const isSelected = idx === altTabSelectedIdx;

            return (
              <div
                key={win.id}
                className={`${styles.card} ${isSelected ? styles.selectedCard : ''}`}
              >
                <div className={styles.iconBox}>
                  {AppIcon && <AppIcon size={24} />}
                </div>
                <div className={styles.cardTitle}>{win.title}</div>
              </div>
            );
          })}
        </div>
        <div className={styles.footer}>RELEASE ALT TO SWITCH • TAB TO CYCLE</div>
      </div>
    </div>
  );
}
