
import * as THREE from 'three';

const bldgTexture = new THREE.TextureLoader().load('/assets/textures/bld.jpg');
bldgTexture.colorSpace = THREE.SRGBColorSpace;

export function createBuildings(scene, count=15, zones=null) {
  const group = new THREE.Group();
  group.name = 'buildings';

  function randIn(min, max) { return min + Math.random()*(max-min); }

  for (let i=0;i<count;i++) {
    const h = 4 + Math.random()*6;
    const w = 3 + Math.random()*4;
    const d = 3 + Math.random()*4;
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({
        map: bldgTexture,
        roughness: 0.8,
        metalness: 0.0
      })
    );

    let x, z;
    if (zones && zones.length) {
      const zone = zones[Math.floor(Math.random()*zones.length)];
      const [xmin,xmax, zmin,zmax] = zone;
      x = randIn(xmin, xmax);
      z = randIn(zmin, zmax);
    } else {
      x = (Math.random()-0.5)*140;
      z = (Math.random()-0.5)*140;
    }

    b.position.set(x, h/2, z);
    group.add(b);
  }

  scene.add(group);
  return group;
}

export function clearBuildings(scene) {
  const g = scene.getObjectByName('buildings');
  if (g) {
    g.traverse(o => { if (o.geometry) o.geometry.dispose(); });
    scene.remove(g);
  }
}
