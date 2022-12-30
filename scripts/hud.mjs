import * as THREE from 'three';
import { camera, entities } from '/entry.mjs';
import { addMeshWithoutPhysics } from './utils/util-functions.mjs';

export function initHud() {

    addMeshWithoutPhysics({
        src: 'assets/bowie_knife.glb',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.1, y: 0.1, z: 0.1 },
        uuid: 'flashlight'
    });

}

export function updateHud() {

    let flashlight = entities['flashlight'];

    if (!flashlight || !flashlight.mesh) return;
  
    flashlight.mesh.position.set(camera.position.x, camera.position.y, camera.position.z);

    flashlight.mesh.rotation.set(camera.rotation.x, camera.rotation.y, camera.rotation.z);

    // move the flashlight forward based on the camera's rotation
    flashlight.mesh.translateOnAxis(new THREE.Vector3(0.2, -0.1, -0.3), 1);

    flashlight.mesh.rotateX(-1.7);
    flashlight.mesh.rotateY(-0.3);
    flashlight.mesh.rotateZ(Math.PI);

}