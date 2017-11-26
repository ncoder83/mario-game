import Timer from './timer.js';
import Camera from './camera.js';
import {createLevelLoader} from './loaders/level.js';
import {loadEntities} from './entities.js';
import {setupKeyboard} from './input.js'
import {createCollisionLayer} from './layers.js';

async function main(canvas){

    const context = canvas.getContext('2d');
    const entityFactory = await loadEntities();
    const loadLevel = await createLevelLoader(entityFactory);
    const level = await loadLevel('1-1');

    const camera = new Camera();
    window.camera = camera;

    const mario = entityFactory.mario();
    mario.pos.set(64, 64);

    // const goomba = entityFactory.goomba();
    // goomba.pos.x = 200;
    // level.entities.add(goomba);

    // const koopa = entityFactory.koopa();
    // koopa.pos.x = 260;
    // level.entities.add(koopa);
    
    level.entities.add(mario);
    
    level.comp.layers.push(createCollisionLayer(level));
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
}

const canvas = document.getElementById('screen');
main(canvas);



