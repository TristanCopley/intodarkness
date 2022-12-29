import * as THREE from 'three';
import { scene, AMMO, entities, physicsWorld } from '../entry.mjs';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { addMeshWithBody } from './utils/util-functions.mjs';

export function initMap() {

    // Add a light to the scene
    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 5, 7);
    scene.add(light);

    let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add a 3D ground plane to the scene
    let ground = new THREE.Mesh(
        new THREE.BoxGeometry(100, 4, 100),
        new THREE.MeshPhongMaterial({ color: 0x222222 })
    );
    ground.position.set(0, -1, 0);
    scene.add(ground);

    // Add rigid body to the ground plane
    let groundShape = new AMMO.btBoxShape(new AMMO.btVector3(50, 2, 50));
    let groundTransform = new AMMO.btTransform();
    groundTransform.setIdentity();
    groundTransform.setOrigin(new AMMO.btVector3(0, -1, 0));
    let groundMass = 0;
    let groundLocalInertia = new AMMO.btVector3(0, 0, 0);
    let groundMotionState = new AMMO.btDefaultMotionState(groundTransform);
    let groundRigidBodyCI = new AMMO.btRigidBodyConstructionInfo(groundMass, groundMotionState, groundShape, groundLocalInertia);
    let groundRigidBody = new AMMO.btRigidBody(groundRigidBodyCI);
    physicsWorld.addRigidBody(groundRigidBody);

    entities.push({ mesh: ground, body: groundRigidBody, rotationOffsets: [0, 0, 0], 
        positionOffsets: [0, 0, 0],});

    // Add a 3D model to the scene

    for (let i = 0; i < 10; i++) {

        addMeshWithBody({

            src: 'assets/pyramid.glb',
            position: {
                x: Math.random() * 10 - 5, 
                y: 100 + Math.random() * 10 - 5, 
                z: Math.random() * 10 - 5
            },
            rotationOffsets: [0, 0, 0],
            type: 'mesh',
            centered: true,
            helper: true

        });

    }

    for (let i = 0; i < 10; i++) {

        addMeshWithBody({

            src: 'assets/suzanne_blender_monkey.glb',
            position: {
                x: Math.random() * 10 - 5, 
                y: 100 + Math.random() * 10 - 5, 
                z: Math.random() * 10 - 5
            },
            rotationOffsets: [Math.PI / 2, 0, 0],
            helper: true,
            type: 'mesh'

        });

    }

    addMeshWithBody({

        src: 'assets/tree.glb',
        position: {
            x: 0,
            y: 0,
            z: 0
        },
        rotationOffsets: [0, 0, 0],
        type: 'static_mesh',
        centered: false,
        helper: true

    });

}