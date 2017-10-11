// import SpriteSheet from './spritesheet.js';
import Compositor from './compositor.js';
import {loadLevel} from './loader.js';
import {loadMarioSprite, loadBackgroundSprites} from './sprite.js';
import {createBackgroundLayer} from './layers.js'

function createSpriteLayer(sprite, pos){
    return function drawSpriteLayer(context){
        for(let i= 0 ; i < 20; i++){
            sprite.draw('idle',context,  pos.x + i *16, pos.y);
        }
    }
}

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');


Promise.all([
    loadMarioSprite(),
    loadBackgroundSprites(),
    loadLevel('1-1')
])
.then(([marioSprite, backgroundSprites, level])=> {
    const comp = new Compositor();
   
    const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
    comp.layers.push(backgroundLayer);
    const pos = {
        x: 0, y: 0
    };
    const spriteLayer = createSpriteLayer(marioSprite, pos);
    comp.layers.push(spriteLayer);
    
    function update(){
        comp.draw(context);
       
        pos.x += 2;
        pos.y += 2;
        requestAnimationFrame(update);
    }

    update();
});
