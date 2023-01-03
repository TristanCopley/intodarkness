/* 
 * Imports 
 */
import './style.css'; // Import the CSS using VITE's CSS import
import { io } from "socket.io-client"; // Import socket.io -> needs to be moved to a separate file
import * as THREE from 'three'; // Import three.js
import * as CANNON from 'cannon-es'; // Import cannon-es
import { 
  EffectComposer, 
  RenderPass 
} from "postprocessing"; // Import postprocessing
import { 
  preload 
} from './scripts/initialization/preload.mjs'; // Import preload function
import { 
  generateMap 
} from './scripts/map/test.mjs'; // Import preload function
import { 
  _FOV,
  _ASPECT_RATIO 
} from './scripts/initialization/constants.mjs'; // Import constants
import Input_Controller from './scripts/controls/input_controller.mjs'; // Import input controller
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/*
 * Export global variables
 */
export let scene, camera, renderer, composer, game_objects, models, world, input_controller;

async function main() {

  /*
   * Initializes globals
   */
  scene = new THREE.Scene(); // Create the scene
  camera = new THREE.PerspectiveCamera( _FOV, _ASPECT_RATIO, 0.1, 1000 ); // Create the camera with FOV of 75 and aspect ratio 16:9
  renderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    antialias: false,
    stencil: false,
    depth: true // Enable depth buffer for objects
  }); // Create the renderer
  composer = new EffectComposer(renderer, {
    frameBufferType: THREE.HalfFloatType // Use half float type to enable HDR (Required for allowing low brightness objects to glow)
  }); // Create the postprocessing composer
  composer.addPass(new RenderPass(scene, camera)); // Add the render pass to the composer

  // Set up the renderer and append it to the DOM, also add a resize listener
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.domElement.id = 'game_canvas';
  document.body.appendChild( renderer.domElement );

  window.onresize = () => { renderer.setSize(window.innerWidth, window.innerHeight); };

  // Set up models and game_objects
  models = {};
  game_objects = {};

  // World
  world = new CANNON.World()

  // Tweak contact properties.
  // Contact stiffness - use to make softer/harder contacts
  world.defaultContactMaterial.contactEquationStiffness = 1e9;

  // Stabilization time in number of timesteps
  world.defaultContactMaterial.contactEquationRelaxation = 4;

  const solver = new CANNON.GSSolver();
  solver.iterations = 7;
  solver.tolerance = 0.1;
  world.solver = new CANNON.SplitSolver(solver);
  // use this to test non-split solver
  // world.solver = solver
  world.gravity.set(0, -20, 0);

  // Preload assets for use
  await preload();

  // Generate the map
  await generateMap();
  
  // input_controller = new Input_Controller();
  // input_controller.set_keybinds(
  //   {
  //     'move_forward': ['w', 'arrowup'],
  //     'move_backward': ['s', 'arrowdown'],
  //     'move_left': ['a', 'arrowleft'],
  //     'move_right': ['d', 'arrowright'],
  //     'jump': [' '],
  //     'sprint': ['shift'],
  //     'crouch': ['ctrl'],
  //     'attack': ['mouse0'],
  //   }
  // );
  
  camera.position.set(0, 20, 0);
  let controls = new OrbitControls(camera, renderer.domElement);

  // Instantiate timing objects
  let lastTime = 0;
  let dt = 0;

  function game_cycle(time = 0) { // Default time to 0 if not provided or undefined

    // Calculate the delta time
    dt = time - lastTime;
    lastTime = time;
    
    // Update physics
    world.step(0.002, dt, 1);

    for (let uuid in game_objects) {

      game_objects[uuid].mesh.position.copy(game_objects[uuid].body.position)
      game_objects[uuid].mesh.quaternion.copy(game_objects[uuid].body.quaternion)

    }

    // Render the scene
    composer.render(dt);

    // Request the next frame
    requestAnimationFrame(game_cycle);

  }

  // Start game cycle
  game_cycle();

};

main();

//HUD
//ATTACKING
//GETTING ATTACKED
//MOVING
//COLLIDING
//INTERPOLATION
//RENDERING ENTITIES
//RENDERING TERRAIN
//SOUND



//PhysicsLoader('ammo.js', () => MainScene())

// /*
//  * This is the entry point for the client
//  */
// export const client = {
//   inGame: false,
//   name: "",
//   id: ""
// };

// /*
//  * Connects to the server and listens for events with socket
//  */
// const socket = io("http://localhost:3000", {
//   withCredentials: true, // Required for CORS
//   origin: "http://127.0.0.1:5173",
//   extraHeaders: {
//     "z8phT6": "*" // Random string that matches the server's CORS policy
//   }
// });
// socket.on("connect", () => { // Log when the socket connects and disconnects
//   console.debug("Socket connected"); socket.emit('join-room', 'new'); // Joins a new room
//   socket.on("disconnect", () => {
//     console.warn("Socket disconnected");
//   });
// });

// /*
//  * Initialize the scene, camera, and renderer
//  */

// export let scene, camera, renderer, composer;

// const MainScene = () => {

// }

// // export const scene = new THREE.Scene();
// // export const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// // export const renderer = new THREE.WebGLRenderer({
// //   powerPreference: "high-performance",
// //   antialias: false,
// //   stencil: false,
// //   depth: true
// // });
// // export const composer = new EffectComposer(renderer, {
// //   frameBufferType: THREE.HalfFloatType
// // });
// // composer.addPass(new RenderPass(scene, camera));

// // renderer.setSize( window.innerWidth, window.innerHeight );
// // document.body.appendChild( renderer.domElement );

// // Resize the renderer when the window is resized
// window.addEventListener( 'resize', onWindowResize, false );
// function onWindowResize() { renderer.setSize( window.innerWidth, window.innerHeight ); };

// /*
//  * This is the animation / draw loop
//  */
// let lastTime = 0;
// let dt = 0;

// function draw(time = 0) {

//   // Calculate the delta time
//   dt = time - lastTime;
//   lastTime = time;



//   // Render the scene
//   composer.render(dt);

//   // Request the next frame
//   requestAnimationFrame( draw );

// }

// // Start the draw loop
// draw();


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