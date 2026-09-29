import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Disc } from 'lucide-react';
import { playMechanicalClick, getAudioContext } from '../../lib/soundEngine';
import styles from './MusicWidget.module.css';

const TRACKS = [
  { id: '1', title: 'GLYPH_PULSE_01', artist: 'NOTHING SOUND LAB' },
  { id: '2', title: 'DOT_MATRIX_BEAT', artist: 'NEO MONOCHROME' },
  { id: '3', title: 'TRANSPARENT_BASS', artist: 'CARL & CO' },
];

export default function MusicWidget() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);
  const [eqLevels, setEqLevels] = useState([40, 80, 25, 95, 60]);
  const synthTimerRef = useRef(null);

  const track = TRACKS[currentIdx];

  // Procedural subtle rhythm generator when playing
  useEffect(() => {
    if (!isPlaying) {
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
      return;
    }

    let step = 0;
    synthTimerRef.current = setInterval(() => {
      step = (step + 1) % 16;
      setProgress((p) => (p >= 100 ? 0 : p + 0.5));

      // Randomize subtle EQ equalizer bars
      setEqLevels([
        20 + Math.floor(Math.random() * 75),
        30 + Math.floor(Math.random() * 65),
        15 + Math.floor(Math.random() * 80),
        40 + Math.floor(Math.random() * 55),
        25 + Math.floor(Math.random() * 70),
      ]);

      // Play soft cyber pulse sound periodically
      try {
        const ctx = getAudioContext();
        if (ctx && step % 4 === 0) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(step === 0 ? 110 : 82, ctx.currentTime);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.12);
        }
      } catch {}
    }, 250);

    return () => {
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    };
  }, [isPlaying]);

  const togglePlay = (e) => {
    e.stopPropagation();
    playMechanicalClick();
    setIsPlaying(!isPlaying);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    playMechanicalClick();
    setCurrentIdx((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    playMechanicalClick();
    setCurrentIdx((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  return (
    <div className={styles.musicPill} title="Nothing OS Music Player (NThing-UI)">
      {/* Vinyl Disc / Album Art */}
      <div className={`${styles.vinylWrap} ${isPlaying ? styles.spinning : ''}`}>
        <div className={styles.vinylGrooves}>
          <div className={styles.vinylCenter}>
            <span className={styles.vinylDot} />
          </div>
        </div>
      </div>

      {/* Track Info & Progress */}
      <div className={styles.trackInfo}>
        <div className={styles.titleRow}>
          <span className={styles.trackTitle}>{track.title}</span>
        </div>
        <span className={styles.trackArtist}>{track.artist}</span>

        {/* Progress Bar */}
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Playback Controls */}
      <div className={styles.controlsRow}>
        <button onClick={handlePrev} className={styles.ctrlBtn} title="Previous Track">
          <SkipBack size={12} />
        </button>
        <button onClick={togglePlay} className={`${styles.ctrlBtn} ${styles.playBtn}`} title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause size={12} /> : <Play size={12} />}
        </button>
        <button onClick={handleNext} className={styles.ctrlBtn} title="Next Track">
          <SkipForward size={12} />
        </button>
      </div>

      {/* Animated Dot-Matrix Audio Equalizer */}
      <div className={styles.eqWrap}>
        {eqLevels.map((lvl, i) => (
          <div
            key={i}
            className={styles.eqBar}
            style={{ height: isPlaying ? `${lvl}%` : '20%' }}
          />
        ))}
      </div>
    </div>
  );
}
