
import * as THREE from "three";

export function initPlayer(app) {
  const speed = 0.10;

  // Mouse sensitivity (lower = slower)
  const SENSITIVITY = 0.0022;
  const MAX_PITCH = Math.PI / 2 - 0.05;

  // Jump / gravity (tuned)
  const EYE_HEIGHT = 1.65;
  const GRAVITY = -0.012;
  const JUMP_V = 0.22;
  let velY = 0;
  let grounded = false;

  const keys = {};
  const state = { moving: false };

  // Body for yaw rotation
  const body = new THREE.Object3D();
  body.position.copy(app.camera.position);
  app.scene.add(body);
  body.add(app.camera);
  app.camera.position.set(0, EYE_HEIGHT, 0);

  // Pointer lock
  document.body.addEventListener("click", () => {
    if (!document.pointerLockElement) document.body.requestPointerLock();
  });

  document.addEventListener("keydown", (e) => (keys[e.key.toLowerCase()] = true));
  document.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));

  document.addEventListener("mousemove", (e) => {
    if (document.pointerLockElement === document.body) {
      body.rotation.y -= e.movementX * SENSITIVITY;
      app.camera.rotation.x -= e.movementY * SENSITIVITY;
      app.camera.rotation.x = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, app.camera.rotation.x));
    }
  });

  const downRay = new THREE.Raycaster();
  const dirDown = new THREE.Vector3(0, -1, 0);

  function groundHeightAt() {
    const terrain = app.scene.getObjectByName("aframeTerrainMesh") || app.scene.getObjectByName("mapGroup");
    if (!terrain) return 0;

    downRay.set(body.position.clone().add(new THREE.Vector3(0, 10, 0)), dirDown);
    const hits = downRay.intersectObject(terrain, true);
    if (!hits.length) return 0;
    return hits[0].point.y;
  }

  function update() {
    const dir = new THREE.Vector3();
    app.camera.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();

    const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0));

    const wasMoving = state.moving;
    state.moving = false;

    if (keys["w"]) {
      body.position.addScaledVector(dir, speed);
      state.moving = true;
    }
    if (keys["s"]) {
      body.position.addScaledVector(dir, -speed);
      state.moving = true;
    }
    if (keys["a"]) {
      body.position.addScaledVector(right, -speed);
      state.moving = true;
    }
    if (keys["d"]) {
      body.position.addScaledVector(right, speed);
      state.moving = true;
    }

    // Jump
    if (keys[" "] && grounded) {
      velY = JUMP_V;
      grounded = false;
    }

    // Gravity
    velY += GRAVITY;
    body.position.y += velY;

    // Ground collision
    const groundY = groundHeightAt();
    const targetY = groundY;
    if (body.position.y <= targetY) {
      body.position.y = targetY;
      velY = 0;
      grounded = true;
    }

    return state.moving || wasMoving;
  }

  return { update, camera: app.camera, state, body };
}
