
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const templates = [];

// Preload multiple bottle trash models
const MODEL_PATHS = [
  '/assets/models/growthbottle (1).glb',
  '/assets/models/milk_bottle.glb',
  '/assets/models/perfume_bottle.glb',
  '/assets/models/water_bottle_free.glb',
  '/assets/models/water_bottles.glb'
];

MODEL_PATHS.forEach((p) => {
  loader.load(p, (gltf) => {
    templates.push(gltf.scene);
  }, undefined, (err) => {
    console.error('Failed to load trash model', p, err);
  });
});

export function makeTrashMesh(ttype) {
  // If any GLTF is loaded, pick one at random
  if (templates.length > 0) {
    const base = templates[Math.floor(Math.random() * templates.length)];
    const obj = base.clone(true);
    obj.userData.isTrash = true;
    obj.userData.ttype = ttype;
    obj.traverse((n) => {
      if (n.isMesh) {
        n.castShadow = true;
        n.receiveShadow = true;
        n.userData.ttype = ttype;
      }
    });
    // Normalize height to ~0.32 with slight variation
    const bbox = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const targetHeight = 0.32 * (0.92 + Math.random() * 0.16);
    const scaleFactor = size.y > 0 ? targetHeight / size.y : 0.3;
    obj.scale.setScalar(scaleFactor);
    return obj;
  }

  // Fallback primitive if models not yet loaded
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.26, 14),
    new THREE.MeshStandardMaterial({ color: ttype.color })
  );
  mesh.userData.isTrash = true;
  mesh.userData.ttype = ttype;
  return mesh;
}
