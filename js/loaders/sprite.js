import SpriteSheet from '../spritesheet.js';
import { createAnimation } from '../anim.js';
import { loadJSON, loadImage } from '../loader.js';

export function loadSpriteSheet(name) {

    SpriteSheet
    return loadJSON(`sprites/${name}.json`)
        .then(sheetSpec => Promise.all([
            sheetSpec,
            loadImage(sheetSpec.imageURL)
        ]))
        .then(([sheetSpec, image]) => {
            const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH);

            if (sheetSpec.tiles) {
                sheetSpec.tiles.forEach(tileSpec => {
                    sprites.defineTile(tileSpec.name, tileSpec.index[0], tileSpec.index[1]);
                });
            }

            if (sheetSpec.frames) {
                sheetSpec.frames.forEach(frameSpec => {
                    sprites.define(frameSpec.name, ...frameSpec.rect);
                });
            }

            if (sheetSpec.animations) {
                sheetSpec.animations.forEach(animSpec => {
                    const animation = createAnimation(animSpec.frames, animSpec.frameLen);
                    sprites.defineAnim(animSpec.name, animation);
                })
            }

            return sprites;
        });
}