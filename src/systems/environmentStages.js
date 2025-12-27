
import { setSkyColor } from '../world/skybox.js';

export let stage = 0; // 0 polluted, 1 improving, 2 recovered

export function updateEnvironment(scene, carbon) {
  if (carbon < 70) stage = 1;
  if (carbon < 30) stage = 2;

  // Drive background + fog + skybox color
  if (stage === 0) {
    scene.background.set(0x777777);
    if (scene.fog) { scene.fog.color.set(0x555555); scene.fog.near = 10; scene.fog.far = 140; }
    setSkyColor(scene, 0x777777);
  }
  if (stage === 1) {
    scene.background.set(0xaadfff);
    if (scene.fog) { scene.fog.color.set(0x88a9b8); scene.fog.near = 20; scene.fog.far = 170; }
    setSkyColor(scene, 0xaadfff);
  }
  if (stage === 2) {
    scene.background.set(0x87ceeb);
    if (scene.fog) { scene.fog.color.set(0x87ceeb); scene.fog.near = 50; scene.fog.far = 260; }
    setSkyColor(scene, 0x87ceeb);
  }
}
