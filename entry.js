import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,
  origin: "http://127.0.0.1:5173",
  extraHeaders: {
    "8phT6": "*"
  }
});

socket.on("connect", () => {

  console.log("connected");

  socket.on("disconnect", () => {

    console.log("disconnected");

  });

});

socket.on("message", (data) => {

  console.log(data);

});

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