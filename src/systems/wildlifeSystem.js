
import * as THREE from 'three';
let birds = [];

export function spawnWildlife(scene, stage) {
  if (stage < 1 || birds.length) return;

  for (let i = 0; i < 5; i++) {
    const bird = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    bird.position.set(-30 + i*5, 10, -20);
    birds.push(bird);
    scene.add(bird);
  }
}

export function updateWildlife() {
  birds.forEach(b => b.position.x += 0.02);
}
