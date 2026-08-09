import { CAMPAIGN, SPRITE_FRAMES } from './config.js';

const STATUS_LABELS = {
  locked: 'Bloqueado',
  available: 'Disponível',
  completed: 'Concluído',
};

export class GameUI {
  constructor(root = document) {
    this.assets = null;
    this.elements = {
      mainMenu: root.querySelector('#mainMenuCard'),
      levelSelect: root.querySelector('#levelSelectCard'),
      play: root.querySelector('#playButton'),
      brand: root.querySelector('#brand'),
      back: root.querySelector('#backButton'),
      ending: root.querySelector('#endingCard'),
      endingReturn: root.querySelector('#endingReturnButton'),
      pause: root.querySelector('#pauseButton'),
      sound: root.querySelector('#soundButton'),
      message: root.querySelector('#message'),
      loadError: root.querySelector('#loadError'),
      berries: root.querySelector('#berryCount'),
      berryTotal: root.querySelector('#berryTotal'),
      lives: root.querySelector('#lifeCount'),
      levelNumber: root.querySelector('#levelNumber'),
      levelName: root.querySelector('#levelName'),
      endBerries: root.querySelector('#finishBerries'),
      endTime: root.querySelector('#finishTime'),
      andreCountdown: root.querySelector('#andreCountdown'),
      andrePreview: root.querySelector('#andrePreview'),
      levelCards: [1, 2, 3, 4].map(number => root.querySelector(`#levelCard${number}`)),
    };
    this.messageTimer = null;
    this.andreTimer = null;
    this.andreFrame = 0;
    this.completedLevel = 0;
  }

  setAssets(assets) {
    this.assets = assets;
  }

  setLoading() {
    this.elements.play.disabled = true;
    this.elements.play.textContent = 'Preparando a aventura…';
  }

  setReady() {
    this.elements.play.disabled = false;
    this.elements.play.innerHTML = 'Escolher fase <span>→</span>';
  }

  showLoadError() {
    this.elements.play.disabled = true;
    this.elements.play.textContent = 'Não foi possível carregar os sprites';
    this.elements.loadError.classList.remove('hidden');
    this.showMainMenu();
  }

  bind({ onPlay, onHome, onBack, onSelectLevel, onReturnEnding, onPause, onSound }) {
    this.elements.play.addEventListener('click', onPlay);
    this.elements.brand.addEventListener('click', event => {
      event.preventDefault();
      onHome();
    });
    this.elements.back.addEventListener('click', onBack);
    this.elements.endingReturn.addEventListener('click', onReturnEnding);
    this.elements.pause.addEventListener('click', onPause);
    this.elements.sound.addEventListener('click', onSound);
    for (const card of this.elements.levelCards) {
      card.addEventListener('click', () => onSelectLevel(Number(card.dataset.level)));
    }
  }

  showMainMenu() {
    this.hideOverlays();
    this.stopAndrePreview();
    this.elements.mainMenu.classList.remove('hidden');
    this.elements.pause.disabled = true;
  }

  showLevelSelect() {
    this.hideOverlays();
    this.updateLevelCards(this.completedLevel);
    this.startAndrePreview();
    this.elements.levelSelect.classList.remove('hidden');
    this.elements.pause.disabled = true;
  }

  showGame() {
    this.hideOverlays();
    this.stopAndrePreview();
    this.elements.pause.disabled = false;
  }

  hideOverlays() {
    this.elements.mainMenu.classList.add('hidden');
    this.elements.levelSelect.classList.add('hidden');
    this.elements.ending.classList.add('hidden');
  }

  updateLevelCards(completedLevel) {
    this.completedLevel = completedLevel;
    for (const card of this.elements.levelCards) {
      const number = Number(card.dataset.level);
      const selectable = number <= completedLevel + 1;
      const completed = number <= completedLevel;
      const state = completed ? 'completed' : selectable ? 'available' : 'locked';

      card.disabled = !selectable;
      card.classList.toggle('locked', !selectable);
      card.classList.toggle('completed', completed);
      card.querySelector('.level-status').textContent = STATUS_LABELS[state];
      card.setAttribute(
        'aria-label',
        `${state === 'locked' ? 'Bloqueada: ' : ''}fase ${number} ${CAMPAIGN.levels[number - 1].name}`,
      );
    }

    const remaining = CAMPAIGN.totalLevels - completedLevel;
    this.elements.andreCountdown.textContent = completedLevel >= CAMPAIGN.totalLevels
      ? 'André foi salvo ♥'
      : remaining === 1
        ? 'Falta 1 fase para salvar André'
        : `Faltam ${remaining} fases para salvar André`;
  }

  setLevelMeta(level) {
    this.elements.levelNumber.textContent = `FASE ${level.metadata.number}`;
    this.elements.levelName.textContent = level.metadata.name;
    this.elements.berryTotal.textContent = String(level.berries.length).padStart(2, '0');
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

  startAndrePreview() {
    this.stopAndrePreview();
    if (!this.assets?.andre) return;
    this.drawAndreFrame(0);
    this.andreTimer = window.setInterval(() => {
      this.andreFrame = (this.andreFrame + 1) % SPRITE_FRAMES.andre.captive.length;
      this.drawAndreFrame(this.andreFrame);
    }, 380);
  }

  stopAndrePreview() {
    if (!this.andreTimer) return;
    window.clearInterval(this.andreTimer);
    this.andreTimer = null;
  }

  drawAndreFrame(index) {
    const canvas = this.elements.andrePreview;
    const ctx = canvas.getContext('2d');
    const [sx, sy, sw, sh] = SPRITE_FRAMES.andre.captive[index];
    const targetHeight = canvas.height - 20;
    const targetWidth = targetHeight * (sw / sh);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      this.assets.andre,
      sx, sy, sw, sh,
      (canvas.width - targetWidth) / 2,
      canvas.height - targetHeight,
      targetWidth,
      targetHeight,
    );
  }
}
