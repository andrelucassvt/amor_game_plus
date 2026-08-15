const MUSIC_THEMES = Object.freeze({
  forest: {
    bpm: 152,
    lead: { shift: 0, cutoff: 2600, gain: 0.11 },
    bass: { cutoff: 500, gain: 0.13 },
    drums: 'full',
    drumsGain: 1,
    pad: false,
  },
  vale: {
    bpm: 152,
    lead: { shift: 12, cutoff: 3800, gain: 0.1 },
    bass: { cutoff: 450, gain: 0.11 },
    drums: 'light',
    drumsGain: 0.9,
    pad: false,
  },
  night: {
    bpm: 116,
    lead: { shift: 0, cutoff: 1800, gain: 0.09 },
    bass: { cutoff: 400, gain: 0.11 },
    drums: 'minimal',
    drumsGain: 0.8,
    pad: false,
  },
  fortress: {
    bpm: 158,
    lead: { shift: 0, cutoff: 3000, gain: 0.11 },
    bass: { cutoff: 550, gain: 0.15 },
    drums: 'double',
    drumsGain: 1,
    pad: true,
  },
  romance: {
    bpm: 72,
    lead: { shift: 0, cutoff: 1900, gain: 0.13, wave: 'triangle' },
    bass: { cutoff: 320, gain: 0.09 },
    drums: 'none',
    drumsGain: 0.8,
    pad: true,
    melody: 'romance',
    chords: 'romance',
  },
});

const DRUM_PATTERNS = Object.freeze({
  full: {
    kick: [0, 2],
    snare: [1, 3],
    hat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
  },
  light: {
    kick: [0, 2],
    snare: [1, 3],
    hat: [0.5, 1.5, 2.5, 3.5],
  },
  minimal: {
    kick: [0, 2],
    snare: [],
    hat: [0.5, 1.5, 2.5, 3.5],
  },
  double: {
    kick: [0, 1.5, 2, 3.5],
    snare: [1, 3],
    hat: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75],
  },
  none: {
    kick: [],
    snare: [],
    hat: [],
  },
});

// Melodia de 8 compassos (seção A) — original, com escala de sabor árabe (Lá
// com 2ª menor, 6ª menor e 7ª maior) no espírito dos temas de fase do Aladdin.
const LEAD_A = Object.freeze([
  Object.freeze([[69, 1], [72, 0.5], [76, 0.5], [74, 0.5], [72, 0.5], [71, 0.5], [72, 0.5]]),
  Object.freeze([[76, 0.5], [79, 0.5], [81, 1], [76, 0.5], [74, 0.5], [72, 0.5], [71, 0.5]]),
  Object.freeze([[74, 1], [77, 0.5], [81, 0.5], [77, 0.5], [76, 0.5], [74, 0.5], [72, 0.5]]),
  Object.freeze([[80, 0.5], [83, 0.5], [80, 0.5], [76, 0.5], [71, 0.5], [74, 0.5], [76, 1]]),
  Object.freeze([[76, 0.5], [79, 0.5], [81, 0.5], [83, 0.5], [81, 0.5], [79, 0.5], [76, 1]]),
  Object.freeze([[81, 0.5], [79, 0.5], [77, 0.5], [81, 0.5], [72, 0.5], [77, 0.5], [76, 1]]),
  Object.freeze([[77, 0.5], [81, 0.5], [86, 0.5], [81, 0.5], [77, 0.5], [74, 0.5], [72, 1]]),
  Object.freeze([[83, 0.5], [81, 0.5], [80, 0.5], [76, 0.5], [71, 0.5], [76, 1.5]]),
]);

// Seção B — variação da melodia em oitavas próximas do ápice.
const LEAD_B = Object.freeze([
  Object.freeze([[81, 0.5], [85, 0.5], [83, 0.5], [81, 0.5], [79, 0.5], [77, 0.5], [76, 1]]),
  Object.freeze([[77, 1], [81, 0.5], [85, 0.5], [83, 0.5], [81, 0.5], [79, 1]]),
  Object.freeze([[86, 0.5], [81, 0.5], [77, 0.5], [74, 0.5], [77, 0.5], [81, 0.5], [86, 1]]),
  Object.freeze([[80, 0.5], [83, 0.5], [81, 0.5], [80, 0.5], [76, 0.5], [71, 0.5], [74, 1]]),
  Object.freeze([[76, 0.5], [79, 0.5], [81, 0.5], [85, 0.5], [83, 0.5], [81, 0.5], [79, 1]]),
  Object.freeze([[81, 0.5], [79, 0.5], [76, 0.5], [74, 0.5], [72, 0.5], [76, 0.5], [79, 1]]),
  Object.freeze([[81, 0.5], [77, 0.5], [74, 0.5], [77, 0.5], [81, 0.5], [85, 0.5], [83, 1]]),
  Object.freeze([[80, 0.5], [83, 0.5], [80, 0.5], [83, 0.5], [81, 1], [80, 0.5], [76, 0.5]]),
]);

const BASS_PATTERN_MINOR = Object.freeze([0, 12, 7, 0, 12, 7, 0, 7]);
const BASS_PATTERN_SEVENTH = Object.freeze([0, 12, 4, 0, 12, 4, 0, 7]);

// Melodia de 8 compassos (seção A) do tema romântico — Dó maior, notas longas
// e leves, no espírito de uma valsa de amor ao salvar André.
const ROMANCE_LEAD_A = Object.freeze([
  Object.freeze([[72, 1], [69, 0.5], [67, 0.5], [64, 1], [67, 0.5], [69, 0.5]]),
  Object.freeze([[72, 0.5], [74, 0.5], [72, 0.5], [69, 1], [67, 0.5], [69, 1]]),
  Object.freeze([[72, 1], [74, 0.5], [76, 0.5], [77, 1], [76, 0.5], [74, 0.5]]),
  Object.freeze([[74, 1], [76, 0.5], [74, 0.5], [71, 1], [69, 0.5], [67, 0.5]]),
  Object.freeze([[72, 1], [76, 0.5], [74, 0.5], [72, 1], [69, 0.5], [72, 0.5]]),
  Object.freeze([[77, 1], [76, 0.5], [74, 0.5], [72, 1], [74, 0.5], [72, 0.5]]),
  Object.freeze([[76, 1], [74, 0.5], [72, 0.5], [69, 1], [67, 0.5], [69, 0.5]]),
  Object.freeze([[71, 1], [72, 0.5], [71, 0.5], [69, 1], [67, 0.5], [69, 1]]),
]);

// Seção B — variação em oitavas próximas do ápice, retornando ao acalanto.
const ROMANCE_LEAD_B = Object.freeze([
  Object.freeze([[76, 1], [79, 0.5], [77, 0.5], [76, 1], [74, 0.5], [72, 0.5]]),
  Object.freeze([[77, 1], [74, 0.5], [72, 0.5], [74, 1], [72, 0.5], [69, 0.5]]),
  Object.freeze([[76, 1], [74, 0.5], [72, 0.5], [69, 1], [72, 0.5], [74, 0.5]]),
  Object.freeze([[74, 1], [76, 0.5], [74, 0.5], [71, 1], [69, 0.5], [71, 0.5]]),
  Object.freeze([[76, 1], [81, 0.5], [79, 0.5], [76, 1], [74, 0.5], [76, 0.5]]),
  Object.freeze([[77, 1], [76, 0.5], [74, 0.5], [72, 1], [74, 0.5], [77, 0.5]]),
  Object.freeze([[76, 1], [74, 0.5], [72, 0.5], [69, 1], [72, 0.5], [74, 0.5]]),
  Object.freeze([[71, 1], [69, 0.5], [67, 0.5], [64, 1], [67, 0.5], [69, 1]]),
]);

// 16 compassos do tema romântico: C C F G | C F Am G | C F Am G | C F Am G.
const CHORD_BARS_ROMANCE = Object.freeze([
  Object.freeze({ root: 48, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([60, 64, 67]) }),
  Object.freeze({ root: 48, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([60, 64, 67]) }),
  Object.freeze({ root: 53, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([65, 69, 72]) }),
  Object.freeze({ root: 43, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([59, 62, 67]) }),
  Object.freeze({ root: 48, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([60, 64, 67]) }),
  Object.freeze({ root: 53, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([65, 69, 72]) }),
  Object.freeze({ root: 45, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([57, 60, 64]) }),
  Object.freeze({ root: 43, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([59, 62, 67]) }),
  Object.freeze({ root: 48, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([60, 64, 67]) }),
  Object.freeze({ root: 53, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([65, 69, 72]) }),
  Object.freeze({ root: 45, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([57, 60, 64]) }),
  Object.freeze({ root: 43, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([59, 62, 67]) }),
  Object.freeze({ root: 48, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([60, 64, 67]) }),
  Object.freeze({ root: 53, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([65, 69, 72]) }),
  Object.freeze({ root: 45, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([57, 60, 64]) }),
  Object.freeze({ root: 43, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([59, 62, 67]) }),
]);

// 16 compassos: Am Am Dm E7 | Am F Dm E7 | F F Dm E7 | Am Am F E7.
const CHORD_BARS = Object.freeze([
  Object.freeze({ root: 45, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([57, 60, 64]) }),
  Object.freeze({ root: 45, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([57, 60, 64]) }),
  Object.freeze({ root: 50, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([62, 65, 69]) }),
  Object.freeze({ root: 52, bassPattern: BASS_PATTERN_SEVENTH, pad: Object.freeze([64, 68, 71]) }),
  Object.freeze({ root: 45, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([57, 60, 64]) }),
  Object.freeze({ root: 53, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([65, 69, 72]) }),
  Object.freeze({ root: 50, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([62, 65, 69]) }),
  Object.freeze({ root: 52, bassPattern: BASS_PATTERN_SEVENTH, pad: Object.freeze([64, 68, 71]) }),
  Object.freeze({ root: 53, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([65, 69, 72]) }),
  Object.freeze({ root: 53, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([65, 69, 72]) }),
  Object.freeze({ root: 50, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([62, 65, 69]) }),
  Object.freeze({ root: 52, bassPattern: BASS_PATTERN_SEVENTH, pad: Object.freeze([64, 68, 71]) }),
  Object.freeze({ root: 45, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([57, 60, 64]) }),
  Object.freeze({ root: 45, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([57, 60, 64]) }),
  Object.freeze({ root: 53, bassPattern: BASS_PATTERN_MINOR, pad: Object.freeze([65, 69, 72]) }),
  Object.freeze({ root: 52, bassPattern: BASS_PATTERN_SEVENTH, pad: Object.freeze([64, 68, 71]) }),
]);

const MUSIC_LOOKAHEAD = 0.18;
const MUSIC_TICK_MS = 25;

function midiToFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function buildMusicTrack(themeKey) {
  const theme = MUSIC_THEMES[themeKey] || MUSIC_THEMES.forest;
  const beat = 60 / theme.bpm;
  const events = [];
  let barTime = 0;

  for (let bar = 0; bar < CHORD_BARS.length; bar += 1) {
    const chord = theme.chords === 'romance' ? CHORD_BARS_ROMANCE[bar] : CHORD_BARS[bar];
    const lead = theme.melody === 'romance'
      ? (bar < 8 ? ROMANCE_LEAD_A[bar] : ROMANCE_LEAD_B[bar - 8])
      : (bar < 8 ? LEAD_A[bar] : LEAD_B[bar - 8]);
    let noteTime = barTime;

    for (const [midi, dur] of lead) {
      events.push({
        time: noteTime,
        type: 'lead',
        midi: midi + theme.lead.shift,
        dur: dur * beat,
      });
      noteTime += dur * beat;
    }

    chord.bassPattern.forEach((offset, index) => {
      events.push({
        time: barTime + index * beat * 0.5,
        type: 'bass',
        midi: chord.root + offset,
        dur: beat * 0.45,
      });
    });

    const pattern = DRUM_PATTERNS[theme.drums];
    for (const drum of ['kick', 'snare', 'hat']) {
      for (const pos of pattern[drum]) {
        events.push({ time: barTime + pos * beat, type: drum });
      }
    }

    if (theme.pad) {
      events.push({ time: barTime, type: 'pad', midis: chord.pad, dur: beat * 4 });
    }

    barTime += beat * 4;
  }

  events.sort((a, b) => a.time - b.time);

  return { theme: themeKey, events, loopDuration: barTime };
}

export class SoundManager {
  constructor() {
    this.enabled = true;
    this.context = null;
    this.musicGain = null;
    this.noiseBuffer = null;
    this.musicTrack = null;
  }

  ensureContext() {
    if (this.context) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new AudioContext();
    this.musicGain = this.context.createGain();
    this.musicGain.gain.value = 0.9;
    this.musicGain.connect(this.context.destination);
  }

  ensureNoiseBuffer() {
    if (this.noiseBuffer) return;
    const length = Math.floor(this.context.sampleRate);
    const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
    this.noiseBuffer = buffer;
  }

  resumeContext() {
    if (this.context?.state === 'suspended') this.context.resume();
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.ensureContext();
      this.resumeContext();
      this.playTone(520, 0.08, 'sine');
      if (this.musicTrack) this.startMusicLoop();
    } else if (this.musicTrack) {
      this.stopMusicLoop();
    }
    return this.enabled;
  }

  playTone(frequency, duration, type) {
    if (!this.enabled) return;
    this.ensureContext();
    this.resumeContext();

    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.06, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start();
    oscillator.stop(this.context.currentTime + duration);
  }

  playVictory() {
    this.playTone(523, 0.12, 'sine');
    window.setTimeout(() => this.playTone(659, 0.13, 'sine'), 130);
    window.setTimeout(() => this.playTone(784, 0.22, 'sine'), 270);
  }

  startMusic(themeKey) {
    this.ensureContext();
    this.stopMusicLoop();
    this.musicTrack = {
      ...buildMusicTrack(themeKey),
      loopStart: 0,
      cursor: 0,
      paused: false,
      timer: null,
    };
    if (this.enabled) this.startMusicLoop();
  }

  stopMusic() {
    this.stopMusicLoop();
    this.musicTrack = null;
  }

  setPaused(paused) {
    if (!this.musicTrack) return;
    this.musicTrack.paused = paused;
    if (paused) this.stopMusicLoop();
    else if (this.enabled) this.startMusicLoop();
  }

  startMusicLoop() {
    if (!this.musicTrack || this.musicTrack.paused) return;
    this.stopMusicLoop();
    this.resumeContext();
    this.musicTrack.cursor = 0;
    this.musicTrack.loopStart = this.context.currentTime + 0.08;
    this.musicTrack.timer = window.setInterval(() => this.scheduleMusic(), MUSIC_TICK_MS);
  }

  stopMusicLoop() {
    if (!this.musicTrack?.timer) return;
    window.clearInterval(this.musicTrack.timer);
    this.musicTrack.timer = null;
  }

  scheduleMusic() {
    const track = this.musicTrack;
    if (!track || track.paused || !this.enabled) return;
    const horizon = this.context.currentTime + MUSIC_LOOKAHEAD;

    while (track.cursor < track.events.length) {
      const event = track.events[track.cursor];
      const time = track.loopStart + event.time;
      if (time >= horizon) break;
      this.playMusicEvent(event, time);
      track.cursor += 1;
      if (track.cursor >= track.events.length) {
        track.cursor = 0;
        track.loopStart += track.loopDuration;
      }
    }
  }

  playMusicEvent(event, time) {
    switch (event.type) {
      case 'lead': this.playLead(event, time); break;
      case 'bass': this.playBass(event, time); break;
      case 'pad': this.playPad(event, time); break;
      case 'kick': this.playKick(time); break;
      case 'snare': this.playSnare(time); break;
      case 'hat': this.playHat(time); break;
    }
  }

  playLead(event, time) {
    const theme = MUSIC_THEMES[this.musicTrack.theme];
    const osc = this.context.createOscillator();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    const vibrato = this.context.createOscillator();
    const vibratoDepth = this.context.createGain();

    osc.type = theme.lead.wave || 'square';
    osc.frequency.value = midiToFrequency(event.midi);
    filter.type = 'lowpass';
    filter.frequency.value = theme.lead.cutoff;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(theme.lead.gain, time + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + event.dur);

    vibrato.frequency.value = 6;
    vibratoDepth.gain.value = 14;
    vibrato.connect(vibratoDepth).connect(osc.detune);
    osc.connect(filter).connect(gain).connect(this.musicGain);
    osc.start(time);
    vibrato.start(time);
    osc.stop(time + event.dur + 0.05);
    vibrato.stop(time + event.dur + 0.05);
  }

  playBass(event, time) {
    const theme = MUSIC_THEMES[this.musicTrack.theme];
    const osc = this.context.createOscillator();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();

    osc.type = 'triangle';
    osc.frequency.value = midiToFrequency(event.midi);
    filter.type = 'lowpass';
    filter.frequency.value = theme.bass.cutoff;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(theme.bass.gain, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + event.dur);

    osc.connect(filter).connect(gain).connect(this.musicGain);
    osc.start(time);
    osc.stop(time + event.dur + 0.05);
  }

  playPad(event, time) {
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();

    filter.type = 'lowpass';
    filter.frequency.value = 1400;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.045, time + 0.35);
    gain.gain.setValueAtTime(0.045, time + event.dur - 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + event.dur);
    filter.connect(gain).connect(this.musicGain);

    for (const midi of event.midis) {
      const osc = this.context.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = midiToFrequency(midi);
      osc.connect(filter);
      osc.start(time);
      osc.stop(time + event.dur + 0.1);
    }
  }

  playKick(time) {
    const theme = MUSIC_THEMES[this.musicTrack.theme];
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);
    gain.gain.setValueAtTime(0.45 * theme.drumsGain, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

    osc.connect(gain).connect(this.musicGain);
    osc.start(time);
    osc.stop(time + 0.16);
  }

  playSnare(time) {
    const theme = MUSIC_THEMES[this.musicTrack.theme];
    this.ensureNoiseBuffer();
    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();

    source.buffer = this.noiseBuffer;
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    gain.gain.setValueAtTime(0.22 * theme.drumsGain, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    source.connect(filter).connect(gain).connect(this.musicGain);
    source.start(time);
    source.stop(time + 0.14);
  }

  playHat(time) {
    const theme = MUSIC_THEMES[this.musicTrack.theme];
    this.ensureNoiseBuffer();
    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();

    source.buffer = this.noiseBuffer;
    filter.type = 'highpass';
    filter.frequency.value = 6500;
    gain.gain.setValueAtTime(0.12 * theme.drumsGain, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035);

    source.connect(filter).connect(gain).connect(this.musicGain);
    source.start(time);
    source.stop(time + 0.05);
  }
}
