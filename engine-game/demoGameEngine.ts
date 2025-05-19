import { gameThien, GameThien } from "./gameThien";
import { directorThien, DirectorThienEvent } from "./directorThien";
import { Scene } from "./scene";

class DemoScene extends Scene {
  constructor() {
    super("demo-scene");
  }
  
  init(): void {
    console.log("Demo scene initialized");
  }

  update(dt: number): void {}
  
  render(): void {
    console.log("Rendering demo scene");
    if (gameThien.canvas) {
      const ctx = gameThien.canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, gameThien.canvas.width, gameThien.canvas.height);
        ctx.fillStyle = "red";
        ctx.fillRect(50, 50, 200, 100);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Demo Game Engine", 60, 100);
        if (gameThien._showFPS) {
          ctx.fillText("FPS: " + gameThien.fps, 10, 30);
        }
      }
    }
  }
}

gameThien.on(GameThien.EVENT_FRAME_START, (deltaTime: number) => {});
directorThien.on(DirectorThienEvent.BEFORE_UPDATE, () => {});
directorThien.on(DirectorThienEvent.AFTER_UPDATE, () => {});
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing game with ES modules...");
  const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
  gameThien.init({
    frameRate: 60,
    showFPS: true,
    canvas: canvas,
  });
  const demoScene = new DemoScene();
  directorThien.runScene(demoScene);
  gameThien.start();
});
