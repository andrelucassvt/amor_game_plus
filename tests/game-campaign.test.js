import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ENDING_SEQUENCE, PLAYER_INITIAL, VIEWPORT } from '../src/config.js';
import { Game } from '../src/game.js';
import { createLevel } from '../src/level.js';

class FakeInput {
  consumeJump() {
    return false;
  }

  get horizontalAxis() {
    return 0;
  }
}

class FakeAudio {
  constructor() {
    this.victoryCalls = 0;
  }

  playTone() {}

  playVictory() {
    this.victoryCalls += 1;
  }
}

class FakeUI {
  constructor() {
    this.hudUpdates = 0;
    this.announces = [];
    this.endingsShown = 0;
    this.hiddenEndings = 0;
    this.levelMeta = null;
  }

  setLevelMeta(level) {
    this.levelMeta = level;
  }

  updateHud() {
    this.hudUpdates += 1;
  }

  announce(text) {
    this.announces.push(text);
  }

  hideEnding() {
    this.hiddenEndings += 1;
  }

  setPaused() {}

  showEnding() {
    this.endingsShown += 1;
  }
}

function createGame() {
  const input = new FakeInput();
  const audio = new FakeAudio();
  const ui = new FakeUI();
  const results = [];
  const game = new Game({ input, audio, ui, onFinish: result => results.push(result) });
  return { game, ui, audio, results };
}

function reachGoal(game) {
  game.player.x = game.level.goal.x + 50;
  game.player.y = 500;
}

test('troca de fase restaura jogador, coletáveis, checkpoints e câmera', () => {
  const { game, ui } = createGame();

  const first = createLevel(1);
  game.startLevel(first);
  first.berries[0].taken = true;
  first.checkpoints[0].active = true;
  game.player.x = 3000;
  game.player.y = 400;
  game.player.berries = 3;
  game.player.lives = 1;
  game.cameraX = 1200;
  game.elapsed = 25;

  const second = createLevel(2);
  game.startLevel(second);

  assert.equal(game.level, second);
  assert.equal(game.player.x, second.spawn.x);
  assert.equal(game.player.y, second.spawn.y);
  assert.equal(game.player.berries, 0);
  assert.equal(game.player.lives, PLAYER_INITIAL.lives);
  assert.equal(game.cameraX, 0);
  assert.equal(game.elapsed, 0);
  assert.equal(game.won, false);
  assert.equal(game.started, true);
  assert.equal(second.berries.every(berry => !berry.taken), true);
  assert.equal(second.checkpoints.every(checkpoint => !checkpoint.active), true);
  assert.equal(ui.levelMeta, second);
});

test('concluir a fase emite exatamente uma conclusão com o resultado completo', () => {
  const { game, ui, audio, results } = createGame();
  const level = createLevel(4);
  game.startLevel(level);
  reachGoal(game);
  game.update(1 / 60);
  game.update(1 / 60);
  game.update(1 / 60);
  game.finish();

  assert.equal(results.length, 1);
  assert.equal(results[0].levelNumber, 4);
  assert.equal(results[0].goalType, 'rescue');
  assert.equal(results[0].berries, 0);
  assert.match(results[0].time, /^\d{2}:\d{2}$/);
  assert.equal(game.won, true);
  assert.equal(audio.victoryCalls, 1);
  assert.equal(ui.announces.length, 1);
});

test('saída das fases 1–3 encerra a partida sem a sequência de resgate', () => {
  const { game, ui, results } = createGame();
  game.startLevel(createLevel(1));
  reachGoal(game);
  game.update(1 / 60);

  assert.equal(results.length, 1);
  assert.equal(results[0].goalType, 'exit');

  game.update(ENDING_SEQUENCE.duration + 1);
  assert.equal(ui.endingsShown, 0);
});

test('fase de resgate exibe o encerramento uma única vez após a sequência', () => {
  const { game, ui, results } = createGame();
  game.startLevel(createLevel(4));
  reachGoal(game);
  game.update(1 / 60);
  assert.equal(results.length, 1);

  const steps = Math.ceil(ENDING_SEQUENCE.duration / (1 / 60)) + 5;
  for (let i = 0; i < steps; i += 1) {
    game.update(1 / 60);
  }

  assert.equal(ui.endingsShown, 1);
});

test('câmera respeita a largura do mundo do nível carregado', () => {
  const { game } = createGame();
  const level = createLevel(2);
  game.startLevel(level);
  game.player.x = level.world.width + 200;
  game.update(1 / 60);

  const maxCamera = level.world.width - VIEWPORT.width;
  assert.ok(game.cameraX <= maxCamera + 0.01);
});

test('stop desativa a partida sem apagar o nível carregado', () => {
  const { game } = createGame();
  game.startLevel(createLevel(1));
  game.stop();

  assert.equal(game.started, false);
  assert.ok(game.level);
});
