import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SoundManager } from '../src/core/audio.js';

const THEMES = ['forest', 'vale', 'night', 'fortress'];
const BPM = { forest: 152, vale: 152, night: 116, fortress: 158 };
const LOOKAHEAD = 0.18;

class MockAudioContext {
  constructor() {
    this.currentTime = 0;
    this.starts = [];
    this.sampleRate = 8000;
    this.state = 'running';
    this.destination = {};
    this.resume = () => {};
    this.createGain = () => {
      const node = {
        gain: {
          value: 0,
          setValueAtTime() {},
          linearRampToValueAtTime() {},
          exponentialRampToValueAtTime() {},
        },
        connect: () => node,
      };
      return node;
    };
    this.createOscillator = () => {
      const node = {
        type: 'sine',
        frequency: {
          value: 440,
          setValueAtTime() {},
          exponentialRampToValueAtTime() {},
        },
        detune: {},
        connect: () => node,
        start: time => this.starts.push(time),
        stop() {},
      };
      return node;
    };
    this.createBiquadFilter = () => {
      const node = {
        type: 'lowpass',
        frequency: { value: 1000 },
        connect: () => node,
      };
      return node;
    };
    this.createBuffer = () => ({ getChannelData: () => new Float32Array(8000) });
    this.createBufferSource = () => {
      const node = {
        buffer: null,
        connect: () => node,
        start: time => this.starts.push(time),
        stop() {},
      };
      return node;
    };
  }
}

function setupSoundManager() {
  globalThis.window = { AudioContext: MockAudioContext, setInterval, clearInterval };
  const sound = new SoundManager();
  sound.enabled = true;
  sound.ensureContext();
  return sound;
}

test('cada tema gera um loop completo de 16 compassos com eventos ordenados', t => {
  for (const theme of THEMES) {
    const sound = setupSoundManager();
    t.after(() => sound.stopMusic());
    sound.startMusic(theme);
    const track = sound.musicTrack;

    assert.ok(track.events.length > 100, `${theme} com poucos eventos`);
    assert.ok(Math.abs(track.loopDuration - (60 / BPM[theme]) * 64) < 1e-9, `${theme} com duração errada`);
    assert.equal(track.events.some(event => event.type === 'pad'), theme === 'fortress');

    let lastTime = -1;
    for (const event of track.events) {
      assert.ok(event.time >= lastTime, `${theme} com eventos fora de ordem`);
      lastTime = event.time;
    }

    sound.stopMusic();
    assert.equal(sound.musicTrack, null);
  }
});

test('música só agenda quando o som está habilitado', t => {
  const sound = setupSoundManager();
  t.after(() => sound.stopMusic());
  sound.enabled = false;
  sound.startMusic('forest');
  assert.ok(sound.musicTrack);
  assert.equal(sound.musicTrack.timer, null);

  sound.toggle();
  assert.equal(sound.enabled, true);
  assert.ok(sound.musicTrack.timer);

  sound.toggle();
  assert.equal(sound.enabled, false);
  assert.equal(sound.musicTrack.timer, null);
});

test('scheduler agenda eventos dentro do horizonte e envolve no fim do loop', t => {
  const sound = setupSoundManager();
  t.after(() => sound.stopMusic());
  sound.startMusic('forest');
  const track = sound.musicTrack;
  track.cursor = 0;
  track.loopStart = 10;
  sound.context.currentTime = 10.2;

  sound.scheduleMusic();
  const firstWave = sound.context.starts.length;
  assert.ok(firstWave > 0, 'nenhum evento agendado no primeiro tick');
  assert.ok(track.cursor > 0 && track.cursor < track.events.length);

  const totalEvents = track.events.length;
  sound.context.currentTime = 10 + track.loopDuration + 1;
  sound.scheduleMusic();
  assert.ok(sound.context.starts.length > firstWave, 'segundo tick não agendou nada');
  assert.ok(track.loopStart > 10, 'loop não envolveu');
  assert.ok(track.cursor < totalEvents, 'cursor estourou o vetor de eventos');

  const horizon = sound.context.currentTime + LOOKAHEAD + 0.001;
  assert.ok(
    sound.context.starts.every(time => time <= horizon),
    'evento agendado além do horizonte',
  );
});

test('tema romântico é lento, sem bateria e com pad sustentado', t => {
  const sound = setupSoundManager();
  t.after(() => sound.stopMusic());
  sound.startMusic('romance');
  const track = sound.musicTrack;

  assert.ok(Math.abs(track.loopDuration - (60 / 72) * 64) < 1e-9);
  assert.ok(track.events.length > 100);
  assert.equal(track.events.some(event => event.type === 'pad'), true);
  assert.equal(track.events.some(event => event.type === 'kick'), false);
  assert.equal(track.events.some(event => event.type === 'snare'), false);
  assert.equal(track.events.some(event => event.type === 'hat'), false);

  let lastTime = -1;
  for (const event of track.events) {
    assert.ok(event.time >= lastTime, 'eventos fora de ordem');
    lastTime = event.time;
  }
});

test('pausa interrompe o agendamento e retomada reinicia do início', t => {
  const sound = setupSoundManager();
  t.after(() => sound.stopMusic());
  sound.startMusic('night');
  assert.ok(sound.musicTrack.timer);

  sound.setPaused(true);
  assert.equal(sound.musicTrack.timer, null);
  assert.equal(sound.musicTrack.paused, true);

  sound.setPaused(false);
  assert.ok(sound.musicTrack.timer);
  assert.equal(sound.musicTrack.cursor, 0);
});
