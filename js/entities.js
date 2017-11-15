import Entity from './entity.js';
import Jump from './traits/jump.js';
import Go from './traits/go.js';
import {loadSpriteSheet} from './loader.js';
import {createAnimation} from './anim.js';

export function createMario(){
    return loadSpriteSheet('mario')
    .then(sprite => {
            const mario = new Entity();
            mario.size.set(14,16);

            mario.addTrait(new Go());
            mario.addTrait(new Jump());

            const runAnim = createAnimation(['run-1', 'run-2','run-3'], 10);

            function routeFrame(mario){
                if(mario.jump.falling){
                    return 'jump';
                }
                if(mario.go.distance > 0){
                    if((mario.vel.x > 0 && mario.go.dir < 0) || (mario.vel.x < 0 && mario.go.dir > 0))
                       return 'break';
                   return runAnim(mario.go.distance);
                }
                return 'idle';
            }

            mario.draw = function drawMario(context){
                sprite.draw(routeFrame(this),context, 0, 0, this.go.heading < 0);
            };
            return mario;
    });
}