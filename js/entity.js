
import {Vec} from './math.js';
import BoundingBox from './boundingBox.js';


export const Sides = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom'),
    RIGHT: Symbol('right'),
    LEFT: Symbol('left')
}

export class Trait{
    constructor(name){
        this.NAME = name;
    }

    obstruct(){

    }

    update(){
        console.warn('Unhandled update class in Trait');
    }
}

export default class Entity{
    constructor(){
        this.pos = new Vec(0,0);
        this.vel = new Vec(0,0);
        this.size = new Vec(0,0);
        this.offset = new Vec(0,0);
        this.bounds = new BoundingBox(this.pos, this.size, this.offset);
        console.log(this.bounds);
        this.lifetime = 0;
        
        this.traits = [];
    }

    addTrait(trait){
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    obstruct(side){
        this.traits.forEach(trait => {
            trait.obstruct(this, side);
        });
    }

    update(deltaTime){
        this.traits.forEach(trait => {
            trait.update(this, deltaTime);
        });
        this.lifetime += deltaTime;
    }
}  