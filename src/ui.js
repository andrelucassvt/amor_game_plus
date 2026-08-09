export class GameUI {
  constructor(root = document) {
    this.elements = {
      intro: root.querySelector('#introCard'),
      ending: root.querySelector('#endingCard'),
      start: root.querySelector('#startButton'),
      restart: root.querySelector('#restartButton'),
      pause: root.querySelector('#pauseButton'),
      sound: root.querySelector('#soundButton'),
      message: root.querySelector('#message'),
      berries: root.querySelector('#berryCount'),
      lives: root.querySelector('#lifeCount'),
      endBerries: root.querySelector('#finishBerries'),
      endTime: root.querySelector('#finishTime'),
    };
    this.messageTimer = null;
  }

  setLoading() {
    this.elements.start.disabled = true;
    this.elements.start.innerHTML = 'Preparando a fase…';
  }

  setReady() {
    this.elements.start.disabled = false;
    this.elements.start.innerHTML = 'Começar a aventura <span>→</span>';
  }

  showLoadError() {
    this.elements.start.disabled = true;
    this.elements.start.textContent = 'Não foi possível carregar os sprites';
  }

  bind({ onStart, onRestart, onPause, onSound }) {
    this.elements.start.addEventListener('click', () => {
      this.elements.intro.classList.add('hidden');
      onStart();
    });
    this.elements.restart.addEventListener('click', onRestart);
    this.elements.pause.addEventListener('click', onPause);
    this.elements.sound.addEventListener('click', onSound);
  }

  updateHud(player) {
    this.elements.berries.textContent = String(player.berries).padStart(2, '0');
    this.elements.lives.textContent = String(player.lives).padStart(2, '0');
  }

  announce(text) {
    this.elements.message.textContent = text;
    this.elements.message.classList.add('show');
    window.clearTimeout(this.messageTimer);
    this.messageTimer = window.setTimeout(
      () => this.elements.message.classList.remove('show'),
      1900,
    );
  }

  setPaused(paused) {
    this.elements.pause.textContent = paused ? '▶ Continuar' : 'Ⅱ Pausar';
  }

  setSound(enabled) {
    this.elements.sound.textContent = enabled ? '♫' : '♪';
  }

  hideEnding() {
    this.elements.ending.classList.add('hidden');
  }

  showEnding({ berries, time }) {
    this.elements.endBerries.textContent = String(berries).padStart(2, '0');
    this.elements.endTime.textContent = time;
    this.elements.ending.classList.remove('hidden');
  }
}
