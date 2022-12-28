import * as THREE from 'three';
import { scene, AMMO, physicsWorld, entities } from '../entry.mjs';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function initMap() {

    // Add a light to the scene
    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 5, 7);
    scene.add(light);

    let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add a plane to the scene
    let plane = new THREE.Mesh(
        new THREE.BoxGeometry(200, 2, 200),
        new THREE.MeshPhongMaterial({ color: 0x222222 })
    );
    plane.receiveShadow = true;
    scene.add(plane);

    // Adds ground rigid body to the scene
    let groundShape = new AMMO.btBoxShape(new AMMO.btVector3(100, 1, 100));
    let groundTransform = new AMMO.btTransform();
    groundTransform.setIdentity();
    groundTransform.setOrigin(new AMMO.btVector3(0, 0, 0));
    let groundMotionState = new AMMO.btDefaultMotionState(groundTransform);
    let groundInertia = new AMMO.btVector3(0, 0, 0);
    //cubeShape.calculateLocalInertia(1, groundInertia);
    let groundRigidBody = new AMMO.btRigidBody(
        new AMMO.btRigidBodyConstructionInfo(0, groundMotionState, groundShape, groundInertia)
    );
    physicsWorld.addRigidBody(groundRigidBody);
    entities.push({mesh: plane, body: groundRigidBody});

    // Add cube to the scene
    let cube = new THREE.Mesh(
        new THREE.BoxGeometry(10, 10, 10),
        new THREE.MeshPhongMaterial({ color: 0xffffff })
    );
    cube.position.set(0, 5, 0);
    cube.castShadow = true;
    scene.add(cube);

    // Adds cube rigid body to the scene
    let cubeShape = new AMMO.btBoxShape(new AMMO.btVector3(5, 5, 5));
    let cubeTransform = new AMMO.btTransform();
    cubeTransform.setIdentity();
    cubeTransform.setOrigin(new AMMO.btVector3(0, 70, 0));
    cubeTransform.setRotation(new AMMO.btQuaternion(1, 1, 0, 1));
    let cubeMotionState = new AMMO.btDefaultMotionState(cubeTransform);
    let cubeInertia = new AMMO.btVector3(0, 0, 0);
    cubeShape.calculateLocalInertia(1, cubeInertia);
    let cubeRigidBody = new AMMO.btRigidBody(
        new AMMO.btRigidBodyConstructionInfo(1, cubeMotionState, cubeShape, cubeInertia)
    );
    physicsWorld.addRigidBody(cubeRigidBody);
    entities.push({mesh: cube, body: cubeRigidBody});

    let loader = new GLTFLoader();
    loader.load('', (gltf) => {
        console.log(gltf);
    }, undefined, (error) => {
        console.error(error);
    });

}