import Level from './level.js';
import SpriteSheet from './spritesheet.js';
import {createBackgroundLayer, createSpriteLayer} from './layers.js'
import {createAnimation} from './anim.js';


export function loadImage(url){
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });
}

function loadJSON(url){
    return fetch(url).then(r => r.json());
}

function createTiles(level, backgrounds, patterns, offsetX = 0, offsetY = 0 ){

    function applyRange(background, xStart, xLen, yStart, yLen){
        const xEnd = xStart + xLen;
        const yEnd = yStart + yLen;

        for(let x = xStart; x < xEnd; ++x){
            for(let y = yStart; y < yEnd; ++y){
                const deriveX = x + offsetX;
                const deriveY = y + offsetY;
                if(background.pattern){
                    const backgrounds = patterns[background.pattern].backgrounds;
                    createTiles(level, backgrounds, patterns, deriveX, deriveY);
                    console.log('Pattern found', patterns[background.pattern]);

                }else{
                    level.tiles.set(x,y, {
                        name: background.tile,
                        type: background.type
                    });
                }
            }
        }
    }

    backgrounds.forEach(background => {
        background.ranges.forEach(range => {
            if(range.length === 4){
                const [xStart, xLen, yStart, yLen] = range;
                applyRange(background, xStart, xLen, yStart, yLen);
            }
            else if(range.length === 3){
                const [xStart, xLen, yStart] = range;
                applyRange(background, xStart, xLen, yStart, 1);
            }
            else if(range.length === 2){
                const [xStart, yStart] = range;
                applyRange(background, xStart, 1, yStart, 1);
            }
        });
    });
}


export function loadSpriteSheet(name){
    return loadJSON(`sprites/${name}.json`)
        .then(sheetSpec => Promise.all([
            sheetSpec,
            loadImage(sheetSpec.imageURL)
        ]))
        .then(([sheetSpec, image]) => {
            const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH);
            
            if(sheetSpec.tiles){
                sheetSpec.tiles.forEach(tileSpec => {
                    sprites.defineTile(tileSpec.name, tileSpec.index[0],tileSpec.index[1]);
                });
            }

            if(sheetSpec.frames){
                sheetSpec.frames.forEach( frameSpec => {
                    sprites.define(frameSpec.name, ...frameSpec.rect);
                });
            }

            if(sheetSpec.animations){
                sheetSpec.animations.forEach(animSpec => {
                    const animation = createAnimation(animSpec.frames, animSpec.frameLen);
                    sprites.defineAnim(animSpec.name, animation);
                })
            }

            return sprites;   
        });
}

export function loadLevel(name){
    return loadJSON(`/levels/${name}.json`)
        .then(levelSpec => Promise.all([
            levelSpec, 
            loadSpriteSheet(levelSpec.spriteSheet)
        ]))
        .then(([levelSpec, backgroundSprites])=> {
            const level = new Level();

            createTiles(level, levelSpec.backgrounds, levelSpec.patterns);
            const backgroundLayer = createBackgroundLayer(level, backgroundSprites);
            level.comp.layers.push(backgroundLayer);  

            const spriteLayer = createSpriteLayer(level.entities);
            level.comp.layers.push(spriteLayer);
            return level;
        });
}