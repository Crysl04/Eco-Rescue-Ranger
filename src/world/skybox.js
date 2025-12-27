
import * as THREE from 'three';

export function createSkybox(scene) {
  // Lightweight procedural skybox using a large sphere with a gradient-like color
  const skyGeo = new THREE.SphereGeometry(500, 32, 16);
  const skyMat = new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  sky.name = 'sky';
  scene.add(sky);
  return sky;
}

export function setSkyColor(scene, colorHex) {
  const sky = scene.getObjectByName('sky');
  if (sky && sky.material) sky.material.color.setHex(colorHex);
}
