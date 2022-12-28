import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { camera, renderer } from '../entry.mjs';

export function initController() {

    camera.position.x = 50;
    camera.position.z = 125;
    camera.position.y = 100;

    const controls = new OrbitControls(camera, renderer.domElement);

}