
import { Vec } from './math.js';
import BoundingBox from './BoundingBox.js';
import AudioBoard from './AudioBoard.js';
import EventBuffer from './EventBuffer.js';


export const Sides = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom'),
    RIGHT: Symbol('right'),
    LEFT: Symbol('left')
};

export class Trait {
    static EVENT_TASK = Symbol('task');

    constructor(name) {
        this.NAME = name;
        this.listeners = [];
    }

    listen(name, callback, count = Infinity) {
        const listener = { name, callback, count };
        this.listeners.push(listener);
    }

    finalize(entity) {
        this.listeners = this.listeners.filter(listener => {
            entity.events.process(listener.name, listener.callback);
            return --listener.count;
        });
    }

    queue(task) {
        this.listen(Trait.EVENT_TASK, task, 1);
    }

    obstruct() {

    }

    collides(us, them) {

    }

    update() {
    }
}

export default class Entity {
    constructor() {
        this.audio = new AudioBoard();
        this.sounds = new Set();

        this.events = new EventBuffer();

        //this.canCollide = true;
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

        this.events.emit(Trait.EVENT_TASK, this);

        this.traits.forEach(trait => {
            trait.finalize(this);
        });

        this.events.clear();
    }

    obstruct(side, match) {
        this.traits.forEach(trait => {
            trait.obstruct(this, side, match);
        });
    }


    playSounds(audioBoard, audioContext) {
        this.sounds.forEach(name => {
            audioBoard.playAudio(name, audioContext);
        });

        this.sounds.clear();
    }

    update(gameContext, level) {
        this.traits.forEach(trait => {
            trait.update(this, gameContext, level);

        });

        this.playSounds(this.audio, gameContext.audioContext);
        this.lifetime += gameContext.deltaTime;
    }
}  