export class Entity {
    constructor(options = {}) {

        this.mesh = options.mesh || null;
        this.body = options.body || null;
        this.helper = options.helper || null;
        this.positionOffsets = options.positionOffsets || [0, 0, 0];
        this.rotationOffsets = options.rotationOffsets || [0, 0, 0];
 
    }
}