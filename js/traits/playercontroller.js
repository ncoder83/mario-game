import { Trait } from '../entity.js'
import { Vec } from '../math.js';

export default class PlayerController extends Trait {
    constructor() {
        super('playercontroller');
        this.checkpoint = new Vec(0, 0);
        this.player = null;
        this.time = 300;
        this.score = 0;

        this.listen('stomp', () => {
            this.score += 100;
        });

    }

    setPlayer(entity) {
        this.player = entity;

    }

    update(entity, { deltaTime }, level) {
        if (!level.entities.has(this.player)) {
            this.player.killable.revive();
            this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
            level.entities.add(this.player);
        }
        else {
            this.time -= deltaTime * 2;
        }
    }
}