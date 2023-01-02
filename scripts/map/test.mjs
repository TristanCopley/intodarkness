import * as THREE from 'three'; // Import three.js
import { models, physics, scene, game_objects } from '../../entry.mjs'; // Import the scene

export async function generateMap() {

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Create an ambient light
    scene.add(ambientLight); // Add the ambient light to the scene
    
    //let ground = models['platform'].scene.clone(); // Clone the ground mesh
    let ground = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 10, 10, 10, 1), new THREE.MeshStandardMaterial({ color: 0x00ff00 })); // Create a ground mesh
    ground.position.set(0, -1, 0); // Set the ground mesh position
    ground.rotateX(-Math.PI / 2); // Set the ground mesh rotation
    scene.add(ground); // Add the ground mesh to the scene
    physics.add.existing(ground, { shape: 'mesh', mass: 0, }); // Add the ground mesh to the physics world
    ground.body.setFriction(1); // Set the ground mesh friction

    let player = models['player'].scene.clone(); // Clone the cylinder mesh
    player.position.set(0, 10, 0); // Set the cylinder mesh position
    scene.add(player); // Add the cylinder mesh to the scene
    physics.add.existing(player, { shape: 'mesh', mass: 1 }); // Add the cylinder mesh to the physics world
    player.body.setAngularFactor(0, 0, 0); // Disable the cylinder mesh rotation
    player.body.setFriction(1); // Set the cylinder mesh friction
    player.body.setDamping(0.9, 0); // Set the cylinder mesh damping
    game_objects['player'] = player; // Add the cylinder mesh to the game objects
    
    // 

    return true;

}