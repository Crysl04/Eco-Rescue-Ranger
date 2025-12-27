
import * as THREE from 'three';
import { randomTrashType } from './trashTypes.js';
import { addTrash } from '../systems/inventory.js';
import { makeTrashMesh } from '../world/trashModels.js';
import { changeCarbon, addPoints } from '../systems/carbonMeter.js';
import { playPickup } from '../systems/audioSystem.js';

const PICKUP_DISTANCE = 3.0;

let trash = [];
let group = null;
let cfg = { count: 55, respawn: true };
let getStageFn = () => 0; // injected from main
let getLevelIdFn = () => 'park';

export function initTrash(app, player, state, ui, getStage, getLevelId) {
  if (getStage) getStageFn = getStage;
  if (getLevelId) getLevelIdFn = getLevelId;
  const raycaster = new THREE.Raycaster();

  function makeTrash() {
    const ttype = randomTrashType();
    const mesh = makeTrashMesh(ttype);
    mesh.userData.ttype = ttype;
    mesh.position.set((Math.random()-0.5)*150, 0.16, (Math.random()-0.5)*150);
    mesh.rotation.y = Math.random() * Math.PI * 2;
    return mesh;
  }

  function updateHUD() {
    state.trashRemaining = trash.length;
    if (ui) ui.setTrashRemaining(state.trashRemaining);
  }

  function respawnDelayMs() {
    const st = getStageFn();
    if (st === 0) return 1400 + Math.random()*900;
    if (st === 1) return 2800 + Math.random()*1500;
    return 5200 + Math.random()*2200;
  }

  function maybeRespawn() {
    if (!cfg.respawn || !group) return;

    const st = getStageFn();
    const chance = (st === 0) ? 0.030 : (st === 1 ? 0.014 : 0.006);

    if (trash.length < cfg.count && Math.random() < chance) {
      const m = makeTrash();
      group.add(m);
      trash.push(m);
      updateHUD();
    }
    setTimeout(maybeRespawn, respawnDelayMs());
  }

  function flattenTargets() {
    const targets = [];
    trash.forEach(obj => {
      if (obj.isGroup) obj.children.forEach(c => targets.push(c));
      else targets.push(obj);
    });
    return targets;
  }

  function carbonPickupDelta(levelId) {
    // Much easier carbon reduction
    if (levelId === 'coast') return -2.5;
    if (levelId === 'forest') return -1.2;
    if (levelId === 'river') return -1.1;
    return -1.0; // park
  }

  function onClick() {
    raycaster.setFromCamera(new THREE.Vector2(0,0), player.camera);
    const hits = raycaster.intersectObjects(flattenTargets(), false);
    if (!hits.length) return;
    if (hits[0].distance > PICKUP_DISTANCE) return;

    let obj = hits[0].object;
    while (obj && !obj.userData.ttype && obj.parent && obj.parent !== group) obj = obj.parent;
    if (!obj || !obj.userData.ttype) return;

    const typeId = obj.userData.ttype.id;
    addTrash(typeId);

    // Coastal bonus points (since no trees)
    const lvl = getLevelIdFn();
    if (lvl === 'coast') {
      const base = (typeId === 'bottle') ? 5 : (typeId === 'can' ? 3 : 2);
      addPoints(base * 2); // bonus points on pickup in coast
    }

    group.remove(obj);
    const idx = trash.indexOf(obj);
    if (idx >= 0) trash.splice(idx, 1);
    state.trashCleaned++;
    updateHUD();

    changeCarbon(carbonPickupDelta(lvl));

    playPickup();
  }

  window.addEventListener('click', onClick);

  return {
    spawn(count=55, respawn=true) {
      cfg = { count, respawn };
      this.clear();
      group = new THREE.Group();
      group.name = 'trashGroup';
      trash = [];

      for (let i=0;i<count;i++) {
        const t = makeTrash();
        group.add(t);
        trash.push(t);
      }
      app.scene.add(group);
      updateHUD();
      setTimeout(maybeRespawn, 900);
    },
    clear() {
      const g = app.scene.getObjectByName('trashGroup');
      if (g) {
        g.traverse(o => { if (o.geometry) o.geometry.dispose(); });
        app.scene.remove(g);
      }
      trash = [];
      group = null;
      updateHUD();
    }
  };
}
