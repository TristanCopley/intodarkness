
// // let flashlight = new THREE.Mesh(
// //     gltf.scene.children[0].geometry,
// //     new THREE.MeshPhongMaterial({ color: 0x222222 })
// // );

// // export function initHud() {



// // }

// import * as THREE from 'three';

// import { flight, camera } from '../entry.js';

// export function updateHud() {
  
//     flight.position.set(camera.position.x, camera.position.y, camera.position.z);

//     flight.rotation.set(camera.rotation.x, camera.rotation.y, camera.rotation.z);

//     // move the flashlight forward based on the camera's rotation
//     flight.translateOnAxis(new THREE.Vector3(3, -2, -5), 1);

//     flight.rotateX(Math.PI / -2 + 0.4);

// }