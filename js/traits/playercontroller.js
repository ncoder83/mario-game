import {Sides, Trait} from '../entity.js'

export default class PlayerController extends Trait{
    constructor(){
        super('playercontroller');
        this.player = null;
    }

    setPlayer(entity){
        this.player = entity;
    }

    update(entity, deltaTime, level){
    }
}