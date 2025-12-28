
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { getMapGroup } from './aframeMaps.js';

export function clearProps(scene) {
  const g = scene.getObjectByName('props');
  if (g) {
    g.traverse(o => { if (o.geometry) o.geometry.dispose(); });
    scene.remove(g);
  }
}

function addBench(group, x, z) {
  const matWood = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
  const matMetal = new THREE.MeshStandardMaterial({ color: 0x444444 });

  const seat = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.15, 0.6), matWood);
  seat.position.set(x, 0.55, z);

  const back = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.6, 0.12), matWood);
  back.position.set(x, 0.9, z - 0.24);

  const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.12), matMetal);
  leg1.position.set(x - 0.85, 0.28, z + 0.2);

  const leg2 = leg1.clone(); leg2.position.set(x + 0.85, 0.28, z + 0.2);
  const leg3 = leg1.clone(); leg3.position.set(x - 0.85, 0.28, z - 0.2);
  const leg4 = leg1.clone(); leg4.position.set(x + 0.85, 0.28, z - 0.2);

  group.add(seat, back, leg1, leg2, leg3, leg4);
}

function addFenceLine(group, x0, z0, x1, z1, posts=10) {
  const mat = new THREE.MeshStandardMaterial({ color: 0x5a3b2a });
  for (let i=0;i<=posts;i++) {
    const t = i/posts;
    const x = x0 + (x1-x0)*t;
    const z = z0 + (z1-z0)*t;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,1.2,8), mat);
    post.position.set(x, 0.6, z);
    group.add(post);
  }
  // rails
  const rail = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(x1-x0, z1-z0), 0.08, 0.08), mat);
  rail.position.set((x0+x1)/2, 0.85, (z0+z1)/2);
  rail.rotation.y = Math.atan2((x1-x0),(z1-z0));
  group.add(rail);
}

function addRockCluster(group, cx, cz, n=10) {
  const mat = new THREE.MeshStandardMaterial({ color: 0x6b6b6b });
  for (let i=0;i<n;i++) {
    const s = 0.5 + Math.random()*1.6;
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.5*s, 0), mat);
    rock.position.set(cx + (Math.random()-0.5)*6, 0.25*s, cz + (Math.random()-0.5)*6);
    rock.rotation.set(Math.random()*2, Math.random()*2, Math.random()*2);
    group.add(rock);
  }
}

function addVent(group, x, z) {
  const mat = new THREE.MeshStandardMaterial({ color: 0x2e2e2e });
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 1.2), mat);
  base.position.set(x, 0.25, z);
  const top = new THREE.Mesh(new THREE.ConeGeometry(0.7, 0.7, 12), mat);
  top.position.set(x, 0.85, z);
  group.add(base, top);
}

function addReeds(group, x, z, n=18) {
  const mat = new THREE.MeshStandardMaterial({ color: 0x2f7a2f });
  for (let i=0;i<n;i++) {
    const h = 0.6 + Math.random()*0.9;
    const reed = new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,h,6), mat);
    reed.position.set(x + (Math.random()-0.5)*5, h/2, z + (Math.random()-0.5)*5);
    group.add(reed);
  }
}

export function createProps(scene, levelId) {
  clearProps(scene);
  const group = new THREE.Group();
  group.name = 'props';
  scene.add(group);

  if (levelId === 'park') {
    addBench(group, -6, -2);
    addBench(group, 6, -4);

}

  if (levelId === 'river') {
    addReeds(group, -8, -18, 24);
    addReeds(group, 8, -18, 24);
}

  if (levelId === 'coast') {
    addRockCluster(group, 0, -24, 18);
    addRockCluster(group, 14, -18, 12);
  }

  if (levelId === 'forest') {
    // simple log piles
    const mat = new THREE.MeshStandardMaterial({ color: 0x6d4c2f });
    for (let i=0;i<8;i++) {
      const log = new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.18,2.0,10), mat);
      log.rotation.z = Math.PI/2;
      log.position.set(-14 + Math.random()*28, 0.25, -16 + Math.random()*16);
      group.add(log);
    }
  }

  if (levelId === 'rooftop') {
    for (let i=0;i<10;i++) addVent(group, -16 + i*3.5, -10 + (i%2)*5);
  }

  // Randomly place 10 cut logs models across the scene
  const gltfLoader = new GLTFLoader();
  gltfLoader.load('/assets/models/cutted-woods.glb', (gltf) => {
    const raycaster = new THREE.Raycaster();
    const terrain = scene.getObjectByName('aframeTerrainMesh');
    for (let i = 0; i < 10; i++) {
      const obj = gltf.scene.clone(true);
      const x = -110 + Math.random() * 220;
      const z = -110 + Math.random() * 220;

      let y = 0.0;
      if (terrain) {
        raycaster.set(new THREE.Vector3(x, 25, z), new THREE.Vector3(0, -1, 0));
        const hits = raycaster.intersectObject(terrain, true);
        if (hits.length) y = hits[0].point.y;
      }
      obj.position.set(x, y, z);
      obj.rotation.y = Math.random() * Math.PI * 2;
      const s = 0.08 + Math.random() * 0.08; // much smaller
      obj.scale.set(s, s, s);
      group.add(obj);
    }
  }, undefined, (err) => {
    console.error('Failed to load cutted-woods.glb:', err);
  });

  // Place a house model in a clear area, aligned to terrain height
  gltfLoader.load('/assets/models/house.glb', (gltf) => {
    const obj = gltf.scene;
    const terrain = scene.getObjectByName('aframeTerrainMesh');
    const raycaster = new THREE.Raycaster();
    // Try to get the active camera to orient houses toward the player
    let cameraRef = null;
    scene.traverse((o) => { if (!cameraRef && o.isCamera) cameraRef = o; });

    // Place houses outside tree ring (radius ~40) to avoid overlap
    const target = new THREE.Vector3(-70, 25, 60);
    let y = 0;
    if (terrain) {
      raycaster.set(target, new THREE.Vector3(0, -1, 0));
      const hits = raycaster.intersectObject(terrain, true);
      if (hits.length) y = hits[0].point.y;
    }

    // Normalize house height to match typical building height (~8 units)
    const bbox = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const targetHeight = 8; // buildings range 4-10, use mid-upper
    const scaleFactor = size.y > 0 ? targetHeight / size.y : 1.6;

    // First house
    obj.position.set(target.x, y, target.z);
    // Yaw the house to face the player horizontally
    if (cameraRef) {
      const lookPos = new THREE.Vector3(cameraRef.position.x, obj.position.y, cameraRef.position.z);
      obj.lookAt(lookPos);
    } else {
      const lookAngle1 = Math.atan2(-target.x, -target.z);
      obj.rotation.y = lookAngle1;
    }
    obj.scale.setScalar(scaleFactor);
    obj.userData.type = 'house';
    group.add(obj);

    // Second house placed on opposite side
    const obj2 = obj.clone(true);
    const target2 = new THREE.Vector3(70, 25, 60);
    let y2 = 0;
    if (terrain) {
      raycaster.set(target2, new THREE.Vector3(0, -1, 0));
      const hits2 = raycaster.intersectObject(terrain, true);
      if (hits2.length) y2 = hits2[0].point.y;
    }
    obj2.position.set(target2.x, y2, target2.z);
    if (cameraRef) {
      const lookPos2 = new THREE.Vector3(cameraRef.position.x, obj2.position.y, cameraRef.position.z);
      obj2.lookAt(lookPos2);
    } else {
      const lookAngle2 = Math.atan2(-target2.x, -target2.z);
      obj2.rotation.y = lookAngle2;
    }
    obj2.scale.setScalar(scaleFactor);
    obj2.userData.type = 'house';
    group.add(obj2);
  }, undefined, (err) => {
    console.error('Failed to load house.glb:', err);
  });

  // Place a shed (FBX) in another clear spot, aligned to terrain height

  return group;
}
