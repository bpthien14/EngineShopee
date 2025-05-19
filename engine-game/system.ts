export class System {
  id: string;
  priority: number = 0;
  constructor(id: string) {
    this.id = id;
  }
  init(): void {
    console.log(`System ${this.id} initialized`);
  }
  update(dt: number): void {}
}