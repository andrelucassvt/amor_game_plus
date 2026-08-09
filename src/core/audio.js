export class SoundManager {
  constructor() {
    this.enabled = false;
    this.context = null;
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) this.playTone(520, 0.08, 'sine');
    return this.enabled;
  }

  playTone(frequency, duration, type) {
    if (!this.enabled) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context ??= new AudioContext();

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
}
