import Timer from './timer.js';
import Camera from './camera.js';
import {loadLevel} from './loaders/level.js';
import {loadMario} from './entities/mario.js';
import {loadGoomba} from './entities/goomba.js';
import {loadKoopa} from './entities/koopa.js';
import {setupKeyboard} from './input.js'
import {createCollisionLayer} from './layers.js';


const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
    loadMario(),
    loadGoomba(),
    loadKoopa(),
    loadLevel('1-1')
])
.then(([createMario, createGoomba, createKoopa, level]) => {
    const camera = new Camera();
    window.camera = camera;

    const mario = createMario();
    mario.pos.set(64, 64);

    const goomba = createGoomba();
    goomba.pos.x = 200;

    const koopa = createKoopa();
    koopa.pos.x = 260;

    level.entities.add(goomba);
    level.entities.add(koopa);
    level.entities.add(mario);
    
    level.comp.layers.push(createCollisionLayer());
    const input = setupKeyboard(mario);   
    input.listenTo(window);

    const timer = new Timer(1/60);
    timer.update = function update(deltaTime){
        level.update(deltaTime);
        
        if(mario.pos.x > 100){
            camera.pos.x = mario.pos.x - 100;
        }

        level.comp.draw(context, camera);
    }
    timer.start();  
});
