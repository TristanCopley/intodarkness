const movement_history = [];

export default class Input_Controller {

    constructor() {

        // Maps key codes to pressed actions
        this.key_map = {};

        // Object containing the state of all pressed keys
        this.pressed = {};

        // Cumulative mouse movement
        this.mouse_movement = { x: 0, y: 0 };

        this.pointer_lock_bug = true; // Some microsoft and google browsers have a bug where pointer lock causes mouse jumping/jittering
        this.buffer_length = 3; // The number of frames to check for mouse jittering

        // Listen for key presses
        document.addEventListener('keydown', (event) => { this.key_down(event) }, false);
        document.addEventListener('keyup', (event) => { this.key_up(event) }, false);

        // Listen for mouse 
        document.addEventListener('mousedown', (event) => { this.mouse_down(event) }, false);
        document.addEventListener('mouseup', (event) => { this.mouse_up(event) }, false);
        document.addEventListener('mousemove', (event) => { this.mouse_move(event) }, false);

    }

    set_keybinds(key_binds) {

        // Set the keybinds in key_map
        for (let action in key_binds) {

            for (let key of key_binds[action]) {

                this.key_map[key] = action;

            }

        }

        // Set the pressed keys to false
        for (let action in key_binds) this.pressed[action] = false;

    }

    key_down(event) {

        const key = event.key.toLowerCase();
        if (this.key_map[key]) this.pressed[this.key_map[key]] = true;

    }

    key_up(event) {

        const key = event.key.toLowerCase();
        if (this.key_map[key]) this.pressed[this.key_map[key]] = false;

    }

    mouse_down(event) {

        if (document.pointerLockElement !== document.getElementById('game_canvas')) document.getElementById('game_canvas').requestPointerLock(); // Move to a better place later

        const key = `mouse${event.button}`;
        if (this.key_map[key]) this.pressed[this.key_map[key]] = true;

    }

    mouse_up(event) {

        const key = `mouse${event.button}`;
        if (this.key_map[key]) this.pressed[this.key_map[key]] = false;

    }

    mouse_move(event) {

        if ( document.pointerLockElement !== document.getElementById('game_canvas')) return;

        let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        if (this.pointer_lock_bug) {
            
            let dist = Math.sqrt(movementX * movementX + movementY * movementY);

            movement_history.push({
                mag: dist,
                x: movementX,
                y: movementY
            }); // Push the movement to the history

            if (movement_history.length < this.buffer_length) return; // Wait until the buffer is full

            if ((movement_history[0].mag + movement_history[2].mag + 50) < movement_history[1].mag || movement_history[1].mag > 100) {
                
                movementX = (movement_history[0].x + movement_history[2].x) / 2;
                movementY = (movement_history[0].y + movement_history[2].y) / 2;
                
                movement_history[1].x = movementX;
                movement_history[1].y = movementY;
                movement_history[1].mag = Math.sqrt(movementX * movementX + movementY * movementY);

            } else {

                movementX = movement_history[1].x;
                movementY = movement_history[1].y;

            }

            // Finally clear oldest sample
            if (movement_history.length >= this.buffer_length) movement_history.shift();

        }

        this.mouse_movement.y -= movementX * 0.002;
        this.mouse_movement.x -= movementY * 0.002;

    }

}