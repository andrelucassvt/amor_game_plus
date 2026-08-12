import { ASSET_MANIFEST, CAMPAIGN } from './config.js';
import {
  isLevelSelectable,
  readCompletedLevel,
  registerLevelCompletion,
  writeCompletedLevel,
} from './campaign.js';
import { SoundManager } from './core/audio.js';
import { loadAssets } from './core/assets.js';
import { InputController } from './core/input.js';
import { Game } from './game.js';
import { createLevel } from './level.js';
import { Renderer } from './renderer.js';
import { GameUI } from './ui.js';

function createProgressStore() {
  try {
    return { storage: window.localStorage, available: true };
  } catch {
    return { storage: null, available: false };
  }
}

async function bootstrap() {
  const canvas = document.querySelector('#game');
  const touchControls = {
    left: document.querySelector('#touchLeft'),
    right: document.querySelector('#touchRight'),
    jump: document.querySelector('#touchJump'),
  };
  const ui = new GameUI();
  const audio = new SoundManager();
  const { storage } = createProgressStore();
  let game = null;
  const campaign = {
    completedLevel: readCompletedLevel(storage, CAMPAIGN.storageKey),
  };

  ui.setLoading();

  try {
    const assets = await loadAssets(ASSET_MANIFEST);
    const input = new InputController(canvas, () => game?.togglePause(), touchControls);
    const renderer = new Renderer(canvas, assets);
    ui.setAssets(assets);
    ui.updateLevelCards(campaign.completedLevel);

    game = new Game({
      input,
      audio,
      ui,
      onFinish: result => {
        const completed = registerLevelCompletion(campaign.completedLevel, result.levelNumber);
        if (completed !== campaign.completedLevel) {
          campaign.completedLevel = completed;
          writeCompletedLevel(storage, CAMPAIGN.storageKey, completed);
        }
        ui.updateLevelCards(campaign.completedLevel);
        if (result.goalType === 'exit') {
          game.stop();
          ui.showLevelSelect();
        }
      },
    });

    ui.bind({
      onPlay: () => ui.showLevelSelect(),
      onHome: () => {
        game.stop();
        ui.showMainMenu();
      },
      onBack: () => {
        game.stop();
        ui.showMainMenu();
      },
      onSelectLevel: levelNumber => {
        if (!isLevelSelectable(campaign.completedLevel, levelNumber)) return;
        ui.showGame();
        game.startLevel(createLevel(levelNumber));
      },
      onReturnEnding: () => {
        game.stop();
        ui.showLevelSelect();
      },
      onPause: () => game.togglePause(),
      onSound: () => ui.setSound(audio.toggle()),
    });
    ui.setReady();
    ui.showMainMenu();

    let lastFrame = 0;
    const loop = timestamp => {
      const dt = Math.min(0.033, (timestamp - lastFrame || 0) / 1000);
      lastFrame = timestamp;
      game.update(dt);
      renderer.draw(game);
      window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
  } catch (error) {
    console.error(error);
    ui.showLoadError();
  }
}

bootstrap();
