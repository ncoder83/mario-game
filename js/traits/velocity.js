import { Trait } from '../Entity.js'

export default class Velocty extends Trait {
    constructor() {
        super('velocity');
    }

    update(entity, { deltaTime }, level) {
        entity.pos.x += entity.vel.x * deltaTime;
        entity.pos.y += entity.vel.y * deltaTime;
    }
}