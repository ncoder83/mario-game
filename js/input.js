import InputRouter from "./InputRouter.js";
import KeyboardState from "./KeyboardState.js";

export function setupKeyboard(window) {

  const input = new KeyboardState();
  const router = new InputRouter();
  
  input.listenTo(window);

  input.addMapping("Space", (keyState) => {
    if (keyState) router.route((entity) => entity.jump.start());
    else router.route((entity) => entity.jump.cancel());
  });

  input.addMapping("ShiftLeft", (keyState) => {
    router.route((entity) => entity.turbo(keyState));
  });

  input.addMapping("ArrowRight", (keyState) => {
    router.route((entity) => (entity.go.dir += keyState ? 1 : -1));
  });

  input.addMapping("ArrowLeft", (keyState) => {
    router.route((entity) => (entity.go.dir += -keyState ? -1 : 1));
  });

  return router;
}
