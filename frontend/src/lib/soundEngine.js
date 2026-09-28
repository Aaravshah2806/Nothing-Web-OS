// Web Audio API procedural sound synthesizer (Zero external sound assets needed)

let audioCtx = null;
let masterVolume = 0.8;
let isMuted = false;
let ambientSource = null;
let ambientGain = null;

export function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMasterVolume(vol) {
  masterVolume = Math.max(0, Math.min(1, vol));
  if (ambientGain && audioCtx) {
    ambientGain.gain.setValueAtTime(masterVolume * 0.15, audioCtx.currentTime);
  }
}

export function setSoundMuted(muted) {
  isMuted = Boolean(muted);
  if (isMuted && ambientSource) {
    stopAmbientFocus();
  }
}

export function getSoundSettings() {
  return { volume: masterVolume, muted: isMuted };
}

export const playTactileClick = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.03);

    const targetGain = 0.08 * masterVolume;
    gain.gain.setValueAtTime(targetGain, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch (e) {
    console.debug('Audio error', e);
  }
};

export const playMechanicalClick = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // High frequency click + noise burst
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(2400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.015);

    const targetGain = 0.05 * masterVolume;
    gain.gain.setValueAtTime(targetGain, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.015);
  } catch (e) {
    console.debug('Audio error', e);
  }
};

export const playSnapChime = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(580, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

    const targetGain = 0.06 * masterVolume;
    gain.gain.setValueAtTime(targetGain, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {
    console.debug('Audio error', e);
  }
};

export const playCloseChime = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.04);

    const targetGain = 0.04 * masterVolume;
    gain.gain.setValueAtTime(targetGain, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    console.debug('Audio error', e);
  }
};

export const playNotificationChime = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Dual-tone high tech ping
    [
      { freq: 880, start: 0, dur: 0.12 },
      { freq: 1320, start: 0.08, dur: 0.18 }
    ].forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

      const targetGain = 0.07 * masterVolume;
      gain.gain.setValueAtTime(targetGain, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    });
  } catch (e) {
    console.debug('Audio error', e);
  }
};

export const playTimerAlarm = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Pulse arpeggio chime for timer completion
    [0, 0.12, 0.24, 0.36].forEach((start, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freqs = [784, 988, 1174, 1568]; // G5, B5, D6, G6
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freqs[i], ctx.currentTime + start);

      const targetGain = 0.1 * masterVolume;
      gain.gain.setValueAtTime(targetGain, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + 0.25);
    });
  } catch (e) {
    console.debug('Audio error', e);
  }
};

export const playGlyphTone = (noteIndex = 0) => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const baseFrequencies = [440, 523.25, 659.25, 783.99, 880, 1046.5];
    const freq = baseFrequencies[noteIndex % baseFrequencies.length];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.98, ctx.currentTime + 0.08);

    const targetGain = 0.06 * masterVolume;
    gain.gain.setValueAtTime(targetGain, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.debug('Audio error', e);
  }
};

// Ambient sound generator for Focus / Pomodoro
export function startAmbientFocus(type = 'static') {
  if (isMuted) return;
  stopAmbientFocus();

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'rain' || type === 'pink') {
        // Pink / soft noise
        lastOut = (lastOut * 0.95) + (white * 0.05);
        output[i] = lastOut * 3;
      } else {
        // Soft white noise
        output[i] = white * 0.4;
      }
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to make it pleasant / warm
    const filter = ctx.createBiquadFilter();
    filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
    filter.frequency.setValueAtTime(type === 'rain' ? 800 : 1200, ctx.currentTime);

    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0.04 * masterVolume, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(ctx.destination);

    whiteNoise.start();
    ambientSource = whiteNoise;
  } catch (e) {
    console.debug('Ambient focus sound error', e);
  }
}

export function stopAmbientFocus() {
  if (ambientSource) {
    try {
      ambientSource.stop();
      ambientSource.disconnect();
    } catch {}
    ambientSource = null;
    ambientGain = null;
  }
}
