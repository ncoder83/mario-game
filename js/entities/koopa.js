import Entity, { Trait } from '../entity.js';
import PendulumWalk from '../traits/pendulumWalk.js';
import { loadSpriteSheet } from '../loaders/sprite.js';
import Solid from '../traits/solid.js';
import Killable from '../traits/killable.js';
import Physics from '../traits/physics.js';


export function loadKoopa() {
    return loadSpriteSheet('koopa')
        .then(createKoopaFactory);
}

const STATE_WALKING = Symbol('walking');
const STATE_HIDING = Symbol('hiding');
const STATE_PANICK = Symbol('panick');

class Behavior extends Trait {
    constructor() {
        super('behavior');
        this.state = STATE_WALKING;
        this.hideTime = 0;
        this.hideDuration = 5;
        this.walkSpeed = null;
        this.panicSpeed = 300;
    }

    collides(us, them) {
        if (us.killable.dead)
            return;

        if (them.stomper) {
            if (them.vel.y > us.vel.y) {
                this.handleStomp(us, them);
            }
            else {
                this.handleNudge(us, them);
            }
        }
    }


    handleNudge(us, them) {
        if (this.state === STATE_WALKING) {
            them.killable.kill();
        }
        else if (this.state === STATE_HIDING) {
            this.panic(us, them);
        }
        else if (this.state === STATE_PANICK) {
            const travelDir = Math.sign(us.vel.x);
            const impactDir = Math.sign(us.pos.x - them.pos.x);
            if (travelDir !== 0 && travelDir !== impactDir) {
                them.killable.kill();
            }
        }

    }

    handleStomp(us, them) {
        if (this.state === STATE_WALKING) {
            this.hide(us);
        }
        else if (this.state === STATE_HIDING) {
            us.killable.kill();
            us.vel.set(100, -200);
            us.solid.obstructs = false;
        }
        else if (this.state === STATE_PANICK) {
            this.hide(us);
        }

    }

    hide(us) {
        us.vel.x = 0;
        us.pendulum.enabled = false;
        if (this.walkSpeed === null) {
            this.walkSpeed = us.pendulum.speed;
        }
        this.hideTime = 0;
        this.state = STATE_HIDING;
    }

    unhide(us) {
        us.pendulum.enabled = true;
        us.pendulum.speed = this.walkSpeed;
        this.state = STATE_WALKING;
    }

    panic(us, them) {
        us.pendulum.enabled = true;
        us.pendulum.speed = this.panicSpeed * Math.sign(them.vel.x);
        this.state = STATE_PANICK;
    }

    update(us, deltaTime) {
        if (this.state === STATE_HIDING) {
            this.hideTime += deltaTime;
            if (this.hideTime > this.hideDuration) {
                this.unhide(us);
            }
        }
    }
}

function createKoopaFactory(sprite) {

    const walkAnim = sprite.animations.get('walk');
    const wakeAnim = sprite.animations.get('wake');

    function routeAnim(koopa) {
        if (koopa.behavior.state === STATE_HIDING) {
            if (koopa.behavior.hideTime > 3) {
                return wakeAnim(koopa.behavior.hideTime);
            }
            return 'hiding';
        }
        if (koopa.behavior.state === STATE_PANICK) {
            return 'hiding';
        }
        return walkAnim(koopa.lifetime);
    }

    function drawKoopa(context) {
        sprite.draw(routeAnim(this), context, 0, 0, this.vel.x < 0);
    }

    return function createkoopa() {
        const koopa = new Entity();
        koopa.size.set(16, 16);
        koopa.offset.y = 8;

        koopa.addTrait(new Physics());
        koopa.addTrait(new Solid());
        koopa.addTrait(new PendulumWalk());
        koopa.addTrait(new Killable());
        koopa.addTrait(new Behavior());
        koopa.draw = drawKoopa;

        return koopa;
    };
}