import * as THREE from 'three'; // Import three.js
import { models, physics, scene, camera, renderer } from '../../entry.mjs'; // Import the scene
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export async function generateMap() {

    const controls = new OrbitControls(camera, renderer.domElement); // Create the orbit controls

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Create an ambient light
    scene.add(ambientLight); // Add the ambient light to the scene
    
    const ground = new THREE.Mesh( // Create a ground mesh
        new THREE.PlaneGeometry(100, 100, 1, 1), // Create a plane geometry
        new THREE.MeshPhongMaterial({ color: 0x222222 }) // Create a phong material
    );

    ground.rotation.x = -Math.PI / 2; // Rotate the ground mesh
    ground.receiveShadow = true; // Enable shadows for the ground mesh
    scene.add(ground); // Add the ground mesh to the scene
    physics.add.existing(ground, { shape: 'plane', mass: 0 }); // Add the ground mesh to the physics world

    const cylinder = new THREE.Mesh( // Create a cylinder mesh
        new THREE.CylinderGeometry(1, 1, 3, 32), // Create a cylinder geometry
        new THREE.MeshPhongMaterial({ color: 0xff0000 }) // Create a phong material
    );

    cylinder.position.set(0, 1, 0); // Set the cylinder mesh position
    cylinder.castShadow = true; // Enable shadows for the cylinder mesh
    cylinder.receiveShadow = true; // Enable shadows for the cylinder mesh
    scene.add(cylinder); // Add the cylinder mesh to the scene

    return true;

}