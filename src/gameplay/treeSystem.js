
import * as THREE from 'three';
import { spendPoints, changeCarbon } from '../systems/carbonMeter.js';
import { useSapling } from '../systems/inventory.js';
import { playPlant } from '../systems/audioSystem.js'; 

let group = null;
let cost = 10;
let plantingEnabled = true;

export function initTrees(app, player, state) {
  const raycaster = new THREE.Raycaster();

  function plant() {
    if (!plantingEnabled) return;
    if (!useSapling()) return;
    if (!spendPoints(cost)) return;

    raycaster.setFromCamera(new THREE.Vector2(0,0), player.camera);
    const hits = raycaster.intersectObjects(app.scene.children, true);
    if (!hits.length) return;

    const p = hits[0].point.clone();

    // Instant tree mesh
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.14, 1.2, 10),
      new THREE.MeshStandardMaterial({ color: 0x6d4c2f })
    );
    const crown = new THREE.Mesh(
      new THREE.ConeGeometry(0.75, 1.5, 12),
      new THREE.MeshStandardMaterial({ color: 0x1f7a1f })
    );
    const tree = new THREE.Group();
    trunk.position.set(0, 0.6, 0);
    crown.position.set(0, 1.8, 0);
    tree.add(trunk, crown);

    tree.position.copy(p);
    tree.position.y += 0.0;
    group.add(tree);

    state.treesPlanted++;
    // Planting reduces carbon
    changeCarbon(-6);

    playPlant();
  }

  window.addEventListener('click', (e) => {
    // Plant on SHIFT+Click to avoid conflicting with trash pickup click
    if (e.shiftKey) plant();
  });

  window.addEventListener('keydown', e => {
    // Also allow T as before
    if (e.key.toLowerCase() === 't') plant();
  });

  return {
    setCost(v) { cost = v; },
    setEnabled(v) { plantingEnabled = !!v; },
    reset() {
      if (group) {
        group.traverse(o => { if (o.geometry) o.geometry.dispose(); });
        app.scene.remove(group);
      }
      group = new THREE.Group();
      group.name = 'treesGroup';
      app.scene.add(group);
    }
  };
}
