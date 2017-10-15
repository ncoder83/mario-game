import Entity from './entity.js';
import {loadMarioSprite} from './sprite.js';

import Velocity from './traits/velocity.js';
import Jump from './traits/jump.js';
import Go from './traits/go.js';


export function createMario(){
    return loadMarioSprite().then(sprite => {
            const mario = new Entity();
            mario.size.set(16,14);
            mario.addTrait(new Go());
            mario.addTrait(new Jump());
            mario.addTrait(new Velocity());

            mario.draw = function drawMario(context){
                sprite.draw('idle',context,  this.pos.x , this.pos.y);
            };
            return mario;
    });
}