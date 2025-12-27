
import * as THREE from 'three';

export function createRiver(scene) {
  const geom = new THREE.PlaneGeometry(90, 12, 128, 16);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      uBase: { value: new THREE.Color(0x1a6fa5) },
      uFoam: { value: new THREE.Color(0xbfe9ff) }
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 p = position;
        float wave1 = sin((p.x*0.35) + uTime*1.4) * 0.12;
        float wave2 = cos((p.y*0.60) + uTime*1.1) * 0.08;
        p.z += wave1 + wave2;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uBase;
      uniform vec3 uFoam;
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        float flow = sin((vUv.x * 18.0) + uTime*2.0) * 0.5 + 0.5;
        float band = smoothstep(0.0, 0.2, vUv.y) * (1.0 - smoothstep(0.8, 1.0, vUv.y));
        vec3 col = mix(uBase, uFoam, flow * 0.25 * band);
        gl_FragColor = vec4(col, 1.0);
      }
    `
  });

  const river = new THREE.Mesh(geom, mat);
  river.rotation.x = -Math.PI / 2;
  river.position.set(0, 0.02, -20);
  river.name = 'river';
  scene.add(river);

  return river;
}

export function removeRiver(scene) {
  const river = scene.getObjectByName('river');
  if (river) {
    if (river.geometry) river.geometry.dispose();
    if (river.material) river.material.dispose();
    scene.remove(river);
  }
}

export function updateRiver(scene, t) {
  const river = scene.getObjectByName('river');
  if (river && river.material && river.material.uniforms) {
    river.material.uniforms.uTime.value = t;
  }
}
