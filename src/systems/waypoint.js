
import * as THREE from 'three';
import { inventory } from './inventory.js';

let arrow = null;
let targets = null;

export function initWaypoint(camera) {
  // 3D arrow attached to camera (simple cone)
  const mat = new THREE.MeshStandardMaterial({ color: 0xffff66 });
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 14), mat);
  cone.position.set(0, -0.05, -0.6);
  cone.rotation.x = Math.PI; // point forward
  cone.name = 'waypointArrow';
  camera.add(cone);
  arrow = cone;
}

export function setWaypointTargets(layout) {
  targets = layout; // expects {bin, sapling, filter}
}

export function updateWaypoint(camera, carbon) {
  if (!arrow || !targets) return;

  // Decide where to point:
  // - If trash inventory is full => bin
  // - If no saplings => sapling station
  // - If carbon is high => filter (suggest)
  let target = targets.bin;
  let label = 'BIN';

  if (inventory.trash >= inventory.trashCap) {
    target = targets.bin;
    label = 'BIN';
  } else if (inventory.saplings <= 0) {
    target = targets.sapling;
    label = 'SAPLINGS';
  } else if (carbon > 60) {
    target = targets.filter;
    label = 'FILTER';
  } else {
    target = targets.bin;
    label = 'BIN';
  }

  // World position of target
  const tx = target[0], ty = 1.0, tz = target[2];
  const camPos = new THREE.Vector3();
  camera.getWorldPosition(camPos);

  const dir = new THREE.Vector3(tx - camPos.x, 0, tz - camPos.z).normalize();

  // Convert dir into yaw relative to camera forward
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0; forward.normalize();

  const cross = new THREE.Vector3().crossVectors(forward, dir);
  const dot = forward.dot(dir);
  const yaw = Math.atan2(cross.y, dot);

  arrow.rotation.z = yaw * 0.7;

  // Also show small HUD hint
  const p = document.getElementById('prompt');
  if (p && p.classList.contains('hidden')) {
    // keep prompt hidden unless near; no-op
    return;
  }
}
