export class EventTargetThien {
  private _listeners: Map<string, Function[]>;

  constructor() {
    this._listeners = new Map<string, Function[]>();
  }

  on(type: string, callback: Function): void {
    if (!this._listeners.has(type)) {
      this._listeners.set(type, []);
    }
    this._listeners.get(type)!.push(callback);
  }

  off(type: string, callback?: Function): void {
    if (!this._listeners.has(type)) return;
    if (callback) {
      const listeners = this._listeners.get(type)!;
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    } else {
      this._listeners.delete(type);
    }
  }

  emit(type: string, ...args: any[]): void {
    if (!this._listeners.has(type)) return;
    const listeners = this._listeners.get(type)!.slice();
    for (const listener of listeners) {
      listener(...args);
    }
  }
  
  once(type: string, callback: Function): void {
    const onceWrapper = (...args: any[]) => {
      callback(...args);
      this.off(type, onceWrapper);
    };
    this.on(type, onceWrapper);
  }
}
