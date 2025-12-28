import { LEVEL_ORDER, getLevelConfig } from './levels.js';
import { loadProgress } from './progress.js';

let onLoadLevel = null;
let current = 'park';

function hideOverlay() {
  const ov = document.getElementById('overlay');
  if (ov) ov.style.display = 'none';
}

function showOverlay() {
  const ov = document.getElementById('overlay');
  if (ov) ov.style.display = 'flex';
}

function highlightLevel(levelId) {
  document.querySelectorAll('.levelBtn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.level === levelId);
  });
}

function updateLevelButtons() {
  const progress = loadProgress();
  document.querySelectorAll('.levelBtn[data-idx]').forEach(btn => {
    const idx = parseInt(btn.dataset.idx);
    const baseLabel = btn.dataset.label || btn.textContent;
    btn.dataset.label = baseLabel;
    const isCompleted = !!progress.completed?.[btn.dataset.level];
    btn.classList.toggle('completed', isCompleted);
    btn.textContent = isCompleted ? `${baseLabel} ✅ Completed` : baseLabel;
    if (idx > progress.unlockedIdx) {
      btn.disabled = true;
      btn.title = 'Complete previous levels to unlock';
    } else {
      btn.disabled = false;
      btn.title = '';
    }
  });
}

export function initLevelUI(loadLevelCb) {
  onLoadLevel = loadLevelCb;

  // Load progress and update button states
  updateLevelButtons();

  // Continue loads saved checkpoint (handled in main) – just hide overlay
  const continueBtn = document.getElementById('continueBtn');
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      hideOverlay();
      // main.js will detect checkpoint and load it; if not, it stays on current
      onLoadLevel(current);
    });
  }

  // Hook level buttons
  document.querySelectorAll('.levelBtn[data-level]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return; // Prevent clicking locked levels
      const levelId = btn.dataset.level;
      current = levelId;
      highlightLevel(levelId);
      hideOverlay();
      onLoadLevel(levelId);
    });
  });

  // Optional restart/reset buttons (if present)
  const rBtn = document.getElementById('btnRestart');
  if (rBtn) rBtn.addEventListener('click', () => {
    current = LEVEL_ORDER[0];
    highlightLevel(current);
    hideOverlay();
    onLoadLevel(current);
  });

  const resetBtn = document.getElementById('btnResetLevel');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    hideOverlay();
    onLoadLevel(current);
  });

  highlightLevel(current);

  return {
    setTrashRemaining(v) {
      const el = document.getElementById('trashRemaining');
      if (el) el.textContent = String(v);
    },
    setGoals(goals) {
      // FIX: Changed from goalTrash/goalTrees to trashGoal/treesGoal
      const g1 = document.getElementById('trashGoal');
      const g2 = document.getElementById('treesGoal');
      if (g1) g1.textContent = String(goals.trashCleaned ?? 0);
      if (g2) g2.textContent = String(goals.treesPlanted ?? 0);
    },
    setProgress(prog) {
      // FIX: Changed from progTrash/progTrees to trashDone/treesDone
      const p1 = document.getElementById('trashDone');
      const p2 = document.getElementById('treesDone');
      if (p1) p1.textContent = String(prog.trashCleaned ?? 0);
      if (p2) p2.textContent = String(prog.treesPlanted ?? 0);
    },
    showComplete(text, nextId) {
      // FIX: Use the correct overlay and elements from your HTML
      const completeOverlay = document.getElementById('complete');
      const completeStats = document.getElementById('completeStats');
      const nextLevelBtn = document.getElementById('nextLevelBtn');
      const backMenuBtn = document.getElementById('backMenuBtn');
      
      // Update level buttons to reflect newly unlocked levels
      updateLevelButtons();
      
      if (completeStats) completeStats.textContent = text;
      if (completeOverlay) completeOverlay.classList.remove('hidden');
      
      if (nextLevelBtn) {
        if (nextId) {
          const nextLevel = getLevelConfig(nextId);
          nextLevelBtn.textContent = `Next: ${nextLevel.name}`;
          nextLevelBtn.onclick = () => {
            if (completeOverlay) completeOverlay.classList.add('hidden');
            current = nextId;
            highlightLevel(current);
            hideOverlay();
            onLoadLevel(nextId);
          };
        } else {
          nextLevelBtn.textContent = 'Back to Menu';
          nextLevelBtn.onclick = () => {
            if (completeOverlay) completeOverlay.classList.add('hidden');
            updateLevelButtons();
            showOverlay();
          };
        }
      }
      
      if (backMenuBtn) {
        backMenuBtn.onclick = () => {
          if (completeOverlay) completeOverlay.classList.add('hidden');
          updateLevelButtons();
          showOverlay();
        };
      }
    },
    showOverlay
  };
}

export function resetRunForLevel(_cfg) {}

export function getNextLevelId(levelId) {
  const i = LEVEL_ORDER.indexOf(levelId);
  if (i < 0 || i === LEVEL_ORDER.length - 1) return null;
  return LEVEL_ORDER[i + 1];
}