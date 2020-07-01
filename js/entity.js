
import { Vec } from './math.js';
import BoundingBox from './boundingBox.js';
import AudioBoard from './AudioBoard.js';


export const Sides = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom'),
    RIGHT: Symbol('right'),
    LEFT: Symbol('left')
};

export class Trait {
    constructor(name) {
        this.NAME = name;
        this.sounds = new Set();
        this.tasks = [];
    }

    finalize() {
        this.tasks.forEach(task => task());
        this.tasks.length = 0;
    }

    queue(task) {
        this.tasks.push(task);
    }

    obstruct() {

    }

    collides(us, them) {

    }

    playSounds(audioBoard, audioContext) {
        this.sounds.forEach(name => {
            audioBoard.playAudio(name, audioContext);
        });

        this.sounds.clear();
    }

    update() {
    }
}

export default class Entity {
    constructor() {
        this.audio = new AudioBoard();
        this.canCollide = true;
        this.pos = new Vec(0, 0);
        this.vel = new Vec(0, 0);
        this.size = new Vec(0, 0);
        this.offset = new Vec(0, 0);
        this.bounds = new BoundingBox(this.pos, this.size, this.offset);
        this.lifetime = 0;

        this.traits = [];
    }

    addTrait(trait) {
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    collides(candidate) {
        this.traits.forEach(trait => {
            trait.collides(this, candidate);
        });
    }

    draw() {

    }

    finalize() {
        this.traits.forEach(trait => {
            trait.finalize();
        });
    }

    obstruct(side, match) {
        this.traits.forEach(trait => {
            trait.obstruct(this, side, match);
        });
    }

    update(gameContext, level) {
        this.traits.forEach(trait => {
            trait.update(this, gameContext, level);
            trait.playSounds(this.audio, gameContext.audioContext);
        });
        this.lifetime += gameContext.deltaTime;
    }
}  