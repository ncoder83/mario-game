import Entity, { Sides, Trait } from '../entity.js';
import { loadSpriteSheet } from '../loaders/sprite.js';
import Killable from '../traits/killable.js';
import Solid from '../traits/solid.js';
import Physics from '../traits/physics.js';


export function loadBowser() {
    return loadSpriteSheet('bowser')
        .then(createBowserFactory);
}

class Behavior extends Trait {
    constructor() {
        super('behavior');
    }

    collides(us, them) {
        if (us.killable.dead)
            return;

        if (them.stomper) {
            if (them.vel.y > us.vel.y) {
                us.killable.kill();
                us.pendulum.speed = 0;
            }
            else {
                them.killable.kill();
            }
        }
    }
}

function createBowserFactory(sprite) {

    const walkAnim = sprite.animations.get('walk');

    function routeAnim(bowser) {
        if (bowser.killable.dead) {
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
        //bowser.addTrait(new PendulumWalk());
        //bowser.addTrait(new Behavior());
        bowser.addTrait(new Killable());
        bowser.draw = drawBowser;

        return bowser;
    };
}