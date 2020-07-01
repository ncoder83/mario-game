import { loadMario } from './entities/mario.js';
import { loadGoomba } from './entities/goomba.js';
import { loadKoopa } from './entities/koopa.js';
import { loadBowser } from './entities/bowser.js';

export function loadEntities(audioContext) {
    const entityFactories = {};

    function AddAs(name) {
        return factory => entityFactories[name] = factory;
    }

    return Promise.all([
        loadMario(audioContext).then(AddAs('mario')),
        loadGoomba(audioContext).then(AddAs('goomba')),
        loadKoopa(audioContext).then(AddAs('koopa')),
        loadBowser(audioContext).then(AddAs('bowser'))
    ])
        .then(() => entityFactories);
}