import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc, Repeat, Shuffle } from 'lucide-react';
import styles from './MusicApp.module.css';

const TRACKS = [
  { id: '1', title: 'GLYPH_PULSE_01', artist: 'NOTHING SOUND LAB', duration: '03:24', bpm: '124 BPM' },
  { id: '2', title: 'DOT_MATRIX_GROOVE', artist: 'NEO MONOCHROME', duration: '02:48', bpm: '118 BPM' },
  { id: '3', title: 'TRANSPARENT_FREQUENCY', artist: 'CARL & CO', duration: '04:12', bpm: '130 BPM' },
  { id: '4', title: 'BRUTALIST_SUB_BASS', artist: 'GLYPH OS AUDIO', duration: '03:05', bpm: '110 BPM' },
];

export default function MusicApp() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [volume, setVolume] = useState(80);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  return (
    <div className={styles.container}>
      {/* Vinyl / Glyph Disc Graphic */}
      <div className={styles.visualizerArea}>
        <div className={`${styles.glyphDisc} ${isPlaying ? styles.rotating : ''}`}>
          <div className={styles.discInner}>
            <div className={styles.discCenterDot} />
          </div>
        </div>

        {/* LED Audio Visualizer bars */}
        <div className={styles.equalizerBars}>
          {[40, 75, 20, 90, 60, 30, 85, 45, 95, 65, 35, 80].map((height, i) => (
            <div
              key={i}
              className={`${styles.eqBar} ${isPlaying ? styles.eqBarAnimated : ''}`}
              style={{
                '--bar-height': `${height}%`,
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Track Info */}
      <div className={styles.trackDetails}>
        <div className={styles.trackTitle}>{currentTrack.title}</div>
        <div className={styles.trackArtist}>{currentTrack.artist} • {currentTrack.bpm}</div>
      </div>

      {/* Scrubber Progress */}
      <div className={styles.scrubberWrapper}>
        <span className={styles.timeTag}>
          0{Math.floor((progress * 2.04) / 60)}:
          {String(Math.floor((progress * 2.04) % 60)).padStart(2, '0')}
        </span>
        <div
          className={styles.scrubberTrack}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            setProgress(Math.floor(clickPos * 100));
          }}
        >
          <div className={styles.scrubberFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.timeTag}>{currentTrack.duration}</span>
      </div>

      {/* Control buttons */}
      <div className={styles.controls}>
        <button className={styles.secondaryBtn} title="Shuffle">
          <Shuffle size={14} />
        </button>
        <button onClick={prevTrack} className={styles.controlBtn} title="Previous">
          <SkipBack size={18} />
        </button>
        <button onClick={togglePlay} className={styles.playBtn} title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: 2 }} />}
        </button>
        <button onClick={nextTrack} className={styles.controlBtn} title="Next">
          <SkipForward size={18} />
        </button>
        <button className={styles.secondaryBtn} title="Repeat">
          <Repeat size={14} />
        </button>
      </div>

      {/* Track list */}
      <div className={styles.playlist}>
        {TRACKS.map((t, index) => (
          <div
            key={t.id}
            onClick={() => {
              setCurrentTrackIndex(index);
              setIsPlaying(true);
            }}
            className={`${styles.playItem} ${index === currentTrackIndex ? styles.activePlayItem : ''}`}
          >
            <span className={styles.playItemIndex}>0{index + 1}</span>
            <div className={styles.playItemInfo}>
              <span className={styles.playItemTitle}>{t.title}</span>
              <span className={styles.playItemArtist}>{t.artist}</span>
            </div>
            <span className={styles.playItemDuration}>{t.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
