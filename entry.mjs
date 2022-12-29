// Imports
import { io } from "socket.io-client";
import './style.css';
import * as THREE from 'three';
import { initMap } from './scripts/map.mjs';
import { EffectComposer, RenderPass} from "postprocessing";
import { initController } from './scripts/controller.mjs';

/*
 * This is the entry point for the client
 */
export const client = {
  inGame: false,
  name: "",
  id: "",
  body: undefined,
};

/*
 * Connects to the server and listens for events with socket
 */
const socket = io("http://localhost:3000", {
  withCredentials: true, // Required for CORS
  origin: "http://127.0.0.1:5173",
  extraHeaders: {
    "z8phT6": "*" // Random string that matches the server's CORS policy
  }
});
socket.on("connect", () => { // Log when the socket connects and disconnects
  console.debug("Socket connected"); socket.emit('join-room', 'new');
  socket.on("disconnect", () => {
    console.warn("Socket disconnected");
  });
});

/*
 * Initialize the scene, camera, and renderer
 */

export const scene = new THREE.Scene();

export const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
export const renderer = new THREE.WebGLRenderer({
  powerPreference: "high-performance",
  antialias: false,
  stencil: false,
  depth: true
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
export const composer = new EffectComposer(renderer, {
  frameBufferType: THREE.HalfFloatType
});
composer.addPass(new RenderPass(scene, camera));

export let entities = [];

initController();

// Import the physics library then start the game
export let AMMO = null;
export let physicsWorld = null;

Ammo().then((Ammo) => {

  AMMO = Ammo;

  let collisionConfiguration  = new AMMO.btDefaultCollisionConfiguration(),
      dispatcher              = new AMMO.btCollisionDispatcher(collisionConfiguration),
      overlappingPairCache    = new AMMO.btDbvtBroadphase(),
      solver                  = new AMMO.btSequentialImpulseConstraintSolver();

  physicsWorld           = new AMMO.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
  physicsWorld.setGravity(new AMMO.btVector3(0, -1, 0));

  initMap();

});

/*
 * This is the animation / draw loop
 */
let lastTime = 0;
let dt = 0;

function draw(time = 0) {

  // Calculate the delta time
  dt = time - lastTime;
  lastTime = time;

  // Update the camera position and rotation via controller
  // Update the HUD
  // Update entities and their positions
  // Update other players and their positions

  // Update the physics world
  if (physicsWorld) {
    
    physicsWorld.stepSimulation( dt, 10 );

    for (let i = 0; i < entities.length; i++) {

      let entity = entities[i];
      let mesh = entity.mesh;
      let body = entity.body;

      if (body && mesh) {

        let ms = body.getMotionState();
        if (ms) {

          let transform = new AMMO.btTransform();
          ms.getWorldTransform(transform);
          let p = transform.getOrigin();
          let q = transform.getRotation();

          mesh.position.set(
            p.x(),
            p.y(),
            p.z()
          );

          mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
          mesh.rotateX(entity.rotationOffsets[0]);
          mesh.rotateY(entity.rotationOffsets[1]);
          mesh.rotateZ(entity.rotationOffsets[2]);
          mesh.translateOnAxis(new THREE.Vector3(...entity.positionOffsets), 1);

          if (entity.helper) {

            entity.helper.position.set(
              p.x(), 
              p.y(),
              p.z()
            );

            entity.helper.quaternion.set(q.x(), q.y(), q.z(), q.w());

          }

        }

      }

    }

  }

  // Render the scene
  composer.render(dt);

  // Request the next frame
  requestAnimationFrame( draw );

}

// Start the draw loop
draw();


/*
import './style.css';
import * as THREE from 'three';
import { Socket } from 'socket.io-client';

import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { updateHud } from './scripts/hud';

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );
scene.fog = new THREE.FogExp2( 0x000000, 0.06 );
export const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
	powerPreference: "high-performance",
	antialias: false,
	stencil: false,
	depth: false
});

renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.shadowMap.autoUpdate = false;
renderer.shadowMap.needsUpdate = true;
renderer.shadowMap.enabled = true;

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let light = new THREE.DirectionalLight( 0xffffff, 10 );
light.position.set( 0, 10, 1 );
scene.add( light );

let trees = [];

// add tree model
const loader = new GLTFLoader();
loader.load( './public/assets/tree.glb', function ( gltf ) {
  gltf.scene.traverse( function ( child ) {
    if ( child.isMesh ) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  } );

  for (let i = 0; i < 100; i++) {

    let tree = new THREE.Mesh(

      gltf.scene.children[0].geometry,
      new THREE.MeshPhongMaterial({ color: 0x222222 })
    );

    tree.position.set(Math.random() * 100 - 50, 0, Math.random() * 100 - 50);

    trees.push( tree )
    scene.add( trees[trees.length - 1] );

  }

}, undefined, function ( error ) {
  console.error( error );
} );

// add table model
loader.load( './public/assets/table.glb', function ( gltf ) {
  gltf.scene.traverse( function ( child ) {
    if ( child.isMesh ) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  } );

  let table = new THREE.Mesh(
    gltf.scene.children[0].geometry,
    new THREE.MeshPhongMaterial({ color: 0x222222 })
  );

  table.position.set(0, 10, 0);

  scene.add( table );

}, undefined, function ( error ) {
    console.error( error );
  } );

export let flight = new THREE.Mesh();

  // add table model
loader.load( './public/assets/big_flashlight.glb', function ( gltf ) {
  gltf.scene.traverse( function ( child ) {
    if ( child.isMesh ) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  } );

  flight.geometry = gltf.scene.children[0].geometry;
  flight.material = new THREE.MeshPhongMaterial({ color: 0x222222 });

  scene.add( flight );

}, undefined, function ( error ) {
    console.error( error );
  } );

camera.position.z = 25;

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshPhongMaterial({ color: 0x222222 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const composer = new EffectComposer(renderer, {
  frameBufferType: THREE.HalfFloatType
});

composer.addPass(new RenderPass(scene, camera));

composer.addPass(new EffectPass(camera, new BloomEffect(
  {
    luminanceThreshold: 1,
    luminanceSmoothing: 0,
    intensity: 0.05,
    mipmapBlur: true

  }
)));

composer.addPass(new EffectPass(camera, new BloomEffect(
  {
    luminanceThreshold: 0,
    luminanceSmoothing: 0.1,
    intensity: 0.4,
    mipmapBlur: false

  }
)));

const controls = new OrbitControls(camera, renderer.domElement);

requestAnimationFrame(function render() {

  updateHud();

	requestAnimationFrame(render);
	composer.render();

});
*/