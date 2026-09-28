import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Play,
  Pause,
  Radio,
} from 'lucide-react';
import { useDesktopStore } from '../../store/useDesktopStore';
import { playGlyphTone, playMechanicalClick } from '../../lib/soundEngine';
import styles from './GlyphComposerApp.module.css';

const PRESETS = [
  { id: 'pulse', name: 'BREATHING PULSE', desc: 'Slow rhythmic gradient glow' },
  { id: 'heartbeat', name: 'GLYPH HEARTBEAT', desc: 'Double-pulse cardiac sequence' },
  { id: 'sweep', name: 'ORBITAL SWEEP', desc: 'Clockwise rotational sequence' },
  { id: 'strobe', name: 'METRONOME STROBE', desc: 'Sharp stroboscopic flash' },
  { id: 'battery', name: 'BATTERY TELEMETRY', desc: 'Exclamation bar reflects real battery' },
];

export default function GlyphComposerApp() {
  const {
    glyphMode,
    setGlyphMode,
    glyphBrightness,
    setGlyphBrightness,
    addNotification,
  } = useDesktopStore();

  const [activePreset, setActivePreset] = useState(glyphMode || 'pulse');
  const [isPlaying, setIsPlaying] = useState(true);
  const [bpm, setBpm] = useState(120);

  // Individual zone toggle states for manual composition
  const [zones, setZones] = useState({
    cameraRing: true,
    camDot: true,
    slash: true,
    centerCoil: true,
    bottomLine: true,
    bottomDot: true,
  });

  const [batteryLevel, setBatteryLevel] = useState(96);
  const animFrameRef = useRef(0);

  // Query live battery if available
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      navigator.getBattery().then((bat) => {
        setBatteryLevel(Math.round(bat.level * 100));
        bat.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(bat.level * 100));
        });
      }).catch(() => {});
    }
  }, []);

  // Animation cycle loop
  useEffect(() => {
    if (!isPlaying) return;

    let step = 0;
    const intervalMs = Math.round(60000 / (bpm * 2));

    const timer = setInterval(() => {
      step = (step + 1) % 16;
      animFrameRef.current = step;

      if (activePreset === 'heartbeat') {
        const isBeat = step === 0 || step === 2;
        setZones({
          cameraRing: isBeat,
          camDot: true,
          slash: isBeat,
          centerCoil: isBeat,
          bottomLine: isBeat,
          bottomDot: isBeat,
        });
        if (isBeat) playGlyphTone(step === 0 ? 0 : 2);
      } else if (activePreset === 'sweep') {
        setZones({
          cameraRing: step >= 0 && step < 4,
          camDot: true,
          slash: step >= 3 && step < 7,
          centerCoil: step >= 6 && step < 11,
          bottomLine: step >= 10 && step < 15,
          bottomDot: step >= 14 || step === 0,
        });
        if (step % 3 === 0) playGlyphTone(Math.floor(step / 3));
      } else if (activePreset === 'strobe') {
        const on = step % 4 === 0;
        setZones({
          cameraRing: on,
          camDot: true,
          slash: on,
          centerCoil: on,
          bottomLine: on,
          bottomDot: on,
        });
        if (on) playGlyphTone(4);
      } else if (activePreset === 'pulse') {
        // Continuous organic glow
        setZones({
          cameraRing: true,
          camDot: true,
          slash: true,
          centerCoil: true,
          bottomLine: true,
          bottomDot: true,
        });
      } else if (activePreset === 'battery') {
        setZones({
          cameraRing: false,
          camDot: true,
          slash: false,
          centerCoil: false,
          bottomLine: true,
          bottomDot: true,
        });
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, activePreset, bpm]);

  const toggleZone = (zoneKey) => {
    playMechanicalClick();
    setZones((prev) => ({ ...prev, [zoneKey]: !prev[zoneKey] }));
  };

  const handleSelectPreset = (presetId) => {
    playMechanicalClick();
    setActivePreset(presetId);
    setGlyphMode(presetId);
  };

  const handleTestRingtone = () => {
    setIsPlaying(true);
    addNotification({
      title: 'GLYPH SEQUENCE ACTIVE',
      message: `Playing ${activePreset.toUpperCase()} light sequence.`,
    });
  };

  return (
    <div className={styles.container}>
      {/* Hardware Chassis Visualizer */}
      <div className={styles.chassisStage}>
        <div className={styles.phoneBody}>
          <div className={styles.internalGridTexture} />

          {/* Dual Camera Module & Ring */}
          <div
            onClick={() => toggleZone('cameraRing')}
            className={`${styles.cameraModule} ${zones.cameraRing ? styles.activeLed : ''}`}
            title="Click to toggle Camera Ring Glyph"
          >
            <div className={styles.cameraLens} />
            <div className={styles.cameraLens} />
            {/* Red Recording LED dot */}
            <div className={`${styles.recDot} ${zones.camDot ? styles.recDotOn : ''}`} />
          </div>

          {/* Diagonal Slash Glyph */}
          <div
            onClick={() => toggleZone('slash')}
            className={`${styles.diagonalSlash} ${zones.slash ? styles.activeLed : ''}`}
            title="Click to toggle Diagonal Slash Glyph"
          />

          {/* Central Wireless Coil G-Arc */}
          <div
            onClick={() => toggleZone('centerCoil')}
            className={`${styles.centerCoil} ${zones.centerCoil ? styles.activeLed : ''}`}
            title="Click to toggle Wireless Coil Glyph"
          >
            <div className={styles.coilCore}>
              <div className={styles.coilDot} />
            </div>
          </div>

          {/* Bottom Exclamation Strip & Battery Progress */}
          <div className={styles.bottomCluster}>
            <div
              onClick={() => toggleZone('bottomLine')}
              className={`${styles.bottomLine} ${zones.bottomLine ? styles.activeLed : ''}`}
              title={`Click to toggle Exclamation Strip (${batteryLevel}%)`}
            >
              {activePreset === 'battery' && (
                <div
                  className={styles.batteryFill}
                  style={{ height: `${batteryLevel}%` }}
                />
              )}
            </div>
            <div
              onClick={() => toggleZone('bottomDot')}
              className={`${styles.bottomDot} ${zones.bottomDot ? styles.activeLed : ''}`}
              title="Click to toggle Exclamation Dot"
            />
          </div>

          <div className={styles.chassisBrand}>GLYPH OS (1)</div>
        </div>
      </div>

      {/* Control Studio Sidebar */}
      <div className={styles.controlsPanel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitle}>
            <Zap size={16} style={{ color: 'var(--accent)' }} />
            <span>GLYPH COMPOSER</span>
          </div>
          <span className={styles.hardwareStatus}>
            {isPlaying ? 'ACTIVE • ' + bpm + ' BPM' : 'STANDBY'}
          </span>
        </div>

        {/* Master Playback & Brightness */}
        <div className={styles.section}>
          <div className={styles.toolbar}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`${styles.playBtn} ${isPlaying ? styles.playBtnActive : ''}`}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'PAUSE GLYPH' : 'RUN SEQUENCE'}</span>
            </button>
            <button onClick={handleTestRingtone} className={styles.actionBtn}>
              <Radio size={14} />
              <span>TEST SIGNAL</span>
            </button>
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderLabelRow}>
              <span className={styles.sliderLabel}>BRIGHTNESS INTENSITY</span>
              <span className={styles.sliderValue}>{Math.round(glyphBrightness * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={glyphBrightness}
              onChange={(e) => setGlyphBrightness(parseFloat(e.target.value))}
              className={styles.rangeInput}
            />
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderLabelRow}>
              <span className={styles.sliderLabel}>PULSE TEMPO (BPM)</span>
              <span className={styles.sliderValue}>{bpm} BPM</span>
            </div>
            <input
              type="range"
              min="60"
              max="240"
              step="5"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value, 10))}
              className={styles.rangeInput}
            />
          </div>
        </div>

        {/* Light Sequence Presets */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>LIGHT PATTERNS</div>
          <div className={styles.presetList}>
            {PRESETS.map((p) => (
              <div
                key={p.id}
                onClick={() => handleSelectPreset(p.id)}
                className={`${styles.presetCard} ${activePreset === p.id ? styles.activePresetCard : ''}`}
              >
                <div className={styles.presetName}>{p.name}</div>
                <div className={styles.presetDesc}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Segment Switches */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>MANUAL SEGMENT OVERRIDE</div>
          <div className={styles.toggleGrid}>
            {Object.keys(zones).map((key) => (
              <button
                key={key}
                onClick={() => toggleZone(key)}
                className={`${styles.segmentToggle} ${zones[key] ? styles.segmentToggleOn : ''}`}
              >
                <span className={styles.toggleIndicator} />
                <span>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
