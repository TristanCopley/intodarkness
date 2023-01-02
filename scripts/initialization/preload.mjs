import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { models } from '../../entry.mjs';

export async function preload() {

    // Load models
    const loader = new GLTFLoader();
    models['suzanne'] = await loader.loadAsync('assets/suzanne.glb');
    set_mesh_properties(models['suzanne'], {shadows: true});

    models['platform'] = await loader.loadAsync('assets/platform.glb');
    set_mesh_properties(models['platform'], {shadows: true});

    return true;

}

function set_mesh_properties(model, options = {}) {

    model.scene.traverse(function (child) {

        if (child.isMesh) {

            if (options.shadows === true) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        }

    });

}