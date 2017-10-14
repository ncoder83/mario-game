import Entity from './entity.js';
import Timer from './timer.js';
import KeyboardState from './keyboardstate.js';

import {loadLevel} from './loader.js';
import {Vec} from './math.js';
import {createMario} from './entities.js';


const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
    createMario(),
    loadLevel('1-1')
])
.then(([mario, level]) => {
   
    const gravity = 2000;
    mario.pos.set(24, 180);
   // mario.vel.set(200, -500) ;
    level.entities.add(mario);
    const SPACE = 32;
    const input = new KeyboardState();
    input.listenTo(window);
    input.addMapping(SPACE, keyState => {
        if(keyState){
            mario.jump.start();
        }
        else{
            mario.jump.cancel();
        }
        console.log(keyState);
    });


    const timer = new Timer(1/60);
    timer.update = function update(deltaTime){
            //mario.update(deltaTime);
            level.update(deltaTime);
            level.comp.draw(context);
            mario.vel.y += gravity * deltaTime;
    }


    timer.start();
});
