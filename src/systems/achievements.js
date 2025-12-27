
let unlocked = new Set();

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => t.classList.add('hidden'), 2500);
}

function unlock(id, msg) {
  if (unlocked.has(id)) return;
  unlocked.add(id);
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('locked');
    el.classList.add('unlocked');
  }
  showToast(msg);
}

export function updateAchievements(state) {
  if (state.trashCleaned >= 10) unlock('badge-ecohero', '🏅 Badge unlocked: Eco Hero!');
  if (state.treesPlanted >= 3) unlock('badge-trees', '🌳 Badge unlocked: Tree Guardian!');
  if (state.wildlifeShown) unlock('badge-wildlife', '🐦 Badge unlocked: Wildlife Restored!');
}

export function resetAchievements() {
  unlocked = new Set();
  const ids = ['badge-ecohero','badge-trees','badge-wildlife'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('locked');
      el.classList.remove('unlocked');
    }
  });
  const t = document.getElementById('toast');
  if (t) t.classList.add('hidden');
}
