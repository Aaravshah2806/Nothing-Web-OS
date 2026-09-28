import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  VolumeX,
  CheckCircle2,
  CloudRain,
  Radio,
} from 'lucide-react';
import { useDesktopStore } from '../../store/useDesktopStore';
import {
  playTimerAlarm,
  playMechanicalClick,
  startAmbientFocus,
  stopAmbientFocus,
} from '../../lib/soundEngine';
import styles from './PomodoroApp.module.css';

const MODES = [
  { id: 'pomodoro', name: 'FOCUS (25M)', seconds: 25 * 60 },
  { id: 'deep', name: 'DEEP WORK (50M)', seconds: 50 * 60 },
  { id: 'sprint', name: 'SPRINT (15M)', seconds: 15 * 60 },
  { id: 'shortBreak', name: 'SHORT BREAK (5M)', seconds: 5 * 60 },
  { id: 'longBreak', name: 'LONG BREAK (15M)', seconds: 15 * 60 },
];

export default function PomodoroApp() {
  const [activeMode, setActiveMode] = useState(MODES[0]);
  const [timeLeft, setTimeLeft] = useState(MODES[0].seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState('none'); // 'none' | 'rain' | 'static'
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const addNotification = useDesktopStore((state) => state.addNotification);

  // Timer countdown effect
  useEffect(() => {
    let timer = null;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            stopAmbientFocus();
            playTimerAlarm();
            setSessionsCompleted((s) => s + 1);
            addNotification({
              title: 'FOCUS SESSION COMPLETE',
              message: `${activeMode.name} ended! Take a well-deserved breather.`,
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, activeMode, addNotification]);

  // Ambient sound management
  useEffect(() => {
    if (isRunning && ambientSound !== 'none') {
      startAmbientFocus(ambientSound);
    } else {
      stopAmbientFocus();
    }
    return () => stopAmbientFocus();
  }, [isRunning, ambientSound]);

  const handleStartPause = () => {
    playMechanicalClick();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    playMechanicalClick();
    setIsRunning(false);
    setTimeLeft(activeMode.seconds);
    stopAmbientFocus();
  };

  const handleSelectMode = (mode) => {
    playMechanicalClick();
    setActiveMode(mode);
    setIsRunning(false);
    setTimeLeft(mode.seconds);
    stopAmbientFocus();
  };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  // 24 segments around the glyph focus ring
  const totalSegments = 24;
  const activeSegments = Math.ceil(((activeMode.seconds - timeLeft) / activeMode.seconds) * totalSegments);

  return (
    <div className={styles.container}>
      {/* Top Session Mode Pills */}
      <div className={styles.modeBar}>
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => handleSelectMode(m)}
            className={`${styles.modeBtn} ${activeMode.id === m.id ? styles.activeModeBtn : ''}`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Glyph Countdown Dial Area */}
      <div className={styles.dialStage}>
        <div className={styles.glyphRing}>
          {Array.from({ length: totalSegments }).map((_, index) => {
            const isFilled = index < activeSegments;
            const angle = (index / totalSegments) * 360;
            return (
              <div
                key={index}
                className={`${styles.ringSegment} ${isFilled ? styles.ringSegmentActive : ''}`}
                style={{
                  transform: `rotate(${angle}deg) translateY(-94px)`,
                }}
              />
            );
          })}

          <div className={styles.timeCenter}>
            <div className={styles.digitDisplay}>
              <span>{minutes}</span>
              <span className={isRunning ? styles.colonBlink : ''}>:</span>
              <span>{seconds}</span>
            </div>
            <div className={styles.modeLabel}>{activeMode.name}</div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className={styles.controlsRow}>
        <button
          onClick={handleStartPause}
          className={`${styles.mainControlBtn} ${isRunning ? styles.pauseBtn : styles.startBtn}`}
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: 2 }} />}
          <span>{isRunning ? 'PAUSE TIMER' : 'START FOCUS'}</span>
        </button>

        <button onClick={handleReset} className={styles.resetBtn} title="Reset Timer">
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Ambient Audio & Telemetry Footer */}
      <div className={styles.footerPanel}>
        <div className={styles.ambientGroup}>
          <span className={styles.panelLabel}>AMBIENT FOCUS SOUND:</span>
          <div className={styles.ambientOptions}>
            <button
              onClick={() => setAmbientSound('none')}
              className={`${styles.ambBtn} ${ambientSound === 'none' ? styles.activeAmbBtn : ''}`}
            >
              <VolumeX size={12} />
              <span>OFF</span>
            </button>
            <button
              onClick={() => setAmbientSound('rain')}
              className={`${styles.ambBtn} ${ambientSound === 'rain' ? styles.activeAmbBtn : ''}`}
            >
              <CloudRain size={12} />
              <span>RAIN</span>
            </button>
            <button
              onClick={() => setAmbientSound('static')}
              className={`${styles.ambBtn} ${ambientSound === 'static' ? styles.activeAmbBtn : ''}`}
            >
              <Radio size={12} />
              <span>STATIC</span>
            </button>
          </div>
        </div>

        <div className={styles.statBadge}>
          <CheckCircle2 size={13} style={{ color: 'var(--accent)' }} />
          <span>COMPLETED TODAY: {sessionsCompleted} SESSIONS</span>
        </div>
      </div>
    </div>
  );
}
