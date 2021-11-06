import Trait  from '../Trait.js';

export default class Gravity extends Trait{
    constructor(){
        super('gravity');  
        this.obstructs = true;
    }

    update(entity, {deltaTime}, level){

        entity.vel.y += level.gravity * deltaTime;
    }
}