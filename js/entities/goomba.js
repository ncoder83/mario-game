import Entity, {Trait} from '../entity.js';
import {loadSpriteSheet} from '../loaders/sprite.js';
import PendulumWalk from '../traits/pendulumWalk.js';
import Killable from '../traits/killable.js';
import Solid from '../traits/solid.js';
import Physics from '../traits/physics.js';


export function loadGoomba(){
    return loadSpriteSheet('goomba')
    .then(createGoombaFactory);
}


class Behavior extends Trait{
    constructor(){
        super('behavior');
    }

    collides(us, them){
        if(us.killable.dead)
            return;

        if(them.stomper){
            if(them.vel.y > us.vel.y){
                us.killable.kill();
                us.pendulum.speed = 0;
            }
            else{
                them.killable.kill();
            }
        }
    }
}

function createGoombaFactory(sprite){

    const walkAnim = sprite.animations.get('walk');
    
    function routeAnim(goomba){
        if(goomba.killable.dead){
            return 'flat';
        }
        return walkAnim(goomba.lifetime);
    }

    function drawGoomba(context){
        sprite.draw(routeAnim(this), context,0,0);
    }

    return function createGoomba(){
        const goomba = new Entity();
        goomba.size.set(16,16);

        goomba.addTrait(new Physics());
        goomba.addTrait(new Solid());
        goomba.addTrait(new PendulumWalk());
        goomba.addTrait(new Behavior());
        goomba.addTrait(new Killable());
        goomba.draw = drawGoomba;
        
        return goomba;
    };
}