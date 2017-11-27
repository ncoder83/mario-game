import Timer from './timer.js';
import Camera from './camera.js';
import Entity from './entity.js';
import PlayerController from './traits/playercontroller.js';
import {createLevelLoader} from './loaders/level.js';
import {loadEntities} from './entities.js';
import {setupKeyboard} from './input.js'
import {createCollisionLayer} from './layers.js';

function createPlayerEnv(playerEntity){
    const playerEnv = new Entity();
    const playerControl = new PlayerController();
    playerControl.checkpoint.set(64,64);
    playerControl.setPlayer(playerEntity);
    playerEnv.addTrait(playerControl);
    return playerEnv;
    
}

async function main(canvas){

    const context = canvas.getContext('2d');
    const entityFactory = await loadEntities();
    const loadLevel = await createLevelLoader(entityFactory);
    const level = await loadLevel('1-1');

    const camera = new Camera();
    window.camera = camera;

    const mario = entityFactory.mario();
    // mario.pos.set(64, 64);
    // level.entities.add(mario);
    
    const playerEnv = createPlayerEnv(mario);
    level.entities.add(playerEnv);
    level.comp.layers.push(createCollisionLayer(level));
    const input = setupKeyboard(mario);   
    input.listenTo(window);

    const timer = new Timer(1/60);
    timer.update = function update(deltaTime){
        level.update(deltaTime);
        
        //if(mario.pos.x > 100){
            camera.pos.x = Math.max(0, mario.pos.x - 100);
       // }

        level.comp.draw(context, camera);
    }
    timer.start();  
}

const canvas = document.getElementById('screen');
main(canvas);



