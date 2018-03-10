
import {Vec} from './math.js';
import BoundingBox from './boundingBox.js';


export const Sides = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom'),
    RIGHT: Symbol('right'),
    LEFT: Symbol('left')
};

export class Trait{
    constructor(name){
        this.NAME = name;
        this.tasks = [];
    }

    finalize(){
        this.tasks.forEach(task => task());
        this.tasks.length = 0;
    }

    queue(task){
        this.tasks.push(task);
    }

    obstruct(){

    }
    collides(us, them){

    }

    update(){
    }
}

export default class Entity{
    constructor(){
        this.canCollide = true;

        this.pos = new Vec(0,0);
        this.vel = new Vec(0,0);
        this.size = new Vec(0,0);
        this.offset = new Vec(0,0);
        this.bounds = new BoundingBox(this.pos, this.size, this.offset);
        this.lifetime = 0;
        
        this.traits = [];
    }

    addTrait(trait){
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    collides(candidate){
        this.traits.forEach(trait => {
            trait.collides(this, candidate);
        });
    }

    draw(){
        
    }

    finalize(){
        this.traits.forEach(trait => {
            trait.finalize();
        });
    }

    obstruct(side, match){
        this.traits.forEach(trait => {
            trait.obstruct(this, side, match);
        });
    }

    update(deltaTime, level){
        this.traits.forEach(trait => {
            trait.update(this, deltaTime, level);
        });
        this.lifetime += deltaTime;
    }
}  