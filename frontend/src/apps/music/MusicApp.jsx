import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Upload,
} from 'lucide-react';
import { useDesktopStore } from '../../store/useDesktopStore';
import { getAudioContext, playMechanicalClick } from '../../lib/soundEngine';
import styles from './MusicApp.module.css';

const DEFAULT_TRACKS = [
  { id: '1', title: 'GLYPH_PULSE_01', artist: 'NOTHING SOUND LAB', duration: '03:20', bpm: 120, isSynth: true },
  { id: '2', title: 'DOT_MATRIX_GROOVE', artist: 'NEO MONOCHROME', duration: '02:40', bpm: 110, isSynth: true },
  { id: '3', title: 'TRANSPARENT_FREQUENCY', artist: 'CARL & CO', duration: '04:10', bpm: 128, isSynth: true },
  { id: '4', title: 'BRUTALIST_SUB_BASS', artist: 'GLYPH OS AUDIO', duration: '03:15', bpm: 95, isSynth: true },
];

export default function MusicApp() {
  const [tracks, setTracks] = useState(DEFAULT_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [eqLevels, setEqLevels] = useState([40, 75, 20, 90, 60, 30, 85, 45, 95, 65, 35, 80]);

  const fileInputRef = useRef(null);
  const audioElemRef = useRef(new Audio());
  const synthTimerRef = useRef(null);
  const synthStepRef = useRef(0);

  const addNotification = useDesktopStore((state) => state.addNotification);
  const currentTrack = tracks[currentTrackIndex];

  const nextTrack = useCallback(() => {
    playMechanicalClick();
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setProgress(0);
  }, [tracks.length]);

  const prevTrack = useCallback(() => {
    playMechanicalClick();
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setProgress(0);
  }, [tracks.length]);

  // Real Web Audio procedural cyber-groove synthesizer
  const playSynthStep = useCallback((step) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const volMultiplier = (volume / 100) * 0.15;

      // 1. Kick on beat 0, 4, 8, 12
      if (step % 4 === 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(volMultiplier * 1.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }

      // 2. Hi-hat on odd 8th steps
      if (step % 2 === 1) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'highpass';
        osc.frequency.setValueAtTime(8000, ctx.currentTime);
        gain.gain.setValueAtTime(volMultiplier * 0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      }

      // 3. Arp Melodic Note
      const chordNotes = [
        [220, 261.63, 329.63, 392], // Am7
        [174.61, 220, 261.63, 329.63], // Fmaj7
        [130.81, 164.81, 196, 246.94], // C
        [196, 246.94, 293.66, 392], // G
      ];
      const chord = chordNotes[Math.floor(step / 4) % chordNotes.length];
      const noteFreq = chord[step % chord.length] * 1.5;

      const noteOsc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      noteOsc.type = 'sawtooth';
      noteOsc.frequency.setValueAtTime(noteFreq, ctx.currentTime);
      noteGain.gain.setValueAtTime(volMultiplier * 0.4, ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      noteOsc.connect(noteGain);
      noteGain.connect(ctx.destination);
      noteOsc.start();
      noteOsc.stop(ctx.currentTime + 0.15);

      // Random dynamic equalizer bounce
      setEqLevels((prev) =>
        prev.map(() => Math.floor(Math.random() * 75) + 20)
      );
    } catch (e) {
      console.debug('Synth step error', e);
    }
  }, [volume]);

  // Synthesizer playback loop
  useEffect(() => {
    if (isPlaying && currentTrack.isSynth) {
      const stepInterval = Math.round(60000 / (currentTrack.bpm * 4));
      synthTimerRef.current = setInterval(() => {
        synthStepRef.current = (synthStepRef.current + 1) % 16;
        playSynthStep(synthStepRef.current);
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, stepInterval);
    } else {
      clearInterval(synthTimerRef.current);
    }

    return () => clearInterval(synthTimerRef.current);
  }, [isPlaying, currentTrack, volume, playSynthStep]);

  // Audio element handler for custom user uploads
  useEffect(() => {
    const audio = audioElemRef.current;
    if (!currentTrack.isSynth && currentTrack.url) {
      audio.src = currentTrack.url;
      audio.volume = volume / 100;
      if (isPlaying) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }

      const updateProgress = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      const handleEnded = () => {
        nextTrack();
      };

      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('ended', handleEnded);
      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentTrack, isPlaying, volume, nextTrack]);

  const togglePlay = () => {
    playMechanicalClick();
    setIsPlaying(!isPlaying);
  };

  const handleCustomAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const newTrack = {
      id: `user-track-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, '').toUpperCase(),
      artist: 'LOCAL AUDIO STREAM',
      duration: 'LIVE',
      bpm: 120,
      isSynth: false,
      url: objectUrl,
    };

    setTracks([newTrack, ...tracks]);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
    setProgress(0);

    addNotification({
      title: 'AUDIO ASSET IMPORTED',
      message: `Playing ${newTrack.title} in Glyph Music Player.`,
    });
  };

  return (
    <div className={styles.container}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleCustomAudioUpload}
        accept="audio/*"
        style={{ display: 'none' }}
      />

      {/* Visualizer Area */}
      <div className={styles.visualizerArea}>
        <div className={`${styles.glyphDisc} ${isPlaying ? styles.rotating : ''}`}>
          <div className={styles.discInner}>
            <div className={styles.discCenterDot} />
          </div>
        </div>

        {/* LED Audio Visualizer bars */}
        <div className={styles.equalizerBars}>
          {eqLevels.map((height, i) => (
            <div
              key={i}
              className={`${styles.eqBar} ${isPlaying ? styles.eqBarAnimated : ''}`}
              style={{
                '--bar-height': `${isPlaying ? height : 15}%`,
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Track Info */}
      <div className={styles.trackDetails}>
        <div className={styles.trackTitle}>{currentTrack.title}</div>
        <div className={styles.trackArtist}>
          {currentTrack.artist} • {currentTrack.bpm} BPM {currentTrack.isSynth ? '(GLYPH SYNTH)' : '(LOCAL AUDIO)'}
        </div>
      </div>

      {/* Scrubber Progress */}
      <div className={styles.scrubberWrapper}>
        <span className={styles.timeTag}>
          0{Math.floor((progress * 2) / 60)}:
          {String(Math.floor((progress * 2) % 60)).padStart(2, '0')}
        </span>
        <div
          className={styles.scrubberTrack}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            const newPct = Math.floor(clickPos * 100);
            setProgress(newPct);
            if (!currentTrack.isSynth && audioElemRef.current.duration) {
              audioElemRef.current.currentTime = (newPct / 100) * audioElemRef.current.duration;
            }
          }}
        >
          <div className={styles.scrubberFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.timeTag}>{currentTrack.duration}</span>
      </div>

      {/* Control buttons */}
      <div className={styles.controls}>
        <button
          onClick={() => fileInputRef.current?.click()}
          className={styles.secondaryBtn}
          title="Import Local Audio Track"
        >
          <Upload size={14} />
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

        <div className={styles.volumeMini}>
          <Volume2 size={14} />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value, 10))}
            className={styles.volumeRange}
            title={`Volume: ${volume}%`}
          />
        </div>
      </div>

      {/* Track list */}
      <div className={styles.playlist}>
        {tracks.map((t, index) => (
          <div
            key={t.id}
            onClick={() => {
              playMechanicalClick();
              setCurrentTrackIndex(index);
              setIsPlaying(true);
              setProgress(0);
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
