import Entity from './entity.js';
import {loadMarioSprite} from './sprite.js';

export function createMario(){
    return loadMarioSprite().then(sprite => {
            const mario = new Entity();
         

            mario.update = function updateMario(deltaTime){
                this.pos.x += this.vel.x * deltaTime;
                this.pos.y += this.vel.y * deltaTime;
            };

            mario.draw = function drawMario(context){
                sprite.draw('idle',context,  this.pos.x , this.pos.y);
            };
            return mario;
    });
}