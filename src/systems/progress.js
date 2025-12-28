
const KEY = 'eco_progress_v1';
let sessionCompleted = {}; // resets on refresh
let sessionUnlockedIdx = 0; // resets on refresh

export function loadProgress() {
  // Unlocks/completions are session-only now
  return { unlockedIdx: sessionUnlockedIdx, completed: sessionCompleted };
}

export function saveProgress(p) {
  sessionUnlockedIdx = Math.max(0, Math.min(4, p.unlockedIdx ?? 0));
}

export function unlockUpTo(idx) {
  const p = loadProgress();
  if (idx > p.unlockedIdx) {
    p.unlockedIdx = Math.max(0, Math.min(4, idx));
    saveProgress(p);
  }
  return p;
}

export function markCompleted(levelId) {
  sessionCompleted[levelId] = true;
  return loadProgress();
}
