import * as THREE from 'three';
import { scene, physicsWorld, entities, AMMO } from '../../entry.mjs';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import { Entity } from './util-classes.mjs';
import { Player } from '../player/player.mjs';

/*
 * Creates a model entity with a physics body and adds it to the scene and physics world
 */ 

export function addMeshWithBody(options = {}) {

  let {

    src = null,
    position = {x: 0, y: 0, z: 0}, 
    rotation = {x: 0, y: 0, z: 0},
    rotationOffsets = [0, 0, 0],
    centered = true,
    helper = false,
    scale = {x: 1, y: 1, z: 1},
    mass = 1, 
    friction = 0.5,
    restitution = 0.3,
    type = 'mesh', // mesh, box or sphere
    uuid = crypto.randomUUID(),
    lockRotation = false,
    isPlayer = false

  } = options;

  if (src === null) return console.error('No src provided');

  let loader = new GLTFLoader();
  loader.load(src, (gltf) => {

    const box = new THREE.Box3().setFromObject( gltf.scene );
    const center = box.getCenter( new THREE.Vector3() );
      
    // Add the model to the scene
    let model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(scale.x, scale.y, scale.z);
    scene.add(model);

    // Get all meshes in the model
    let meshes = [];

    model.traverse((child) => {
      if (child.isMesh) {
        meshes.push(child);
      }
    });

    let bbox = new THREE.Box3().setFromObject(model);

    let modelVertices = meshes[0].geometry.attributes.position.array;
    meshes[0].geometry.verticesNeedUpdate = true;

    if (type === 'box') {

      const shape = new AMMO.btBoxShape(new AMMO.btVector3((bbox.max.x - bbox.min.x) / 2, (bbox.max.y - bbox.min.y) / 2, (bbox.max.z - bbox.min.z) / 2));

      shape.getMargin(0.1);

      // Scale the shape of the rigid body
      let modelScale = new AMMO.btVector3(scale.x, scale.y, scale.z);
      shape.setLocalScaling(modelScale);

      let modelTransform = new AMMO.btTransform();
      modelTransform.setIdentity();
      modelTransform.setOrigin(new AMMO.btVector3(position.x, position.y, position.z));
      let rotationQuaternion = new AMMO.btQuaternion();
      rotationQuaternion.setEulerZYX(rotation.x, rotation.y, rotation.z);
      modelTransform.setRotation(rotationQuaternion);
      let modelMass = mass;
      let modelLocalInertia = new AMMO.btVector3(0, 0, 0);
      shape.calculateLocalInertia(modelMass, modelLocalInertia);
      let modelMotionState = new AMMO.btDefaultMotionState(modelTransform);
      let modelRigidBodyCI = new AMMO.btRigidBodyConstructionInfo(modelMass, modelMotionState, shape, modelLocalInertia);
      let modelRigidBody = new AMMO.btRigidBody(modelRigidBodyCI);
      if (lockRotation) modelRigidBody.setAngularFactor(new AMMO.btVector3(0, 0, 0));
      modelRigidBody.setFriction(friction);
      modelRigidBody.setRestitution(restitution);
      physicsWorld.addRigidBody(modelRigidBody);

      let opts = {
        mesh: model,
        body: modelRigidBody,
        rotationOffsets: rotationOffsets,
        positionOffsets: [-center.x, -center.y, -center.z],
      }
      let entity = isPlayer ? new Player(opts) : new Entity(opts);

      if (helper) {

        entity.helper = new THREE.Mesh(new THREE.BoxGeometry(bbox.max.x - bbox.min.x, bbox.max.y - bbox.min.y, bbox.max.z - bbox.min.z), new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true}));
        scene.add(entity.helper);

      }

      entities[uuid] = entity;

      return;

    }

    // Create triangles for triangle mesh from vertices
    let triangles = [];
    for (let i = 0; i < modelVertices.length; i += 3) {
      triangles.push({
        x:modelVertices[i], 
        y:modelVertices[i + 1], 
        z:modelVertices[i + 2]
      });
    }

    // Create a triangle mesh
    let triangle, triangleMesh = new AMMO.btTriangleMesh();
    let vecA = new AMMO.btVector3(0, 0, 0);
    let vecB = new AMMO.btVector3(0, 0, 0);
    let vecC = new AMMO.btVector3(0, 0, 0);

    for (let i = 0; i < triangles.length - 3; i += 3) {

      vecA.setX(triangles[i].x);
      vecA.setY(triangles[i].y);
      vecA.setZ(triangles[i].z);

      vecB.setX(triangles[i + 1].x);
      vecB.setY(triangles[i + 1].y);
      vecB.setZ(triangles[i + 1].z);

      vecC.setX(triangles[i + 2].x);
      vecC.setY(triangles[i + 2].y);
      vecC.setZ(triangles[i + 2].z);

      triangleMesh.addTriangle(vecA, vecB, vecC);

    }

    AMMO.destroy(vecA);
    AMMO.destroy(vecB);
    AMMO.destroy(vecC);

    if (type === 'static_mesh') {

      const shape = new AMMO.btBvhTriangleMeshShape(triangleMesh, true, true);

      shape.getMargin(0.1);

      // Scale the shape of the rigid body
      let modelScale = new AMMO.btVector3(scale.x, scale.y, scale.z);
      shape.setLocalScaling(modelScale);

      let modelTransform = new AMMO.btTransform();
      modelTransform.setIdentity();
      modelTransform.setOrigin(new AMMO.btVector3(position.x, position.y, position.z));
      let rotationQuaternion = new AMMO.btQuaternion();
      rotationQuaternion.setEulerZYX(rotation.x, rotation.y, rotation.z);
      modelTransform.setRotation(rotationQuaternion);
      let modelMass = 0;
      let modelLocalInertia = new AMMO.btVector3(0, 0, 0);
      shape.calculateLocalInertia(modelMass, modelLocalInertia);
      let modelMotionState = new AMMO.btDefaultMotionState(modelTransform);
      let modelRigidBodyCI = new AMMO.btRigidBodyConstructionInfo(modelMass, modelMotionState, shape, modelLocalInertia);
      let modelRigidBody = new AMMO.btRigidBody(modelRigidBodyCI);
      modelRigidBody.setFriction(friction);
      if (lockRotation) modelRigidBody.setAngularFactor(new AMMO.btVector3(0, 0, 0));
      modelRigidBody.setRestitution(restitution);
      physicsWorld.addRigidBody(modelRigidBody);

      let opts = {
        mesh: model,
        body: modelRigidBody,
        rotationOffsets: rotationOffsets,
        positionOffsets: [-center.x, -center.y, -center.z],
      }
      let entity = isPlayer ? new Player(opts) : new Entity(opts);

      if (!centered) entity.positionOffsets = [0, 0, 0];

      if (helper) {

        const geometry = meshes[0].geometry;
        const material = new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true } );

        entity.helper = new THREE.Mesh( geometry, material );
        
        scene.add(entity.helper);

      }

      entities[uuid] = entity;

      return;

    }

    // Create a convex shape from the triangle mesh
    const shape = new AMMO.btConvexTriangleMeshShape(triangleMesh);
    shape.getMargin(0.1);

    // Scale the shape of the rigid body
    let modelScale = new AMMO.btVector3(scale.x, scale.y, scale.z);
    shape.setLocalScaling(modelScale);

    let modelTransform = new AMMO.btTransform();
    modelTransform.setIdentity();
    modelTransform.setOrigin(new AMMO.btVector3(position.x, position.y, position.z));
    let rotationQuaternion = new AMMO.btQuaternion();
    rotationQuaternion.setEulerZYX(rotation.x, rotation.y, rotation.z);
    modelTransform.setRotation(rotationQuaternion);
    let modelMass = mass;
    let modelLocalInertia = new AMMO.btVector3(0, 0, 0);
    shape.calculateLocalInertia(modelMass, modelLocalInertia);
    let modelMotionState = new AMMO.btDefaultMotionState(modelTransform);
    let modelRigidBodyCI = new AMMO.btRigidBodyConstructionInfo(modelMass, modelMotionState, shape, modelLocalInertia);
    let modelRigidBody = new AMMO.btRigidBody(modelRigidBodyCI);
    modelRigidBody.setFriction(friction);
    if (lockRotation) modelRigidBody.setAngularFactor(new AMMO.btVector3(0, 0, 0));
    modelRigidBody.setRestitution(restitution);
    physicsWorld.addRigidBody(modelRigidBody);

    let opts = {
      mesh: model,
      body: modelRigidBody,
      rotationOffsets: rotationOffsets,
      positionOffsets: [-center.x, -center.y, -center.z],
    }
    let entity = isPlayer ? new Player(opts) : new Entity(opts);

    if (!centered) entity.positionOffsets = [0, 0, 0];

    if (helper) {

      let points = [];
      for (var i = 0; i < modelVertices.length; i+=3) {
        points.push(new THREE.Vector3(modelVertices[i], modelVertices[i+1], modelVertices[i+2]));
      }

      const geometry = new ConvexGeometry( points );
      const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );

      entity.helper = new THREE.Mesh( geometry, material );
      
      scene.add(entity.helper);

    }

    entities[uuid] = entity;

  }, undefined, (error) => {
      console.error(error);
  });

}

export function addMeshWithoutPhysics(options = {}) {

  let {
    src = null,
    position = {x: 0, y: 0, z: 0}, 
    rotation = {x: 0, y: 0, z: 0},
    centered = true,
    scale = {x: 1, y: 1, z: 1},
    uuid = crypto.randomUUID()
  } = options;

  let loader = new GLTFLoader();
  loader.load(src, (gltf) => {

    const box = new THREE.Box3().setFromObject( gltf.scene );
    const center = box.getCenter( new THREE.Vector3() );

    let model = gltf.scene;
    model.position.set(position.x, position.y, position.z);
    model.rotation.set(rotation.x, rotation.y, rotation.z);
    model.scale.set(scale.x, scale.y, scale.z);

    scene.add(model);

    let entity = new Entity({
      mesh: model, 
      body: null, 
      rotationOffsets: [0, 0, 0], 
      positionOffsets: [-center.x, -center.y, -center.z]
    });

    if (!centered) entity.positionOffsets = [0, 0, 0];

    entities[uuid] = entity;

  }, undefined, (error) => {

    console.error(error);

  });

}

export function updateEntities() {

  for (let id in entities) {

    let entity = entities[id];
    let mesh = entity.mesh;
    let body = entity.body;

    if (body && mesh) {

      let ms = body.getMotionState();
      if (ms) {

        let transform = new AMMO.btTransform(); // Invoking new transforms must be cleaned up with destroy
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

        AMMO.destroy(transform);

      }

    }

  }

}