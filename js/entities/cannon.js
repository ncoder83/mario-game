import Entity from "../Entity.js";
import Emitter from "../traits/Emitter.js";
import { loadAudioBoard } from "../loaders/audio.js";
import { findPlayers } from "../player.js";

const HOLD_FIRE_THRESHOLD = 30;

export function loadCannon(audioContext) {
  return loadAudioBoard("cannon", audioContext).then((audio) => {
    return createCannonFactory(audio);
  });
}

function createCannonFactory(audio) {
  function emitBullet(cannon, gameContext, level) {
    let dir = 1;
    for (const player of findPlayers(level.entities)) {
      if (
        player.pos.x > cannon.pos.x - HOLD_FIRE_THRESHOLD &&
        player.pos.x < cannon.pos.x + HOLD_FIRE_THRESHOLD
      ) {
        return;
      }

      if (player.pos.x < cannon.pos.x) {
        dir = -1;
      } else {
        dir = 1;
      }
    }

    const bullet = gameContext.entityFactory.bullet();

    bullet.pos.copy(cannon.pos);
    bullet.vel.set(80 * dir, 0);
    cannon.sounds.add("shoot");
    level.entities.add(bullet);
  }

  return function createCannon() {
    const cannnon = new Entity();
    cannnon.audio = audio;

    const emitter = new Emitter();
    emitter.interval = 4;
    emitter.emitters.push(emitBullet);
    cannnon.addTrait(emitter);
    return cannnon;
  };
}
