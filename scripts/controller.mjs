import { camera, renderer } from '../entry.mjs';
import * as THREE from 'three'

const _PI_2 = Math.PI / 2;
const _euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
const minPolarAngle = 0; // radians
const maxPolarAngle = Math.PI; // radians

let prevX = 0;
let prevY = 0;

export class InputController {

    constructor() {

        this.relation = {};
        this.pressing = {};

        this.mouseSensitivity = 0.3;

        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));

        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));

        window.addEventListener('mousemove', this.onMouseMove.bind(this));

        document.addEventListener('pointerlockchange', this.onPointerLockChange.bind(this));

        this.pointerLockInfo = {

            locked: false,
            unlockedAt: 0

        }
        
    }

    onPointerLockChange() {

        if (document.pointerLockElement === renderer.domElement) {

            this.pointerLockInfo.locked = true;

        } else {

            this.pointerLockInfo.locked = false;

        }
    
    }

    updateKeybinds(keybinds) {

        this.relation = {};

        // Creates the binds object with boolean value for which action is being performed
        for (let key in keybinds) {

            this.pressing[key] = false;

        }

        // Creates the relation object which maps keybinds to actions
        for (let key in keybinds) {

            for (let keybind of keybinds[key]) {

                this.relation[keybind] = key;

            }

        }

    }

    onKeyDown(event) {

        let keyPressed = event.key.toLowerCase();
        if (this.relation[keyPressed]) this.pressing[this.relation[keyPressed]] = true;

    }

    onKeyUp(event) {

        let keyPressed = event.key.toLowerCase();
        if (this.relation[keyPressed]) this.pressing[this.relation[keyPressed]] = false;

    }

    onMouseDown(event) {

        // May need to be fixed for Mozilla
        if (!this.pointerLockInfo.locked) renderer.domElement.requestPointerLock();

        let keyPressed = `mouse${event.button}`;
        if (this.relation[keyPressed]) this.pressing[this.relation[keyPressed]] = false;
  
    }

    onMouseUp(event) {

        let keyPressed = `mouse${event.button}`;
        if (this.relation[keyPressed]) this.pressing[this.relation[keyPressed]] = false;

    }

    onMouseMove(event) {

        if (!this.pointerLockInfo.locked) return;

        let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        if (Math.sqrt(movementX * movementX + movementY * movementY) - 40 > 10 * Math.sqrt(prevX * prevX + prevY * prevY)) { // Weird mouse movement glitch with pointer lock API and Chrome
        
            console.log('Detect mouse jitter (anomaly)', movementX, movementY)
            movementX = prevX;
            movementY = prevY;

        } else {

            prevX = movementX;
            prevY = movementY;

        }

        _euler.setFromQuaternion( camera.quaternion );

        _euler.y -= movementX * 0.002 * this.mouseSensitivity;
        _euler.x -= movementY * 0.002 * this.mouseSensitivity;

        _euler.x = Math.max( _PI_2  - maxPolarAngle, Math.min( _PI_2  - minPolarAngle, _euler.x ) );

        camera.quaternion.setFromEuler( _euler );

    }

}


export function initController() {

    camera.position.x = 5;
    camera.position.z = 5;
    camera.position.y = 25;

    camera.aspect = 16 / 9; // LOCKED TO 16:9 to prevent players seeing more than they should
    camera.updateProjectionMatrix();

}
