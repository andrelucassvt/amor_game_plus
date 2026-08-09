import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isLevelCompleted,
  isLevelSelectable,
  normalizeCompletedLevel,
  readCompletedLevel,
  registerLevelCompletion,
  writeCompletedLevel,
} from '../src/campaign.js';

test('campanha começa com somente a fase 1 disponível', () => {
  assert.equal(isLevelSelectable(0, 1), true);
  assert.equal(isLevelSelectable(0, 2), false);
  assert.equal(isLevelSelectable(0, 3), false);
  assert.equal(isLevelSelectable(0, 4), false);
  assert.equal(isLevelCompleted(0, 1), false);
});

test('desbloqueio sequencial libera apenas a fase seguinte', () => {
  assert.equal(isLevelSelectable(2, 1), true);
  assert.equal(isLevelSelectable(2, 2), true);
  assert.equal(isLevelSelectable(2, 3), true);
  assert.equal(isLevelSelectable(2, 4), false);
});

test('concluir uma fase registra o maior nível concluído', () => {
  assert.equal(registerLevelCompletion(0, 1), 1);
  assert.equal(registerLevelCompletion(1, 4), 4);
  assert.equal(registerLevelCompletion(0, 4), 4);
});

test('repetir fase antiga não regride o progresso', () => {
  assert.equal(registerLevelCompletion(3, 1), 3);
  assert.equal(registerLevelCompletion(4, 2), 4);
});

test('concluir a fase 4 completa a campanha', () => {
  assert.equal(registerLevelCompletion(3, 4), 4);
  assert.equal(isLevelCompleted(4, 4), true);
  assert.equal(isLevelSelectable(4, 4), true);
  assert.equal(isLevelSelectable(4, 3), true);
});

test('normalização limita o progresso entre 0 e o total de fases', () => {
  assert.equal(normalizeCompletedLevel(-2), 0);
  assert.equal(normalizeCompletedLevel('2.9'), 2);
  assert.equal(normalizeCompletedLevel(undefined), 0);
  assert.equal(normalizeCompletedLevel(null), 0);
  assert.equal(normalizeCompletedLevel(99), 4);
});

test('valor persistido corrompido cai para 0', () => {
  const storage = { getItem: () => 'não-é-número', setItem() {} };
  assert.equal(readCompletedLevel(storage, 'k'), 0);
});

test('valor persistido acima do limite é normalizado', () => {
  const storage = { getItem: () => '99', setItem() {} };
  assert.equal(readCompletedLevel(storage, 'k'), 4);
});

test('storage indisponível mantém a campanha utilizável na sessão', () => {
  assert.equal(readCompletedLevel(null, 'k'), 0);
  const throwing = {
    getItem() { throw new Error('quota'); },
    setItem() { throw new Error('quota'); },
  };
  assert.equal(readCompletedLevel(throwing, 'k'), 0);
  assert.equal(writeCompletedLevel(throwing, 'k', 2), false);
  assert.equal(writeCompletedLevel(null, 'k', 2), false);
});

test('escrever persiste o valor normalizado e permite reler', () => {
  let stored = null;
  const storage = {
    getItem() { return stored; },
    setItem(key, value) { stored = value; },
  };
  assert.equal(writeCompletedLevel(storage, 'k', 3), true);
  assert.equal(readCompletedLevel(storage, 'k'), 3);
  assert.equal(writeCompletedLevel(storage, 'k', 9), true);
  assert.equal(readCompletedLevel(storage, 'k'), 4);
});
