
import * as THREE from 'three';

const accentTexture = new THREE.TextureLoader().load('/assets/textures/grass.jpg');
accentTexture.colorSpace = THREE.SRGBColorSpace;

export function applyTerrain(scene, terrainCfg) {
  const ground = scene.getObjectByName('ground');
  if (!ground) return;

  // Update ground color
  ground.material.color.setHex(terrainCfg.ground ?? 0x3f4a3a);

  // Remove previous accent patches
  const old = scene.getObjectByName('terrainPatches');
  if (old) scene.remove(old);

  const patches = new THREE.Group();
  patches.name = 'terrainPatches';

  // Add a few simple accent zones (e.g., grass clumps / sand dunes / roof tiles)
  for (let i=0;i<12;i++) {
    const g = new THREE.Mesh(
      new THREE.CircleGeometry(3 + Math.random()*6, 18),
      new THREE.MeshStandardMaterial({
        map: accentTexture,
        roughness: 1.0,
        metalness: 0.0
      })
    );
    g.rotation.x = -Math.PI/2;
    g.position.set((Math.random()-0.5)*160, 0.03, (Math.random()-0.5)*160);
    patches.add(g);
  }

  scene.add(patches);
}
