import Entity, { Sides, Trait } from '../entity.js';
import { loadSpriteSheet } from '../loader.js';
import Killable from '../traits/killable.js';
import Solid from '../traits/solid.js';
import Physics from '../traits/physics.js';


export function loadBullet() {
    return loadSpriteSheet('bullet')
        .then(createBulletFactory);
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
            }
            else {
                them.killable.kill();
            }
        }
    }
}

function createBulletFactory(sprite) {


    function drawBullet(context) {
        sprite.draw('bullet', context, 0, 0);
    }

    return function createbullet() {
        const bullet = new Entity();
        bullet.size.set(16, 14);

        bullet.addTrait(new Physics());
        bullet.addTrait(new Solid());
        bullet.addTrait(new Behavior());
        bullet.addTrait(new Killable());
        bullet.draw = drawBullet;

        return bullet;
    };
}