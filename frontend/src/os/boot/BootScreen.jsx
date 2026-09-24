import React, { useState, useEffect } from 'react';
import styles from './BootScreen.module.css';

export default function BootScreen({ onBootComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onBootComplete, 300);
          return 100;
        }
        return prev + 5;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onBootComplete]);

  return (
    <div className={styles.overlay}>
      <div className={styles.logoBlock}>
        <div className={styles.logoText}>GLYPH OS (1)</div>
        <div className={styles.subtext}>INITIALIZING DESKTOP SUBSYSTEMS...</div>
      </div>

      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.progressLabel}>
          <span>MEM_CHECK: OK</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
