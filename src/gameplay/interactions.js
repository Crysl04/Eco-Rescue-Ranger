import * as THREE from 'three';
import { getInteractables } from '../systems/interactables.js';
import { showPrompt, hidePrompt, addSaplings, clearTrash, inventory, setDepositedOnce } from '../systems/inventory.js';
import { addPoints, changeCarbon } from '../systems/carbonMeter.js';

let lastTalkAt = 0;
let temporaryPromptUntil = 0; // <-- new variable

const LINES = [
  "Thanks for helping! The area already looks better.",
  "Deposit trash in the Trash Can to convert it into progress!",
  "In Coastal Cleanup, trash is the main way to reduce carbon.",
  "Planting trees helps clean the air fast. Keep going!"
];

const POINTS_BY_TYPE = { bottle: 5, can: 3, wrapper: 2 };

export function initInteractions(app, player, state) {
  const raycaster = new THREE.Raycaster();
  const center = new THREE.Vector2(0,0);

  function getTarget() {
    const objs = getInteractables();
    raycaster.setFromCamera(center, player.camera);
    const hits = raycaster.intersectObjects(objs, true);
    if (!hits.length) return null;
    // bubble to top-level interactable
    let obj = hits[0].object;
    while (obj && !obj.userData?.kind && obj.parent) obj = obj.parent;
    if (!obj || !obj.userData?.kind) return null;
    if (hits[0].distance > 3.2) return null;
    return obj;
  }

  function updatePrompt() {
    // If we are currently showing a temporary prompt, do nothing until the time is up.
    if (performance.now() < temporaryPromptUntil) {
      return;
    }

    const t = getTarget();
    if (!t) return hidePrompt();
    showPrompt(`${t.userData.prompt}`);
  }

  function interact() {
    const t = getTarget();
    if (!t) return;

    const kind = t.userData.kind;

    if (kind === 'bin') {
      const snap = clearTrash();
      const total = snap.bottle + snap.can + snap.wrapper;
      if (total > 0) {
        const pts = snap.bottle*POINTS_BY_TYPE.bottle + snap.can*POINTS_BY_TYPE.can + snap.wrapper*POINTS_BY_TYPE.wrapper;
        addPoints(pts);
        // Still reduce carbon on disposal (extra boost)
        changeCarbon(-Math.min(26, 3 + total*1.2));
        setDepositedOnce();
      } else {
        showPrompt('Trash Can: inventory is empty.');
        // Set a temporary prompt for 900ms
        temporaryPromptUntil = performance.now() + 900;
        setTimeout(updatePrompt, 900);
      }
    }

    if (kind === 'sapling') {
      if (!inventory.depositedOnce) {
        showPrompt('Saplings locked: deposit trash first (use Trash Can).');
        temporaryPromptUntil = performance.now() + 1200;
        setTimeout(updatePrompt, 1200);
        return;
      }
      addSaplings(2);
    }

    if (kind === 'npc') {
      const now = performance.now();
      if (now - lastTalkAt > 500) {
        lastTalkAt = now;
        const msg = t.userData.description || LINES[Math.floor(Math.random()*LINES.length)];
        showPrompt(`Citizen: ${msg}`);
        console.log('SHOW PROMPT:', msg);
        // Set temporary prompt for 3 seconds
        temporaryPromptUntil = now + 3000;
        setTimeout(updatePrompt, 3000);
      }
    }
  }

  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'e') interact();
  });

  return { updatePrompt };
}