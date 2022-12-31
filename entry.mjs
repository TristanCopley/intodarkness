// Imports
import { io } from "socket.io-client";
import './style.css';
import * as THREE from 'three';
import { EffectComposer, RenderPass } from "postprocessing";
import { AmmoPhysics, PhysicsLoader } from '@enable3d/ammo-physics';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Use gulp to strip debug console.log from production build

// Add models must be centered on origin in blender

// Loads pysics then runs main
PhysicsLoader('./ammo', () => { main() });

async function addModel(scene, physics) {

  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync('assets/bowie_knife.glb');

  const model = gltf.scene;
  const box = new THREE.Box3().setFromObject( model );

  model.scale.set(1, 1, 1);
  model.position.y = 5;

  model.traverse((child) => {

    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }

  });

  scene.add(model);
  model.position.y = 14;
  physics.add.existing(model, { shape: 'hull', mass: 1, width: box.max.x - box.min.x, height: box.max.y - box.min.y, depth: box.max.z - box.min.z });

}

function main() {

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const cube = new THREE.Mesh( geometry, material );
  scene.add( cube );
  cube.position.y = 10;

  cube.rotateX(0.5);

  const groundGeometry = new THREE.BoxGeometry( 10, 1, 10 );
  const groundMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const ground = new THREE.Mesh( groundGeometry, groundMaterial );
  scene.add( ground );
  ground.position.y = -2;

  camera.position.x = 10;
  camera.position.z = 10;
  camera.position.y = 10;

  const controls = new OrbitControls(camera, renderer.domElement);

  camera.lookAt(ground.position);

  const physics = new AmmoPhysics(scene);
  physics.debug.enable(true);

  physics.add.existing(cube, { shape: 'box', mass: 1 });
  physics.add.existing(ground, { shape: 'box', mass: 0, width: 10, height: 1, depth: 10 }); // Specify dimensions for some reason

  addModel(scene, physics)

  function animate() {
    requestAnimationFrame( animate );

    // update physics
    physics.update(7)
    // update the physics debugger
    physics.updateDebugger()

    renderer.render( scene, camera );
  };

  animate();

}


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