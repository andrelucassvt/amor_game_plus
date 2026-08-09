import { ASSET_MANIFEST } from './config.js';
import { SoundManager } from './core/audio.js';
import { loadAssets } from './core/assets.js';
import { InputController } from './core/input.js';
import { Game } from './game.js';
import { createLevel } from './level.js';
import { Renderer } from './renderer.js';
import { GameUI } from './ui.js';

async function bootstrap() {
  const canvas = document.querySelector('#game');
  const ui = new GameUI();
  const audio = new SoundManager();
  let game = null;

  ui.setLoading();

  try {
    const assets = await loadAssets(ASSET_MANIFEST);
    const input = new InputController(canvas, () => game?.togglePause());
    const renderer = new Renderer(canvas, assets);

    game = new Game({
      level: createLevel(),
      input,
      audio,
      ui,
    });

    ui.bind({
      onStart: () => game.reset(),
      onRestart: () => game.reset(),
      onPause: () => game.togglePause(),
      onSound: () => ui.setSound(audio.toggle()),
    });
    ui.setReady();

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
