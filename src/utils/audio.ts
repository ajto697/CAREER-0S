// Web Audio API Synthesizer for 8-bit Retro Game SFX and Chiptune BGM

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playSound = {
  click: (enabled: boolean = true) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  },

  pass: (enabled: boolean = true) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.15);
      });
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  },

  fail: (enabled: boolean = true) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      const notes = [300, 250, 200];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + idx * 0.1 + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.12);
      });
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  },

  confetti: (enabled: boolean = true) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      const scale = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      scale.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + idx * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.2);
      });
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }
};

// Cinematic Ambient Synthesizer for Intro & Ending Themes
let cinematicBgmInterval: any = null;
let activeBgmGain: GainNode | null = null;

export const playCinematicTheme = (type: 'intro' | 'ending' | 'hope', enabled: boolean = true) => {
  if (!enabled) return;
  stopCinematicTheme();

  try {
    const ctx = getAudioContext();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
    masterGain.connect(ctx.destination);
    activeBgmGain = masterGain;

    let chords: number[][];
    if (type === 'intro') {
      // Dramatic Cyberpunk / Academic minor-to-major progression
      // D minor -> Bb major -> F major -> C major
      chords = [
        [146.83, 220.00, 261.63, 349.23], // Dm
        [116.54, 233.08, 293.66, 349.23], // Bb
        [174.61, 220.00, 261.63, 349.23], // F
        [130.81, 196.00, 261.63, 329.63], // C
      ];
    } else if (type === 'ending') {
      // Inspiring, emotional, uplifting graduation progression
      // G major -> D major -> Em -> C major
      chords = [
        [196.00, 246.94, 293.66, 392.00], // G
        [146.83, 220.00, 293.66, 370.00], // D
        [164.81, 246.94, 329.63, 392.00], // Em
        [130.81, 261.63, 329.63, 392.00], // C
      ];
    } else {
      // Warm reflective Hope progression
      chords = [
        [261.63, 329.63, 392.00, 523.25], // C
        [220.00, 261.63, 329.63, 440.00], // Am
        [174.61, 220.00, 261.63, 349.23], // F
        [196.00, 246.94, 293.66, 392.00], // G
      ];
    }

    let chordIndex = 0;
    const playNextChord = () => {
      if (!audioCtx || audioCtx.state === 'closed') return;
      const currentChord = chords[chordIndex % chords.length];
      chordIndex++;

      currentChord.forEach((freq, idx) => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const chordGain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = idx === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(type === 'ending' ? 1400 : 900, audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(type === 'ending' ? 2600 : 1700, audioCtx.currentTime + 3.0);

        chordGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        chordGain.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 0.8);
        chordGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.8);

        osc.connect(filter);
        filter.connect(chordGain);
        chordGain.connect(masterGain);

        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 4.0);
      });
    };

    playNextChord();
    cinematicBgmInterval = setInterval(playNextChord, 3800);
  } catch (e) {
    console.warn('Cinematic theme audio error', e);
  }
};

export const stopCinematicTheme = () => {
  if (cinematicBgmInterval) {
    clearInterval(cinematicBgmInterval);
    cinematicBgmInterval = null;
  }
  if (activeBgmGain && audioCtx) {
    try {
      activeBgmGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
    } catch (e) {}
    activeBgmGain = null;
  }
};
