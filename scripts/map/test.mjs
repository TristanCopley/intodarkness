import * as THREE from 'three'; // Import three.js
import { models, physics, scene, camera, renderer } from '../../entry.mjs'; // Import the scene

export async function generateMap() {

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Create an ambient light
    scene.add(ambientLight); // Add the ambient light to the scene
    
    //let ground = models['platform'].scene.clone(); // Clone the ground mesh
    let ground = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 10, 10, 10, 1), new THREE.MeshStandardMaterial({ color: 0x00ff00 })); // Create a ground mesh
    ground.position.set(0, -1, 0); // Set the ground mesh position
    ground.rotateX(-Math.PI / 2); // Set the ground mesh rotation
    scene.add(ground); // Add the ground mesh to the scene
    physics.add.existing(ground, { shape: 'mesh', mass: 0 }); // Add the ground mesh to the physics world

    const cylinder = models['player'].scene.clone(); // Clone the cylinder mesh
    cylinder.position.set(0, 10, 0); // Set the cylinder mesh position
    cylinder.rotateX(0.3) // Set the cylinder mesh rotation
    scene.add(cylinder); // Add the cylinder mesh to the scene

    physics.add.existing(cylinder, { shape: 'mesh', mass: 1 }); // Add the cylinder mesh to the physics world

    const suzanne = models['suzanne'].scene.clone(); // Clone the suzanne mesh
    suzanne.position.set(10, 10, 0); // Set the suzanne mesh position
    scene.add(suzanne); // Add the suzanne mesh to the scene
    physics.add.existing(suzanne, { shape: 'hull', mass: 1 }); // Add the suzanne mesh to the physics world

    const medkit = models['medkit'].scene.clone(); // Clone the medkit mesh
    medkit.position.set(0, 10, 10); // Set the medkit mesh position
    scene.add(medkit); // Add the medkit mesh to the scene
    physics.add.existing(medkit, { shape: 'mesh', mass: 1 }); // Add the medkit mesh to the physics world

    const gun = models['gun'].scene.clone(); // Clone the gun mesh
    gun.position.set(0, 10, -10); // Set the gun mesh position
    scene.add(gun); // Add the gun mesh to the scene
    physics.add.existing(gun, { shape: 'mesh', mass: 1 }); // Add the gun mesh to the physics world

    const small_flashlight = models['small_flashlight'].scene.clone(); // Clone the small_flashlight mesh
    small_flashlight.position.set(10, 10, 10); // Set the small_flashlight mesh position
    scene.add(small_flashlight); // Add the small_flashlight mesh to the scene
    physics.add.existing(small_flashlight, { shape: 'mesh', mass: 1 }); // Add the small_flashlight mesh to the physics world

    const revolver = models['revolver'].scene.clone(); // Clone the revolver mesh
    let box = new THREE.Box3().setFromObject(revolver); // Create a box from the revolver mesh
    revolver.position.set(10, 10, -10); // Set the revolver mesh position
    scene.add(revolver); // Add the revolver mesh to the scene
    physics.add.existing(revolver, { shape: 'box', mass: 1, width: box.max.x - box.min.x, height: box.max.y - box.min.y, depth: box.max.z - box.min.z}); // Add the revolver mesh to the physics world

    const engine = models['engine'].scene.clone(); // Clone the engine mesh
    box = new THREE.Box3().setFromObject(engine); // Create a box from the revolver mesh
    engine.position.set(10, 10, -10); // Set the revolver mesh position
    scene.add(engine); // Add the revolver mesh to the scene
    physics.add.existing(engine, { shape: 'box', mass: 1, width: box.max.x - box.min.x, height: box.max.y - box.min.y, depth: box.max.z - box.min.z}); // Add the revolver mesh to the physics world


    return true;

}