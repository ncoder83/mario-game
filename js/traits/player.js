import { Trait } from '../entity.js'
import Stomper from './stomper.js';

export default class Player extends Trait {
    constructor() {
        super('player');
        this.name = 'UNNAMMED';
        this.coins = 0;
        this.lives = 3;
        this.score = 0;

        this.listen(Stomper.EVENT_STOMP, () => {
            this.score += 100;
        });
    }
}