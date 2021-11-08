import Entity from '../Entity.js';
import Trait  from '../Trait.js';

import { loadSpriteSheet } from '../loaders/sprite.js';
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';
import PendulumWalk from '../traits/PendulumWalk.js';


export function loadBowser() {
    return loadSpriteSheet('bowser')
        .then(createBowserFactory);
}

class Behavior extends Trait {
    constructor() {
        super('behavior');
    }

    collides(us, them) {
        if (us.traits.get(Killable).dead)
            return;

        if (them.stomper) {
            if (them.vel.y > us.vel.y) {
                us.traits.get(Killable).kill();
                us.traits.get(PendulumWalk).speed = 0;
            }
            else {
                them.traits.get(Killable).kill();
            }
        }
    }
}

function createBowserFactory(sprite) {

    const walkAnim = sprite.animations.get('walk');

    function routeAnim(bowser) {
        if (bowser.traits.get(Killable).dead) {
            return 'walk';
        }
        return walkAnim(bowser.lifetime);
    }

    function drawBowser(context) {
        sprite.draw(routeAnim(this), context, 0, 0);
    }

    return function createBowser() {
        const bowser = new Entity();
        bowser.size.set(34, 34);

        bowser.addTrait(new Physics());
        bowser.addTrait(new Solid());
        bowser.addTrait(new PendulumWalk());
        bowser.addTrait(new Behavior());
        bowser.addTrait(new Killable());
        bowser.draw = drawBowser;

        return bowser;
    };
}