export class Scene {
  id: string;
  constructor(id: string) {
    this.id = id;
  }
  init(): void {
    console.log(`Scene ${this.id} initialized`);
  }
  update(dt: number): void {}
  render(): void {}
}