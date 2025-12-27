
import * as THREE from 'three';

export function makeTrashMesh(ttype) {
  let geom;

  if (ttype.shape === 'bottle') {
    // simple bottle: cylinder body + small neck
    const body = new THREE.CylinderGeometry(0.11, 0.12, 0.32, 12);
    const neck = new THREE.CylinderGeometry(0.06, 0.08, 0.12, 10);
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: ttype.color });
    const m1 = new THREE.Mesh(body, mat);
    const m2 = new THREE.Mesh(neck, mat);
    m2.position.y = 0.22;
    g.add(m1); g.add(m2);
    g.userData.isTrash = true;
    return g;
  }

  if (ttype.shape === 'can') {
    geom = new THREE.CylinderGeometry(0.12, 0.12, 0.26, 14);
    const mesh = new THREE.Mesh(geom, new THREE.MeshStandardMaterial({ color: ttype.color }));
    mesh.userData.isTrash = true;
    return mesh;
  }

  // wrapper (flat plane folded)
  const plane = new THREE.PlaneGeometry(0.34, 0.22, 1, 1);
  const mesh = new THREE.Mesh(plane, new THREE.MeshStandardMaterial({ color: ttype.color, side: THREE.DoubleSide }));
  mesh.rotation.x = -Math.PI/2;
  mesh.userData.isTrash = true;
  return mesh;
}
