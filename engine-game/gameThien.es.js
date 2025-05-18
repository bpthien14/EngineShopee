import { EventTargetThien } from "./eventTagret.es.js";
import { directorThien, DirectorThien } from "./directorThien.es.js";
export const GameState = {
  UNINITED: 0,
  INITED: 1,
  RUNNING: 2,
  PAUSED: 3,
};
export class GameThien extends EventTargetThien {
  constructor() {
    super();
    if (GameThien._instance) {
      return GameThien._instance;
    }
    GameThien._instance = this;
    this._state = GameState.UNINITED;
    this._frameRate = 60;
    this._showFPS = false;
    this._canvas = null;
    this._director = directorThien;
    this._frameTime = 1000 / 60;
    this._startTime = 0;
    this._lastTime = 0;
    this._deltaTime = 0;
    this._totalTime = 0;
    this._frameCount = 0;
    this._fpsUpdateTime = 0;
    this._fps = 0;
    this._animationFrameId = null;
  }
  static getInstance() {
    if (!GameThien._instance) {
      GameThien._instance = new GameThien();
    }
    return GameThien._instance;
  }
  init(config = {}) {
    if (this._state !== GameState.UNINITED) {
      console.warn("Game đã được khởi tạo rồi");
      return;
    }
    console.log("Initializing GameThien...");
    if (config) {
      if (config.frameRate) {
        this._frameRate = config.frameRate;
        this._frameTime = 1000 / this._frameRate;
      }
      if (config.showFPS !== undefined) {
        this._showFPS = config.showFPS;
      }
      if (config.canvas) {
        this._canvas = config.canvas;
      }
    }
    this._director = directorThien;
    this._director.init();
    this._startTime = performance.now();
    this._lastTime = this._startTime;
    this._state = GameState.INITED;
    this.emit(GameThien.EVENT_GAME_INIT);
    console.log("Game initialized with frameRate =", this._frameRate);
  }
  start() {
    if (this._state === GameState.RUNNING) {
      console.warn("Game is already running");
      return;
    }
    this._state = GameState.RUNNING;
    this.emit(GameThien.EVENT_GAME_START);
    this._startGameLoop();
  }
  pause() {
    if (this._state !== GameState.RUNNING) {
      console.warn("Game is not running");
      return;
    }
    this._state = GameState.PAUSED;
    this.emit(GameThien.EVENT_GAME_PAUSE);
    if (this._animationFrameId !== null) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
  }
  resume() {
    if (this._state !== GameState.PAUSED) {
      console.warn("Game is not paused");
      return;
    }
    this._state = GameState.RUNNING;
    this.emit(GameThien.EVENT_GAME_RESUME);
    this._lastTime = performance.now();
    this._startGameLoop();
  }
  end() {
    if (this._state === GameState.UNINITED) {
      console.warn("Game has not been initialized");
      return;
    }
    if (this._animationFrameId !== null) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
    this._state = GameState.UNINITED;
    this.emit(GameThien.EVENT_GAME_END);
  }
  _startGameLoop() {
    const gameLoop = () => {
      const currentTime = performance.now();
      this._deltaTime = (currentTime - this._lastTime) / 1000;
      this._lastTime = currentTime;
      this._totalTime = (currentTime - this._startTime) / 1000;
      this._frameCount++;
      if (currentTime - this._fpsUpdateTime > 1000) {
        this._fps = Math.round(
          (this._frameCount * 1000) / (currentTime - this._fpsUpdateTime)
        );
        this._frameCount = 0;
        this._fpsUpdateTime = currentTime;
        if (this._showFPS) {
          console.log("FPS:", this._fps);
        }
      }
      this.emit(GameThien.EVENT_FRAME_START, this._deltaTime);
      this._director.tick(this._deltaTime);
      this.emit(GameThien.EVENT_FRAME_END);
      if (this._state === GameState.RUNNING) {
        this._animationFrameId = requestAnimationFrame(gameLoop);
      }
    };
    this._animationFrameId = requestAnimationFrame(gameLoop);
  }
  get director() {
    return this._director;
  }
  get fps() {
    return this._fps;
  }
  get deltaTime() {
    return this._deltaTime;
  }
  get totalTime() {
    return this._totalTime;
  }
  get canvas() {
    return this._canvas;
  }
}
GameThien._instance = null;
GameThien.EVENT_GAME_INIT = "game_init";
GameThien.EVENT_GAME_START = "game_start";
GameThien.EVENT_GAME_PAUSE = "game_pause";
GameThien.EVENT_GAME_RESUME = "game_resume";
GameThien.EVENT_GAME_END = "game_end";
GameThien.EVENT_FRAME_START = "frame_start";
GameThien.EVENT_FRAME_END = "frame_end";
export const gameThien = GameThien.getInstance();
