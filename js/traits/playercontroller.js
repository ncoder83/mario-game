import Trait  from '../Trait.js';

import { Vec } from '../math.js';
import Killable from './Killable.js';

export default class PlayerController extends Trait {
    constructor() {
        super();
        this.checkpoint = new Vec(0, 0);
        this.player = null;
    }

    setPlayer(entity) {
        this.player = entity;
    }

    update(entity, { deltaTime }, level) {
        if (!level.entities.has(this.player)) {
            this.player.traits.get(Killable).revive();
            this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
            level.entities.add(this.player);
        }
    }
}