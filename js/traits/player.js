import Trait  from '../Trait.js';
import Stomper from './Stomper.js';

const COIN_MAX_THRESHOLD = 100;

export default class Player extends Trait {
    constructor() {
        super();
        this.name = 'UNNAMMED';
        this.coins = 0;
        this.lives = 3;
        this.score = 0;

        this.listen(Stomper.EVENT_STOMP, () => {
            this.score += 100;
        });
    }

    addCoins(count){
        this.coins += count;
        this.queue(entity => entity.sounds.add('coin'));
        while (this.coins >= COIN_MAX_THRESHOLD){
            this.addLife(1);
            this.coins -= COIN_MAX_THRESHOLD;
        }
    }

    addLife(count){
        this.lives += count;
    }
}