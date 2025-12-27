
import * as THREE from 'three';

export function initScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x777777);
  scene.fog = new THREE.Fog(0x555555, 20, 180);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.6, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x333333, 0.8);
  scene.add(hemi);

  const light = new THREE.DirectionalLight(0xffffff, 0.9);
  light.position.set(10, 20, 10);
  scene.add(light);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(240, 240),
    new THREE.MeshStandardMaterial({ color: 0x3f4a3a })
  );
  ground.name = 'ground';
  ground.visible = false; // terrain comes from mapGroup
  ground.rotation.x = -Math.PI/2;
  ground.receiveShadow = true;
  scene.add(ground);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, renderer };
}
