import * as THREE from 'three'
import { camera, game_objects, input_controller, physics } from '../../entry.mjs';
import { _PLAYER_SPEED } from '../initialization/constants.mjs';

export function move_player(dt) {

    let x = +input_controller.pressed['move_forward'] - +input_controller.pressed['move_backward'];
    let z = +input_controller.pressed['move_right'] - +input_controller.pressed['move_left'];

    let camera_direction = camera.getWorldDirection(new THREE.Vector3());

    let forward = x * camera_direction.z + z * camera_direction.x;
    let lateral = x * camera_direction.x - z * camera_direction.z;

    let movement = new THREE.Vector3(lateral * _PLAYER_SPEED, 0 * _PLAYER_SPEED, forward * _PLAYER_SPEED);
    game_objects.player.body.applyForce(movement.x, movement.y, movement.z);

    camera.position.set(game_objects.player.body.position.x, game_objects.player.body.position.y + 20, game_objects.player.body.position.z);

    if (Math.random() < 0.1) {
        const raycaster = physics.add.raycaster('allHits');
        raycaster.setRayFromWorld(game_objects.player.body.position.x, game_objects.player.body.position.y, game_objects.player.body.position.z)
        raycaster.setRayToWorld(game_objects.player.body.position.x, game_objects.player.body.position.y - 20, game_objects.player.body.position.z)
        raycaster.rayTest()

        if (raycaster.hasHit()) {
            //console.log(raycaster)
            console.log(raycaster.getHitPointsWorld())
        }

        // destroy the raycaster if you do not use it anymore
        // (but you can of course reuse it multiple times)
        raycaster.destroy()
    }


}