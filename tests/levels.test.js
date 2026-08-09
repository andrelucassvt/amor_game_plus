import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createLevel } from '../src/level.js';

const THEMES = ['forest', 'vale', 'night', 'fortress'];

test('existem quatro fases com metadados coerentes e estado completo', () => {
  for (let number = 1; number <= 4; number += 1) {
    const level = createLevel(number);
    assert.equal(level.metadata.number, number);
    assert.ok(level.metadata.name.length > 0, `fase ${number} sem nome`);
    assert.ok(level.metadata.chapter.length > 0, `fase ${number} sem capítulo`);
    assert.ok(level.metadata.description.length > 0, `fase ${number} sem descrição`);
    assert.ok(THEMES.includes(level.metadata.theme), `tema inválido na fase ${number}`);
    assert.equal(level.theme, level.metadata.theme);
    assert.ok(level.world.width > 0);
    assert.ok(level.spawn.x > 0 && level.spawn.y > 0);
    assert.ok(level.platforms.length > 0);
    assert.equal(level.berries.length, 8);
    assert.ok(level.spikes.length > 0);
    assert.ok(level.movingObstacles.length > 0);
    assert.ok(level.checkpoints.length > 0);
    assert.ok(level.goal.x > 0 && level.goal.y > 0);
    assert.ok(level.goal.type === 'exit' || level.goal.type === 'rescue');
  }
});

test('André existe somente no objetivo da fase 4', () => {
  for (let number = 1; number <= 3; number += 1) {
    assert.equal(createLevel(number).goal.type, 'exit');
  }
  assert.equal(createLevel(4).goal.type, 'rescue');
});

test('os quatro mapas têm layouts e mundos distintos', () => {
  const platforms = [1, 2, 3, 4].map(number => JSON.stringify(createLevel(number).platforms));
  for (let i = 0; i < platforms.length; i += 1) {
    for (let j = i + 1; j < platforms.length; j += 1) {
      assert.notEqual(platforms[i], platforms[j], `plataformas iguais entre fases ${i + 1} e ${j + 1}`);
    }
  }
  const widths = [1, 2, 3, 4].map(number => createLevel(number).world.width);
  assert.equal(new Set(widths).size, 4);
});

test('mutações no nível não vazam para criações posteriores', () => {
  const first = createLevel(2);
  first.platforms[0][0] = -999;
  first.berries[0].taken = true;
  first.checkpoints[0].active = true;
  first.movingObstacles[0].x = 1234;
  first.goal.x = 1;
  first.spawn.x = 1;
  first.metadata.name = 'mutado';

  const second = createLevel(2);
  assert.notEqual(second.platforms[0][0], -999);
  assert.equal(second.berries[0].taken, false);
  assert.equal(second.checkpoints[0].active, false);
  assert.notEqual(second.movingObstacles[0].x, 1234);
  assert.notEqual(second.goal.x, 1);
  assert.notEqual(second.spawn.x, 1);
  assert.equal(second.metadata.name, 'O Primeiro Beijo');
});

test('duas criações da mesma fase são independentes entre si', () => {
  const first = createLevel(3);
  const second = createLevel(3);
  first.berries[2].taken = true;
  first.movingObstacles[1].x = 7;
  first.checkpoints[0].active = true;
  assert.equal(second.berries[2].taken, false);
  assert.notEqual(second.movingObstacles[1].x, 7);
  assert.equal(second.checkpoints[0].active, false);
});

test('createLevel rejeita fases inexistentes', () => {
  assert.throws(() => createLevel(0));
  assert.throws(() => createLevel(5));
});
