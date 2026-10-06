import React, { useState, useEffect, useRef } from 'react';
import { playMechanicalClick, playSnapChime } from '../../lib/soundEngine';
import styles from './BootScreen.module.css';

const LETTERS = ['N', 'O', 'T', 'H', 'I', 'N', 'G'];

export default function BootScreen({ onBootComplete }) {
  const [phase, setPhase] = useState(0); // 0: dot, 1: text, 2: progress, 3: exit
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [showPeriod, setShowPeriod] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const completedRef = useRef(false);

  const finishBoot = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsFading(true);
    playSnapChime();
    setTimeout(() => {
      onBootComplete?.();
    }, 600);
  };

  // Keyboard / Click skip trigger
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ([' ', 'Enter', 'Escape'].includes(e.key)) {
        finishBoot();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Boot sequence timeline
  useEffect(() => {
    // 0.0s - 0.5s: Faint dot-grid & single center red LED
    const t0 = setTimeout(() => {
      setPhase(1);
    }, 550);

    // 0.6s - 1.2s: Letter-by-letter dot-matrix typing
    const letterTimers = LETTERS.map((_, i) =>
      setTimeout(() => {
        setVisibleLetters(i + 1);
        try { playMechanicalClick(); } catch {}
      }, 600 + i * 85)
    );

    // Red period pop-in
    const tPeriod = setTimeout(() => {
      setShowPeriod(true);
      setPhase(2);
    }, 600 + LETTERS.length * 85 + 60);

    // 1.3s - 2.1s: Progress bar 0 -> 100%
    let progressTimer = null;
    const tProgStart = setTimeout(() => {
      const interval = 25; // 25ms tick
      const increment = 100 / (800 / interval); // ~800ms total fill
      progressTimer = setInterval(() => {
        setProgress((prev) => {
          const next = prev + increment;
          if (next >= 100) {
            clearInterval(progressTimer);
            return 100;
          }
          return next;
        });
      }, interval);
    }, 1250);

    // 2.2s: Fade-out transition into desktop widgets
    const tComplete = setTimeout(() => {
      finishBoot();
    }, 2250);

    return () => {
      clearTimeout(t0);
      letterTimers.forEach(clearTimeout);
      clearTimeout(tPeriod);
      clearTimeout(tProgStart);
      if (progressTimer) clearInterval(progressTimer);
      clearTimeout(tComplete);
    };
  }, []);

  return (
    <div
      className={`${styles.bootOverlay} ${isFading ? styles.bootOverlayFading : ''}`}
      onClick={finishBoot}
      title="Click or press Space to skip intro"
    >
      {/* 0.0 - 0.8s: Faint white dot-grid */}
      <div className={styles.dotGrid} />

      {/* Subtle CRT scanline overlay */}
      <div className={styles.crtOverlay} />

      {/* Center Stage: Logo, LED, Progress */}
      <div className={styles.centerStage}>
        {/* Phase 0: Center Red LED Dot */}
        {phase === 0 && <div className={styles.centerLedDot} />}

        {/* Phase 1+: Logo with dual horizontal glyph light strips */}
        {phase >= 1 && (
          <div className={styles.logoWrapper}>
            <div className={styles.glyphStripLeft} />

            <div className={styles.logoText}>
              {LETTERS.map((char, index) => (
                <span
                  key={index}
                  className={styles.letter}
                  style={{
                    opacity: index < visibleLetters ? 1 : 0,
                    animationDelay: `${index * 0.08}s`,
                  }}
                >
                  {char}
                </span>
              ))}
              {showPeriod && <span className={styles.redPeriod}>.</span>}
            </div>

            <div className={styles.glyphStripRight} />
          </div>
        )}

        {/* Phase 2+: Thin Red Progress Bar & Telemetry */}
        {phase >= 2 && (
          <div className={styles.progressBlock}>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${Math.min(100, Math.round(progress))}%` }}
              />
            </div>

            <div className={styles.metaRow}>
              <span className={styles.metaStatus}>NTHING WEBOS // KERNEL 2.0</span>
              <span className={styles.metaPercent}>{Math.min(100, Math.round(progress))}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Subtle skip prompt */}
      <div className={styles.skipPrompt}>PRESS SPACE OR CLICK TO SKIP</div>
    </div>
  );
}
