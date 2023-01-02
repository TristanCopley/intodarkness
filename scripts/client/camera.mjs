import { input_controller } from '../../entry.mjs';
import { camera } from '../../entry.mjs';
import * as THREE from 'three';

const euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
const vector = new THREE.Vector3();
const MIN_POLAR_ANGLE = 0; // radians
const MAX_POLAR_ANGLE = Math.PI; // radians
const PI_2 = Math.PI / 2;

const MOVEMENT_DECAY = 0.99;
const CAMERA_SPEED = 1.2;

const movement_falloff = (x, y) => {

    let magnitude = Math.sqrt(x * x + y * y) || 1;

    const w = -7;
    const h = -10;

    const magnitude_falloff = Math.pow(1.5, magnitude / w + 4) - 5 * h;

    return [x / magnitude_falloff, y / magnitude_falloff];

}

export function update_look_direction(dt) {

    // Get the mouse position
    let [mouse_x, mouse_y] = [input_controller.mouse_movement.x, input_controller.mouse_movement.y];

    euler.setFromQuaternion( camera.quaternion );

    [mouse_x, mouse_y] = movement_falloff(mouse_x, mouse_y);

    euler.y += mouse_y * CAMERA_SPEED;
    euler.x += mouse_x * CAMERA_SPEED;

    euler.x = Math.max( PI_2 - MAX_POLAR_ANGLE, Math.min( PI_2 - MIN_POLAR_ANGLE, euler.x ) );

    camera.quaternion.setFromEuler( euler );

    input_controller.mouse_movement.x *= MOVEMENT_DECAY ** dt;
    input_controller.mouse_movement.y *= MOVEMENT_DECAY ** dt;

}