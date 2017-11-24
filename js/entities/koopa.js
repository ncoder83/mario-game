import Entity, {Sides} from '../entity.js';
import PendulumWalk from '../traits/pendulumWalk.js';
import {loadSpriteSheet} from '../loader.js';


export function loadKoopa(){
    return loadSpriteSheet('koopa')
    .then(createKoopaFactory);
}

function createKoopaFactory(sprite){

    const walkAnim = sprite.animations.get('walk');

    function drawKoopa(context){
        sprite.draw(walkAnim(this.lifetime), context,0,0, this.vel.x < 0);
    }

    return function createkoopa(){
        const koopa = new Entity();
        koopa.size.set(16,24);
        koopa.offset.y = - 8;

        koopa.addTrait(new PendulumWalk());
        koopa.draw = drawKoopa;
        
        return koopa;
    };
}