import {loadMario} from './entities/mario.js';
import {loadGoomba} from './entities/goomba.js';
import {loadKoopa} from './entities/koopa.js';

export function loadEntities(){
    const entityFactories = {};

    function AddAs(name){
        return factory => entityFactories[name] = factory;
    }

    return Promise.all([
        loadMario().then(AddAs('mario')),
        loadGoomba().then(AddAs('goomba')),
        loadKoopa().then(AddAs('koopa'))
    ])
    .then(() => entityFactories);
}