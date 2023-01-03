import * as THREE from 'three'; // Import three.js
import * as CANNON from 'cannon-es'; // Import cannon-es
import { models, world, scene, game_objects } from '../../entry.mjs'; // Import the scene

export async function generateMap() {

    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Create an ambient light
    scene.add(ambientLight); // Add the ambient light to the scene

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Create a directional light
    directionalLight.position.set(0, 100, 0); // Set the directional light position
    scene.add(directionalLight); // Add the directional light to the scene

    const ground = new CANNON.Body({ // Create a cannon body
        mass: 0, // Set the mass to 0
        shape: new CANNON.Plane(), // Set the shape to a plane
        material: new CANNON.Material() // Set the material
    });

    ground.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2); // Set the ground rotation
    world.addBody(ground); // Add the ground to the world

    const groundMesh = new THREE.Mesh( // Create a three.js mesh
        new THREE.PlaneGeometry(100, 100), // Set the geometry to a plane
        new THREE.MeshStandardMaterial({ // Set the material
            color: 0x00ff00, // Set the color to green
            roughness: 0.5, // Set the roughness to 0.5
            metalness: 0.5 // Set the metalness to 0.5
        })
    );

    scene.add(groundMesh); // Add the ground mesh to the scene

    game_objects['ground'] = {

        body: ground,
        mesh: groundMesh
        
    };

    const box = new CANNON.Body({ // Create a cannon body
        mass: 1, // Set the mass to 1
        shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)), // Set the shape to a box
        material: new CANNON.Material() // Set the material
    });
    box.quaternion.setFromAxisAngle(new CANNON.Vec3(0.5, 0.5, 0.5), -Math.PI / 2); // Set the box rotation
    box.position.set(0, 50, 0); // Set the box position
    world.addBody(box); // Add the box to the world

    const boxMesh = new THREE.Mesh( // Create a three.js mesh
        new THREE.BoxGeometry(2, 2, 2), // Set the geometry to a box
        new THREE.MeshStandardMaterial({ // Set the material
            color: 0x0000ff, // Set the color to blue
            roughness: 0.5, // Set the roughness to 0.5
            metalness: 0.5 // Set the metalness to 0.5
        })
    );
    boxMesh.position.set(0, 50, 0); // Set the box mesh position
    scene.add(boxMesh); // Add the box mesh to the scene

    game_objects['box'] = {

        body: box,
        mesh: boxMesh
    };

    return true;

}