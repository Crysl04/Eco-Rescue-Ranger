
import 'aframe';
import * as THREE from 'three';

let sceneEl = null;
let mapGroup = null;

const loader = new THREE.TextureLoader();

function loadTiledTexture(url, repeat=24) {
  const tex = loader.load(url);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function heightAt(levelId, x, z) {
  const s = 0.045;
  if (levelId === 'park')  return 0.28 * Math.sin(x*s) * Math.cos(z*s);
  if (levelId === 'river') return 0.70 * Math.sin(x*s*0.8) * Math.cos(z*s*0.9);
  if (levelId === 'coast') return 0.22 * Math.sin(x*s*0.6) * Math.cos(z*s*0.6);
  if (levelId === 'forest')return 1.10 * Math.sin(x*s*1.1) * Math.cos(z*s*0.9);
  return 0;
}

function buildTerrainMesh(levelId) {
  const geo = new THREE.PlaneGeometry(240, 240, 90, 90);
  geo.rotateX(-Math.PI/2);

  const pos = geo.attributes.position;
  for (let i=0;i<pos.count;i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    let y = heightAt(levelId, x, z);

    // Shore shaping
    if (levelId === 'coast') {
      const shore = (z + 120) / 240;
      y *= (0.25 + shore);
    }

    // Carve river channel
    if (levelId === 'river') {
      const dist = Math.abs(z + 30);
      if (dist < 10) y -= (1.0 - dist/10) * 0.9;
    }

    pos.setY(i, y);
  }
  geo.computeVertexNormals();

  const mapUrl = (levelId === 'coast')
    ? '/assets/textures/sand.jpg'
    : '/assets/textures/grassrock.jpg';

  const tex = loadTiledTexture(mapUrl, levelId === 'coast' ? 20 : 18);

  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 1.0,
    metalness: 0.0
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  mesh.name = 'aframeTerrainMesh';
  return mesh;
}

function buildWater(levelId) {
  if (levelId !== 'river' && levelId !== 'coast') return null;
  const geo = new THREE.PlaneGeometry(240, 90, 1, 1);
  geo.rotateX(-Math.PI/2);
  const mat = new THREE.MeshStandardMaterial({
    color: (levelId === 'river') ? 0x2b6f7a : 0x2f7fd1,
    transparent: true,
    opacity: (levelId === 'river') ? 0.55 : 0.65
  });
  const water = new THREE.Mesh(geo, mat);
  water.position.set(0, 0.12, levelId === 'river' ? -30 : -60);
  water.name = 'aframeWater';
  return water;
}

function buildNets(levelId) {
  if (levelId !== 'coast') return null;
  const group = new THREE.Group();
  group.name = 'aframeFishingNets';
  const mat = new THREE.MeshStandardMaterial({ color: 0x334455, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
  for (let i=0;i<10;i++) {
    const g = new THREE.PlaneGeometry(7, 4.5, 6, 4);
    const m = new THREE.Mesh(g, mat);
    m.rotation.x = -Math.PI/2;
    m.position.set(-76 + i*16, 0.15, -14 - (i%2)*12);
    group.add(m);
  }
  return group;
}

function buildParkDetails() {
  const g = new THREE.Group();
  g.name = 'parkDetails';

  // Walking path ring
  const path = new THREE.Mesh(
    new THREE.RingGeometry(18, 22, 64),
    new THREE.MeshStandardMaterial({ color: 0x6b6b6b, roughness: 1.0 })
  );
  path.rotation.x = -Math.PI/2;
  path.position.set(0, 0.02, 0);
  g.add(path);

  // Decorative trees
  const trunkTex = loader.load('/assets/textures/trunk.jpg');
  trunkTex.colorSpace = THREE.SRGBColorSpace;
  const trunkMat = new THREE.MeshStandardMaterial({ map: trunkTex });
  const leafTex = loader.load('/assets/textures/leaves.png');
  leafTex.colorSpace = THREE.SRGBColorSpace;
  const leafMat = new THREE.MeshStandardMaterial({ map: leafTex });
  for (let i=0;i<18;i++) {
    const a = (i/18) * Math.PI*2;
    const x = Math.cos(a)*40;
    const z = Math.sin(a)*40;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.22,1.6,10), trunkMat);
    trunk.position.set(x, 0.8, z);
    const crown = new THREE.Mesh(new THREE.ConeGeometry(1.2,2.4,12), leafMat);
    crown.position.set(x, 2.5, z);
    g.add(trunk, crown);
  }
  return g;
}

export function buildLevelMapIntoThree(scene, levelId) {
  if (mapGroup) {
    mapGroup.traverse(o => { if (o.geometry) o.geometry.dispose(); });
    scene.remove(mapGroup);
  }

  mapGroup = new THREE.Group();
  mapGroup.name = 'mapGroup';

  mapGroup.add(buildTerrainMesh(levelId));

  const water = buildWater(levelId);
  if (water) mapGroup.add(water);

  const nets = buildNets(levelId);
  if (nets) mapGroup.add(nets);

  if (levelId === 'park') mapGroup.add(buildParkDetails());

  scene.add(mapGroup);
  return mapGroup;
}

export function getMapGroup() { return mapGroup; }
