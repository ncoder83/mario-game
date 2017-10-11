
import {Vec} from './math.js';

export default class Entity{
    constructor(){
        this.pos = new Vec(0,0);
        this.vel = new Vec(0,0);
    }
}