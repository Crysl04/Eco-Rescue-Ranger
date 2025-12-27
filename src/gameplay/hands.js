
import * as THREE from 'three';

export function attachHands(camera) {
  const group = new THREE.Group();
  group.position.set(0, -0.35, -0.6);

  const mat = new THREE.MeshStandardMaterial({ color: 0xffd1b3 });

  const left = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.25), mat);
  left.position.set(-0.18, -0.02, 0);

  const right = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.25), mat);
  right.position.set(0.18, -0.02, 0);

  group.add(left);
  group.add(right);
  group.name = 'hands';
  camera.add(group);
  return group;
}

export function animateHands(camera, t, moving) {
  const hands = camera.getObjectByName('hands');
  if (!hands) return;
  const bob = moving ? Math.sin(t*10.0) * 0.02 : 0.0;
  hands.position.y = -0.35 + bob;
  hands.rotation.z = moving ? Math.sin(t*6.0) * 0.03 : 0.0;
}
