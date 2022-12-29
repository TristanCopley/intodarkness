import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { camera, renderer } from '../entry.mjs';

export function initController() {

    camera.position.x = 25;
    camera.position.z = 75;
    camera.position.y = 50;

    const controls = new OrbitControls(camera, renderer.domElement);

}