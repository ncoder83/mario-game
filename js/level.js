import Compositor from './compositor.js';
import EntityCollider from './entityCollider.js';
import TileCollider from './tilecollider.js';

export default class Level {
    constructor(){
        this.gravity = 1500;
        this.totalTime = 0;

        this.comp = new Compositor();
        this.entities = new Set();
        this.entityCollider = new EntityCollider(this.entities);
        this.tileCollider = null;//new TileCollider(this.tiles);
    }


    setCollisionGrid(matrix){
        
        this.tileCollider = new TileCollider(matrix);
    }

    update(deltaTime){
        this.entities.forEach(entity => {
            entity.update(deltaTime, this);

            entity.pos.x += entity.vel.x * deltaTime;
            if(entity.canCollide){
                this.tileCollider.checkX(entity);
            }

            entity.pos.y += entity.vel.y * deltaTime;
            if(entity.canCollide){
                this.tileCollider.checkY(entity);
            }

            entity.vel.y += this.gravity * deltaTime;
        });

        this.entities.forEach(entity => {
            if(entity.canCollide){
                this.entityCollider.check(entity);
            }
            
        });

        this.totalTime += deltaTime;
    }
}