
import * as THREE from 'three';

let butterflies = [];

export function spawnButterflies(scene, stage) {
  if (stage < 2 || butterflies.length) return;

  for (let i=0; i<10; i++) {
    const wing = new THREE.Mesh(
      new THREE.PlaneGeometry(0.35, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xff66cc, side: THREE.DoubleSide })
    );
    wing.position.set((Math.random()-0.5)*40, 1.5 + Math.random()*2.0, (Math.random()-0.5)*40);
    wing.rotation.y = Math.random() * Math.PI * 2;
    wing.userData = { baseY: wing.position.y, phase: Math.random()*10.0 };
    scene.add(wing);
    butterflies.push(wing);
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
