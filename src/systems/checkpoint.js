
const KEY = 'eco_checkpoint_v1';

export function saveCheckpoint(data) {
  // data: { levelId }
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

export function loadCheckpoint() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (!d?.levelId) return null;
    return d;
  } catch {
    return null;
  }
}

export function clearCheckpoint() {
  try { localStorage.removeItem(KEY); } catch {}
}
