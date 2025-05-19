import { EventTargetThien } from "./eventTagret";
import { directorThien, DirectorThien } from "./directorThien";
export const GameState = {
  UNINITED: 0,
  INITED: 1,
  RUNNING: 2,
  PAUSED: 3,
};
export interface GameConfig {
  frameRate?: number;
  showFPS?: boolean;
  canvas?: HTMLCanvasElement;
}
export class GameThien extends EventTargetThien {
  private static _instance: GameThien | null = null;
  private _state: number;
  private _frameRate: number;
  _showFPS: boolean; 
  private _canvas: HTMLCanvasElement | null;
  private _director: DirectorThien;
  private _frameTime: number;
  private _startTime: number;
  private _lastTime: number;
  private _deltaTime: number;
  private _totalTime: number;
  private _frameCount: number;
  private _fpsUpdateTime: number;
  private _fps: number;
  private _animationFrameId: number | null;
  static readonly EVENT_GAME_INIT: string = "game_init";
  static readonly EVENT_GAME_START: string = "game_start";
  static readonly EVENT_GAME_PAUSE: string = "game_pause";
  static readonly EVENT_GAME_RESUME: string = "game_resume";
  static readonly EVENT_GAME_END: string = "game_end";
  static readonly EVENT_FRAME_START: string = "frame_start";
  static readonly EVENT_FRAME_END: string = "frame_end";
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
  static getInstance(): GameThien {
    if (!GameThien._instance) {
      GameThien._instance = new GameThien();
    }
    return GameThien._instance;
  }
  init(config: GameConfig = {}): void {
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
  start(): void {
    if (this._state === GameState.RUNNING) {
      console.warn("Game is already running");
      return;
    }
    this._state = GameState.RUNNING;
    this.emit(GameThien.EVENT_GAME_START);
    this._startGameLoop();
  }
  pause(): void {
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
  resume(): void {
    if (this._state !== GameState.PAUSED) {
      console.warn("Game is not paused");
      return;
    }
    this._state = GameState.RUNNING;
    this.emit(GameThien.EVENT_GAME_RESUME);
    this._lastTime = performance.now();
    this._startGameLoop();
  }
  end(): void {
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
  private _startGameLoop(): void {
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
  get director(): DirectorThien {
    return this._director;
  }
  get fps(): number {
    return this._fps;
  }
  get deltaTime(): number {
    return this._deltaTime;
  }
  get totalTime(): number {
    return this._totalTime;
  }
  get canvas(): HTMLCanvasElement | null {
    return this._canvas;
  }
}
export const gameThien = GameThien.getInstance();
