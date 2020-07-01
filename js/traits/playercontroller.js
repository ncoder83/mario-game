import { Sides, Trait } from '../entity.js'
import { Vec } from '../math.js';

export default class PlayerController extends Trait {
    constructor() {
        super('playercontroller');
        this.checkpoint = new Vec(0, 0);
        this.player = null;
        this.time = 300;
        this.score = 0;
    }

    setPlayer(entity) {
        this.player = entity;
        this.player.stomper.events.listen('stomp', () => {
            this.score += 100;
        });
        // this.player.stomper.onStomp = () => {
        //     this.score +=100;
        // };
    }

    update(entity, { deltaTime }, level) {
        if (!level.entities.has(this.player)) {
            this.player.killable.revive();
            this.player.pos.set(64, 64);
            level.entities.add(this.player);
        }
        else {
            this.time -= deltaTime * 2;

        }
    }
}