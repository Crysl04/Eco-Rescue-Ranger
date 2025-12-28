
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
let butterflyTemplate = null;
let butterflies = [];

// Preload butterfly model
gltfLoader.load('/assets/models/butterfly.glb', (gltf) => {
  butterflyTemplate = gltf.scene;
}, undefined, (err) => {
  console.error('Failed to load butterfly.glb:', err);
});

export function spawnButterflies(scene, stage) {
  if (stage < 2 || butterflies.length) return;

  for (let i=0; i<10; i++) {
    let butterfly;
    
    if (butterflyTemplate) {
      // Use GLTF model with pink tint
      butterfly = butterflyTemplate.clone(true);
      butterfly.scale.setScalar(0.002); // small butterfly size
      // Apply pink color to all meshes
      butterfly.traverse(node => {
        if (node.isMesh && node.material) {
          node.material.color.setHex(0xff69b4); // hot pink
        }
      });
    } else {
      // Fallback to simple plane
      butterfly = new THREE.Mesh(
        new THREE.PlaneGeometry(0.35, 0.25),
        new THREE.MeshStandardMaterial({ color: 0xff69b4, side: THREE.DoubleSide })
      );
    }
    
    butterfly.position.set((Math.random()-0.5)*40, 1.5 + Math.random()*2.0, (Math.random()-0.5)*40);
    butterfly.rotation.y = Math.random() * Math.PI * 2;
    butterfly.userData = { baseY: butterfly.position.y, phase: Math.random()*10.0 };
    scene.add(butterfly);
    butterflies.push(butterfly);
  }
}

export function updateButterflies(t) {
  butterflies.forEach(b => {
    b.position.y = b.userData.baseY + Math.sin(t*2.4 + b.userData.phase)*0.12;
    b.rotation.z = Math.sin(t*10.0 + b.userData.phase) * 0.6; // "flap"
    b.position.x += Math.sin(t*0.6 + b.userData.phase) * 0.002;
    b.position.z += Math.cos(t*0.6 + b.userData.phase) * 0.002;
  });
}
