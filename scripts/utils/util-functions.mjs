import * as THREE from 'three';
import { scene, physicsWorld, entities, AMMO } from '../../entry.mjs';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/*
 * Creates a NON-INSTANCED model entity with a physics body and adds it to the scene and physics world
 */ 

export function addModelEntity() {



}

function createCompoundShape(geometry) {
    // Create a compound shape to hold the convex hulls
    let compoundShape = new Ammo.btCompoundShape();
  
    // Get the vertices from the geometry
    let vertices = geometry.attributes.position.array;
  
    // Create a convex hull for each set of three vertices
    for (let i = 0; i < vertices.length; i += 9) {
      let hullVertices = [];
      for (let j = 0; j < 9; j += 3) {
        let x = vertices[i + j];
        let y = vertices[i + j + 1];
        let z = vertices[i + j + 2];
        hullVertices.push(new Ammo.btVector3(x, y, z));
      }
  
      // Create a convex hull from the vertices
      let convexHull = new Ammo.btConvexHullShape();
      convexHull.addPoint(hullVertices[0]);
      convexHull.addPoint(hullVertices[1]);
      convexHull.addPoint(hullVertices[2]);
      let margin = convexHull.getMargin();
      convexHull.setMargin(margin * 1.5);
  
      // Add the convex hull to the compound shape
      let transform = new Ammo.btTransform();
      transform.setIdentity();
      compoundShape.addChildShape(transform, convexHull);
    }
  
    return compoundShape;
  }