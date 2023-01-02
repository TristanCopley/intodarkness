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

    models['player'] = await loader.loadAsync('assets/player.glb');
    set_mesh_properties(models['player'], {shadows: true});

    models['medkit'] = await loader.loadAsync('assets/medkit.glb');
    set_mesh_properties(models['medkit'], {shadows: true});

    models['gun'] = await loader.loadAsync('assets/gun.glb');
    set_mesh_properties(models['gun'], {shadows: true});

    models['small_flashlight'] = await loader.loadAsync('assets/small_flashlight.glb');
    set_mesh_properties(models['small_flashlight'], {shadows: true});

    models['revolver'] = await loader.loadAsync('assets/revolver.glb');
    set_mesh_properties(models['revolver'], {shadows: true});
    
    models['engine'] = await loader.loadAsync('assets/engine.glb');
    set_mesh_properties(models['engine'], {shadows: true});

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