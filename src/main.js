
import { initScene } from './core/scene.js';
import { initPlayer } from './gameplay/player.js';
import { initTrash } from './gameplay/trashSystem.js';
import { initTrees } from './gameplay/treeSystem.js';
import { initInteractions } from './gameplay/interactions.js';

import { updateEnvironment, stage } from './systems/environmentStages.js';
import { spawnWildlife, updateWildlife } from './systems/wildlifeSystem.js';
import { spawnButterflies, updateButterflies } from './systems/butterfliesSystem.js';
import { updateAchievements } from './systems/achievements.js';
import { 
  initAudio, 
  playBackgroundMusic, 
  playComplete,
  pauseBackgroundMusic, 
  setMusicEnabled,
  toggleMusic,
  setMusicVolume,
  setSfxVolume 
} from './systems/audioSystem.js';

import { createBuildings, clearBuildings } from './world/buildings.js';
import { createSkybox } from './world/skybox.js';
import { attachHands, animateHands } from './gameplay/hands.js';
import { applyTerrain } from './world/terrain.js';
import { LAYOUTS } from './world/layouts.js';
import { createProps } from './world/props.js';

import { initLevelUI, resetRunForLevel, getNextLevelId } from './systems/levelManager.js';
import { getLevelConfig, LEVEL_ORDER } from './systems/levels.js';
import { unlockUpTo, markCompleted, loadProgress } from './systems/progress.js';
import { saveCheckpoint, clearCheckpoint } from './systems/checkpoint.js';

import { createInteractables, clearInteractables, preloadInteractableModels } from './systems/interactables.js';
import { resetInventory, addSaplings, updateHUD } from './systems/inventory.js';

import { resetCarbon, resetPoints, getCarbon, getPoints, carbonCreep } from './systems/carbonMeter.js';
import { buildLevelMapIntoThree } from './world/aframeMaps.js';

const app = initScene();
const player = initPlayer(app);

createSkybox(app.scene);
attachHands(app.camera);
initAudio();

// Preload interactable models early to avoid fallback flashes
preloadInteractableModels();

// Initialize audio controls in UI
setTimeout(() => {
  // Start background music after a short delay
  playBackgroundMusic();
}, 500);

let t = 0;
let currentLevelId = null;

const state = {
  trashCleaned: 0,
  treesPlanted: 0,
  wildlifeShown: false,
  trashRemaining: 0
};

let goals = { trashCleaned: 0, treesPlanted: 0 };
let interactions = null;

const ui = initLevelUI((levelId) => {
  const cfg = getLevelConfig(levelId);
  buildWorldForLevel(cfg);
  completedOnce = false;
});

// ESC key to show menu overlay
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('overlay');
    if (overlay && overlay.style.display !== 'flex') {
      overlay.style.display = 'flex';
    }
  }
});


const trashSystem = initTrash(app, player, state, ui, () => stage, () => currentLevelId);
const treeSystem = initTrees(app, player, state);

function buildWorldForLevel(cfg) {
  state.trashCleaned = 0;
  state.treesPlanted = 0;
  state.wildlifeShown = false;
  state.trashRemaining = 0;

  // Reset run values (always start fresh on load/restart)
  completedOnce = false;
  resetPoints();
  const progress = loadProgress();
  const alreadyCompleted = !!progress.completed?.[cfg.id];
  resetCarbon(alreadyCompleted ? 0 : cfg.startCarbon);

  resetInventory();
  addSaplings(3);
  updateHUD();

  // HUD goals
  goals = cfg.goals ?? { trashCleaned: 0, treesPlanted: 0 };
  ui.setGoals(goals);

  // If level already completed this session, show it finished (carbon 0, goals met) but keep unlock state only in-session
  if (alreadyCompleted) {
    state.trashCleaned = goals.trashCleaned ?? 0;
    state.treesPlanted = goals.treesPlanted ?? 0;
    state.trashRemaining = 0;
    ui.setProgress({ trashCleaned: state.trashCleaned, treesPlanted: state.treesPlanted });
    completedOnce = true;
  }
  
  // FIX: Update level name in UI
  const levelNameEl = document.getElementById('levelName');
  if (levelNameEl) levelNameEl.textContent = `Level: ${cfg.name}`;

  // Terrain palette
  applyTerrain(app.scene, cfg.terrain ?? { ground: 0x3f4a3a, accent: 0x2f7a2f });

  // Build A-Frame-backed terrain/map into Three scene (no overlap across levels)
  buildLevelMapIntoThree(app.scene, cfg.id, cfg.terrain);

  // Layout/spawn
  const layout = LAYOUTS[cfg.id] ?? LAYOUTS.park;
  player.body.position.set(layout.spawn[0], 0, layout.spawn[2]);

  // Buildings + props
  clearBuildings(app.scene);
  createBuildings(app.scene, cfg.buildingCount, layout.buildingZones);
  createProps(app.scene, cfg.id);

  // Interactables (trash can + sapling + npc)
  clearInteractables(app.scene);
  createInteractables(app.scene, layout);

  // Trash spawn rules (faster in later levels); skip spawning if already completed this session
  if (!alreadyCompleted) {
    const respawn = true;
    trashSystem.spawn(cfg.trashCount, respawn);
  }

  // Trees: disable on coast
  treeSystem.reset();
  treeSystem.setCost(cfg.treeCost);
  treeSystem.setEnabled(cfg.id !== 'coast');

  currentLevelId = cfg.id;
  saveCheckpoint({ levelId: currentLevelId });

  interactions = initInteractions(app, player, state);
}

let completedOnce = false;

function goalsMet() {
  return (state.trashCleaned >= (goals.trashCleaned ?? 0)) &&
         (state.treesPlanted >= (goals.treesPlanted ?? 0));
}

function checkCompletion() {
  if (completedOnce) return;
  if (getCarbon() <= 0 && goalsMet()) {
    completedOnce = true;

    playComplete();

    const idx = LEVEL_ORDER.indexOf(currentLevelId);
    unlockUpTo(Math.min(LEVEL_ORDER.length-1, idx + 1));
    markCompleted(currentLevelId);

    const nextId = getNextLevelId(currentLevelId);
    
    // FIX: Better formatted completion stats
    const levelName = getLevelConfig(currentLevelId).name;
    const points = getPoints();
    const trashStats = `${state.trashCleaned}/${goals.trashCleaned}`;
    const treeStats = `${state.treesPlanted}/${goals.treesPlanted}`;
    
    const stats = `Level "${levelName}" complete!\n
Eco Points: ${points}\n
Trash cleaned: ${trashStats}\n
Trees planted: ${treeStats}\n
Carbon reduced to 0%!`;

    ui.showComplete(stats, nextId);

    if (!nextId) clearCheckpoint();
    if (document.pointerLockElement) document.exitPointerLock();
  }
}

function animate() {
  requestAnimationFrame(animate);
  t += 0.016;

  player.update();
  if (interactions) interactions.updatePrompt();

  // Carbon creeps up only if trash exists
  updateEnvironment(app.scene, getCarbon());

  spawnWildlife(app.scene, stage);
  updateWildlife();
  if (stage >= 1) state.wildlifeShown = true;

  spawnButterflies(app.scene, stage);
  updateButterflies(t);

  animateHands(player.camera, t, player.state.moving);

  ui.setProgress({ trashCleaned: state.trashCleaned, treesPlanted: state.treesPlanted });

  updateAchievements({
    points: getPoints(),
    carbon: getCarbon(),
    trashCleaned: state.trashCleaned,
    treesPlanted: state.treesPlanted,
    wildlifeShown: state.wildlifeShown
  });

  checkCompletion();
  app.renderer.render(app.scene, app.camera);
}
animate();