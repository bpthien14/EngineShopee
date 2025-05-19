export class Scheduler {
  private _callbacks: Record<string, any>;
  priority: number = 0;
  id: string;
  static get ID(): string {
    return "scheduler";
  }
  constructor() {
    this._callbacks = {};
    this.id = Scheduler.ID;
  }
  init(): void {
    console.log("Scheduler initialized");
  }
  update(dt: number): void {}
}