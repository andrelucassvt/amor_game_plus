import { CAMPAIGN } from './config.js';

export function normalizeCompletedLevel(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  const integer = Math.floor(parsed);
  return Math.max(0, Math.min(CAMPAIGN.totalLevels, integer));
}

export function isLevelSelectable(completedLevel, levelNumber) {
  return levelNumber >= 1 && levelNumber <= normalizeCompletedLevel(completedLevel) + 1;
}

export function isLevelCompleted(completedLevel, levelNumber) {
  return levelNumber >= 1 && levelNumber <= normalizeCompletedLevel(completedLevel);
}

export function registerLevelCompletion(completedLevel, levelNumber) {
  return Math.max(normalizeCompletedLevel(completedLevel), normalizeCompletedLevel(levelNumber));
}

export function readCompletedLevel(storage, storageKey) {
  if (!storage || typeof storage.getItem !== 'function') return 0;
  try {
    return normalizeCompletedLevel(storage.getItem(storageKey));
  } catch {
    return 0;
  }
}

export function writeCompletedLevel(storage, storageKey, value) {
  if (!storage || typeof storage.setItem !== 'function') return false;
  try {
    storage.setItem(storageKey, String(normalizeCompletedLevel(value)));
    return true;
  } catch {
    return false;
  }
}
