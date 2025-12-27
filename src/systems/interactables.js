
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
let binTemplate = null;
let preloadPromise = null;

export function preloadInteractableModels() {
  if (preloadPromise) return preloadPromise;
  preloadPromise = new Promise((resolve, reject) => {
    gltfLoader.load('/assets/models/trashbin.glb', (gltf) => {
      binTemplate = gltf.scene;
      resolve();
    }, undefined, (err) => {
      console.error('Failed to preload trashbin.glb:', err);
      reject(err);
    });
  });
  return preloadPromise;
}

let group = null;
let interactables = [];

export function clearInteractables(scene) {
  const g = scene.getObjectByName('interactables');
  if (g) {
    g.traverse(o => { if (o.geometry) o.geometry.dispose(); });
    scene.remove(g);
  }
  group = null;
  interactables = [];
}

function makeLabelCanvas(text) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle = '#fff';
  ctx.font = '24px Arial';
  ctx.fillText(text, 14, 58);
  ctx.font = '14px Arial';
  ctx.fillText('Press E', 14, 92);
  return c;
}

function addBillboard(pos, text) {
  const canvas = makeLabelCanvas(text);
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex });
  const spr = new THREE.Sprite(mat);
  spr.position.set(pos[0], pos[1] + 2.6, pos[2]);
  spr.scale.set(4.5, 2.2, 1);
  group.add(spr);
}

function makeCitizen() {
  const citizen = new THREE.Group();

  const skin = new THREE.MeshStandardMaterial({ color: 0xf1c27d });
  const shirt = new THREE.MeshStandardMaterial({ color: 0x3a77ff });
  const pants = new THREE.MeshStandardMaterial({ color: 0x2b2b2b });

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), skin);
  head.position.y = 1.85;

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.35, 0.9, 6, 10), shirt);
  torso.position.y = 1.2;

  const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.9, 10), pants);
  leg1.position.set(-0.18, 0.45, 0);

  const leg2 = leg1.clone();
  leg2.position.set(0.18, 0.45, 0);

  citizen.add(head, torso, leg1, leg2);
  return citizen;
}

export function createInteractables(scene, layout) {
  clearInteractables(scene);
  group = new THREE.Group();
  group.name = 'interactables';
  scene.add(group);
  interactables = [];

  // Trash Can: only use GLTF, no cylinder fallback
  if (binTemplate) {
    const obj = binTemplate.clone(true);
    obj.traverse(n => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
    obj.scale.setScalar(0.9);
    const bbox = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3(); bbox.getSize(size);
    const y = size.y > 0 ? size.y/2 : 0.6;
    obj.position.set(layout.bin[0], y, layout.bin[2]);
    obj.userData = { kind: 'bin', prompt: 'Trash Can: deposit trash (E)' };
    group.add(obj);
    interactables.push(obj);
  } else {
    // Preload then add when ready
    preloadInteractableModels().then(() => {
      if (!group || !binTemplate) return;
      const obj = binTemplate.clone(true);
      obj.traverse(n => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
      obj.scale.setScalar(0.9);
      const bbox = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3(); bbox.getSize(size);
      const y = size.y > 0 ? size.y/2 : 0.6;
      obj.position.set(layout.bin[0], y, layout.bin[2]);
      obj.userData = { kind: 'bin', prompt: 'Trash Can: deposit trash (E)' };
      group.add(obj);
      interactables.push(obj);
    }).catch(() => {});
  }

  addBillboard(layout.bin, 'Trash Can');

  // Sapling Station
  const sap = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.0, 1.4),
    new THREE.MeshStandardMaterial({ color: 0x8e5b3a })
  );
  sap.position.set(layout.sapling[0], 0.5, layout.sapling[2]);
  sap.userData = { kind: 'sapling', prompt: 'Sapling Station: get saplings (E)' };
  group.add(sap);
  addBillboard(layout.sapling, 'Sapling Station');
  interactables.push(sap);

  // Citizen (more person-like)
  const npc = makeCitizen();
  npc.position.set(layout.npc[0], 0.0, layout.npc[2]);
  npc.userData = {
    kind: 'npc',
    prompt: 'Citizen: info (E)',
    description: 'Hi Ranger! Clean up trash and plant trees to reduce carbon pollution. Deposit trash in the Trash Can to earn Eco Points and unlock more saplings. Coastal level has no trees, so focus on trash cleanup!'
  };
  group.add(npc);
  addBillboard(layout.npc, 'Citizen');
  interactables.push(npc);

  return { group, interactables };
}

export function getInteractables() { return interactables; }
