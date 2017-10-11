// import SpriteSheet from './spritesheet.js';
import Compositor from './compositor.js';
import Entity from './entity.js';
import {loadLevel} from './loader.js';
import {loadBackgroundSprites} from './sprite.js';
import {createBackgroundLayer, createSpriteLayer} from './layers.js'
import {Vec} from './math.js';
import {createMario} from './entities.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
    createMario(),
    loadBackgroundSprites(),
    loadLevel('1-1')
])
.then(([mario, backgroundSprites, level])=> {
    const comp = new Compositor();
   
    const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
    comp.layers.push(backgroundLayer);
    const gravity = 0.5;
    
    const spriteLayer = createSpriteLayer(mario);
    comp.layers.push(spriteLayer);
    
    function update(){
        comp.draw(context);
       
        mario.update();
        mario.vel.y += gravity;
        requestAnimationFrame(update);
    }
    update();
});
