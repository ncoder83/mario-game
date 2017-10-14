
import {Vec} from './math.js';

export class Trait{
    constructor(name){
        this.NAME = name;
    }

    update(){
        console.warn('Unhandled update class in Trait');
    }
}

export default class Entity{
    constructor(){
        this.pos = new Vec(0,0);
        this.vel = new Vec(0,0);
        this.traits = [];
    }

    addTrait(trait){
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    update(deltaTime){
        this.traits.forEach(trait => {
            trait.update(this, deltaTime);
        });
    }
}