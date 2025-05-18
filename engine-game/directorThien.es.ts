import { EventTargetThien } from "./eventTagret.es";
import { Scheduler } from "./scheduler.es";
import { System } from "./system.es";
import { Scene } from "./scene.es";

export const DirectorThienEvent = {
  INIT: "director_init",
  BEGIN_FRAME: "director_begin_frame",
  END_FRAME: "director_end_frame",
  BEFORE_UPDATE: "director_before_update",
  AFTER_UPDATE: "director_after_update",
  BEFORE_DRAW: "director_before_draw",
  AFTER_DRAW: "director_after_draw",
  BEFORE_SCENE_LOADING: "director_before_scene_loading",
  AFTER_SCENE_LAUNCH: "director_after_scene_launch",
};

export class DirectorThien extends EventTargetThien {
  private static _instance: DirectorThien | null = null;
  private _scheduler: Scheduler;
  private _systems: System[];
  private _scene: Scene | null;
  private _paused: boolean;
  private _totalFrames: number;
  private _loadingScene: string;
  private _initialized: boolean;

  constructor() {
    super();

    if (DirectorThien._instance) {
      return DirectorThien._instance;
    }

    DirectorThien._instance = this;
    this._scheduler = new Scheduler();
    this._systems = [];
    this._scene = null;
    this._paused = false;
    this._totalFrames = 0;
    this._loadingScene = "";
    this._initialized = false;
    console.log("DirectorThien created");
  }

  static getInstance(): DirectorThien {
    if (!DirectorThien._instance) {
      DirectorThien._instance = new DirectorThien();
    }
    return DirectorThien._instance;
  }

  init(): void {
    this._totalFrames = 0;
    this._paused = false;
    this.registerSystem(Scheduler.ID, this._scheduler, 200);
    for (let i = 0; i < this._systems.length; i++) {
      this._systems[i].init();
    }
    this._initialized = true;
    this.emit(DirectorThienEvent.INIT);
    console.log("DirectorThien initialized");
  }

  registerSystem(id: string, system: System, priority: number = 0): void {
    system.priority = priority;
    this._systems.push(system);
    this._systems.sort((a, b) => a.priority - b.priority);
    console.log(`System ${id} registered with priority ${priority}`);
  }

  unregisterSystem(system: System): void {
    const index = this._systems.indexOf(system);
    if (index !== -1) {
      this._systems.splice(index, 1);
    }
  }

  tick(dt: number): void {
    if (this._paused) return;
    this._totalFrames++;
    this.emit(DirectorThienEvent.BEGIN_FRAME);
    this.emit(DirectorThienEvent.BEFORE_UPDATE);
    for (let i = 0; i < this._systems.length; i++) {
      this._systems[i].update(dt);
    }
    if (this._scene) {
      this._scene.update(dt);
    }
    this.emit(DirectorThienEvent.AFTER_UPDATE);
    this.emit(DirectorThienEvent.BEFORE_DRAW);
    if (this._scene) {
      this._scene.render();
    }
    this.emit(DirectorThienEvent.AFTER_DRAW);
    this.emit(DirectorThienEvent.END_FRAME);
  }
  get initialized(): boolean {
    return this._initialized;
  }
  getScheduler(): Scheduler {
    return this._scheduler;
  }
  setScheduler(scheduler: Scheduler): void {
    if (this._scheduler !== scheduler) {
      this.unregisterSystem(this._scheduler);
      this._scheduler = scheduler;
      this.registerSystem(Scheduler.ID, scheduler, 200);
    }
  }
  get scene(): Scene | null {
    return this._scene;
  }
  runScene(scene: Scene): void {
    this.emit(DirectorThienEvent.BEFORE_SCENE_LOADING, scene);
    if (this._scene) {
    }
    this._scene = scene;
    this._scene.init();
    this.emit(DirectorThienEvent.AFTER_SCENE_LAUNCH, scene);
  }
}

export const directorThien = DirectorThien.getInstance();
