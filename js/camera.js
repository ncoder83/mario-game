import {Vec} from './math.js';

export default class Camera{
    constructor(){
        this.pos = new Vec(0,0);
        this.size = new Vec(256,224);
    }

}