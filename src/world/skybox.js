
import * as THREE from 'three';

export function createSkybox(scene) {
  // Create skybox with 360-degree equirectangular texture
  const skyGeo = new THREE.SphereGeometry(500, 64, 32);
  skyGeo.scale(-1, 1, 1); // Invert the sphere for inside viewing
  const textureLoader = new THREE.TextureLoader();
  const skyTexture = textureLoader.load('/assets/textures/sky-360.jpg', 
    (texture) => {
      console.log('Sky texture loaded successfully:', texture);
    },
    undefined,
    (error) => {
      console.error('Error loading sky texture:', error);
    }
  );
  skyTexture.colorSpace = THREE.SRGBColorSpace;
  skyTexture.minFilter = THREE.LinearFilter;
  skyTexture.magFilter = THREE.LinearFilter;
  const skyMat = new THREE.MeshBasicMaterial({ 
    map: skyTexture, 
    toneMapped: false,
    fog: false
  });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  sky.name = 'sky';
  sky.frustumCulled = false; // Don't cull the skybox
  scene.add(sky);
  return sky;
}

export function setSkyColor(scene, colorHex) {
  // Disabled: don't override textured skybox with solid color
  // const sky = scene.getObjectByName('sky');
  // if (sky && sky.material) sky.material.color.setHex(colorHex);
}
