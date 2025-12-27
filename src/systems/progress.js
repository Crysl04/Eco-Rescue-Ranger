
const KEY = 'eco_progress_v1';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { unlockedIdx: 0 }; // only Level 1
    const data = JSON.parse(raw);
    return { unlockedIdx: Math.max(0, Math.min(4, data.unlockedIdx ?? 0)) };
  } catch {
    return { unlockedIdx: 0 };
  }
}

export function saveProgress(p) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
}

export function unlockUpTo(idx) {
  const p = loadProgress();
  if (idx > p.unlockedIdx) {
    p.unlockedIdx = Math.max(0, Math.min(4, idx));
    saveProgress(p);
  }
  return p;
}
