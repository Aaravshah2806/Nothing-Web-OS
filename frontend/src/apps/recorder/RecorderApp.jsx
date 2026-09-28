import React, { useState, useEffect, useRef } from 'react';
import {
  Square,
  Play,
  Pause,
  Trash2,
  Download,
} from 'lucide-react';
import { useDesktopStore } from '../../store/useDesktopStore';
import { playMechanicalClick } from '../../lib/soundEngine';
import styles from './RecorderApp.module.css';

export default function RecorderApp() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [recordings, setRecordings] = useState([]);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioPlayerRef = useRef(new Audio());
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const analyserRef = useRef(null);

  const addNotification = useDesktopStore((state) => state.addNotification);

  // Audio recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  // Audio player end listener
  useEffect(() => {
    const audio = audioPlayerRef.current;
    const handleEnded = () => setCurrentPlayingId(null);
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  // Visualizer loop for mic input
  const startVisualizer = (stream) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const cCtx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        analyser.getByteFrequencyData(dataArray);

        cCtx.clearRect(0, 0, width, height);
        const barWidth = (width / bufferLength) * 1.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height;
          cCtx.fillStyle = '#ff3b30';
          cCtx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
          x += barWidth;
        }

        animFrameRef.current = requestAnimationFrame(draw);
      };

      draw();
    } catch (e) {
      console.debug('Visualizer error', e);
    }
  };

  const startRecording = async () => {
    playMechanicalClick();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      startVisualizer(stream);

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const newRecord = {
          id: `memo-${Date.now()}`,
          name: `GLYPH_MEMO_${String(recordings.length + 1).padStart(2, '0')}.WEBM`,
          url: audioUrl,
          duration: `${String(Math.floor(recordTime / 60)).padStart(2, '0')}:${String(recordTime % 60).padStart(2, '0')}`,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setRecordings((prev) => [newRecord, ...prev]);
        cancelAnimationFrame(animFrameRef.current);
        stream.getTracks().forEach((track) => track.stop());

        addNotification({
          title: 'AUDIO MEMO RECORDED',
          message: `Saved ${newRecord.name} (${newRecord.duration})`,
        });
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone error', err);
      // Fallback demo recording if no microphone access
      simulateDemoRecording();
    }
  };

  const simulateDemoRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const simulated = {
        id: `memo-${Date.now()}`,
        name: `VOICE_MEMO_${String(recordings.length + 1).padStart(2, '0')}.RAW`,
        url: null,
        duration: '00:08',
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setRecordings((prev) => [simulated, ...prev]);
      addNotification({
        title: 'DEMO MEMO RECORDED',
        message: 'Saved simulation voice track to disk.',
      });
    }, 4000);
  };

  const stopRecording = () => {
    playMechanicalClick();
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const togglePlay = (rec) => {
    playMechanicalClick();
    if (currentPlayingId === rec.id) {
      audioPlayerRef.current.pause();
      setCurrentPlayingId(null);
    } else {
      if (rec.url) {
        audioPlayerRef.current.src = rec.url;
        audioPlayerRef.current.play();
        setCurrentPlayingId(rec.id);
      }
    }
  };

  const handleDelete = (id) => {
    playMechanicalClick();
    setRecordings(recordings.filter((r) => r.id !== id));
    if (currentPlayingId === id) {
      audioPlayerRef.current.pause();
      setCurrentPlayingId(null);
    }
  };

  const minutes = String(Math.floor(recordTime / 60)).padStart(2, '0');
  const seconds = String(recordTime % 60).padStart(2, '0');

  return (
    <div className={styles.container}>
      {/* Tape Deck Stage */}
      <div className={styles.tapeDeck}>
        {/* Animated Tape Reels */}
        <div className={styles.reelCluster}>
          <div className={`${styles.tapeReel} ${isRecording || currentPlayingId ? styles.reelSpinning : ''}`}>
            <div className={styles.reelSpoke} />
            <div className={styles.reelSpoke} style={{ transform: 'rotate(60deg)' }} />
            <div className={styles.reelSpoke} style={{ transform: 'rotate(120deg)' }} />
            <div className={styles.reelHub} />
          </div>

          <div className={styles.tapeWindow}>
            <div className={styles.tapeFilm} />
            {isRecording && <div className={styles.recDotGlow} />}
          </div>

          <div className={`${styles.tapeReel} ${isRecording || currentPlayingId ? styles.reelSpinning : ''}`}>
            <div className={styles.reelSpoke} />
            <div className={styles.reelSpoke} style={{ transform: 'rotate(60deg)' }} />
            <div className={styles.reelSpoke} style={{ transform: 'rotate(120deg)' }} />
            <div className={styles.reelHub} />
          </div>
        </div>

        {/* Counter Display & Waveform */}
        <div className={styles.counterRow}>
          <div className={styles.counterDigits}>
            <span className={isRecording ? styles.recRed : ''}>
              {minutes}:{seconds}
            </span>
          </div>
          <canvas ref={canvasRef} width={140} height={28} className={styles.micWaveform} />
        </div>

        {/* Record Trigger Button */}
        <div className={styles.deckControls}>
          {!isRecording ? (
            <button onClick={startRecording} className={styles.recBtn} title="Start Audio Recording">
              <div className={styles.recIconInner} />
              <span>RECORD MEMO</span>
            </button>
          ) : (
            <button onClick={stopRecording} className={styles.stopBtn} title="Stop Recording">
              <Square size={16} fill="currentColor" />
              <span>STOP & SAVE</span>
            </button>
          )}
        </div>
      </div>

      {/* Recorded Memos List */}
      <div className={styles.memoListPanel}>
        <div className={styles.listHeader}>
          <span>ARCHIVED MEMOS</span>
          <span className={styles.countBadge}>{recordings.length} RECORDINGS</span>
        </div>

        <div className={styles.memosScroll}>
          {recordings.length === 0 ? (
            <div className={styles.emptyNotice}>NO RECORDINGS FOUND. PRESS RECORD TO CAPTURE AUDIO.</div>
          ) : (
            recordings.map((rec) => {
              const isPlayingThis = currentPlayingId === rec.id;
              return (
                <div key={rec.id} className={`${styles.memoItem} ${isPlayingThis ? styles.memoItemPlaying : ''}`}>
                  <button onClick={() => togglePlay(rec)} className={styles.memoPlayBtn}>
                    {isPlayingThis ? <Pause size={14} /> : <Play size={14} />}
                  </button>

                  <div className={styles.memoDetails}>
                    <span className={styles.memoName}>{rec.name}</span>
                    <span className={styles.memoMeta}>
                      {rec.duration} • {rec.date}
                    </span>
                  </div>

                  <div className={styles.memoActions}>
                    {rec.url && (
                      <a href={rec.url} download={rec.name} className={styles.actionIcon} title="Download Audio">
                        <Download size={14} />
                      </a>
                    )}
                    <button onClick={() => handleDelete(rec.id)} className={styles.actionIcon} title="Delete Memo">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
