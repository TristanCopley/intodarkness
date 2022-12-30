import { AMMO, scene, physicsWorld, entities, inputController, camera } from '../../entry.mjs';
import { Entity } from '../utils/util-classes.mjs';
import { addMeshWithBody } from '../utils/util-functions.mjs';

export class Player extends Entity {

    constructor(options = {}) {

        super(options);

        this.mesh = options.mesh || null;
        this.body = options.body || null;
        this.helper = options.helper || null;
        this.positionOffsets = options.positionOffsets || [0, 0, 0];
        this.rotationOffsets = options.rotationOffsets || [0, 0, 0];
        this.uuid = options.uuid || 'player';
        this.movementSpeed = 0.5;

    }

    update() {

        this.body.activate();

        let perpendicularMagnitude = (+inputController.pressing['forward'] - +inputController.pressing['backward']) * this.movementSpeed;
        let parralelMagnitude = (+inputController.pressing['right'] - +inputController.pressing['left']) * this.movementSpeed;

        console.log(perpendicularMagnitude, parralelMagnitude)

        this.body.applyCentralImpulse(new AMMO.btVector3(
            parralelMagnitude, 
            0, 
            perpendicularMagnitude
        ));

    }

}

export function initPlayer(options = {}) {

    // Create player

    addMeshWithBody({
        src: 'assets/player.glb',
        position: { x: 0, y: 24, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        mass: 10,
        friction: 0.5,
        restitution: 0.3,
        uuid: 'player',
        lockRotation: false,
        isPlayer: true
    });

}

export function updatePlayer() {

    let player = entities['player'];

    if (player) {

        player.update();

    }

}