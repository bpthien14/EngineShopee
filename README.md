# Thien's Game Engine

This is a simple TypeScript-based game engine designed for browser environments, using ES modules.

## Features

- Event-based architecture with TypeScript typing
- Game loop with delta time
- Director pattern for managing scenes
- System-based components
- FPS display
- Modern ES modules structure
- TypeScript support

## How To Use

### Building the Project

Before running the game, you need to build the TypeScript files:

```
npm run build
```

For development with automatic rebuilding:

```
npm run watch
```

### Running the Demo

1. Open `index.html` in a browser using a local server (required for ES modules):

```
npx http-server -o
```

2. The demo scene should load automatically, showing a red rectangle with text.

### Creating Your Own Game

1. Create an HTML file with a canvas element:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Game</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f0f0f0;
      }
      #game-canvas {
        border: 1px solid #333;
        background-color: #fff;
      }
    </style>
  </head>
  <body>
    <canvas id="game-canvas" width="800" height="600"></canvas>
    <!-- Use ES modules with type="module" -->
    <script type="module" src="dist/myGame.es.js"></script>
  </body>
</html>
```

2. Create a custom scene in TypeScript (myGame.es.ts):

```typescript
// Import needed engine components
import { Scene } from "./directorThien.es";
import { gameThien } from "./gameThien.es";
import { directorThien } from "./directorThien.es";

class MyScene extends Scene {
  constructor() {
    super("my-scene");
  }

  init(): void {
    console.log("My scene initialized");
  }

  update(dt: number): void {
    // Update game logic here
  }

  render(): void {
    // Render game here
    if (gameThien.canvas) {
      const ctx = gameThien.canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, gameThien.canvas.width, gameThien.canvas.height);

        // Draw your game elements
        ctx.fillStyle = "blue";
        ctx.fillRect(100, 100, 200, 200);
      }
    }
  }
}

// Initialize game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;

  gameThien.init({
    frameRate: 60,
    showFPS: true,
    canvas: canvas,
  });

  // Create and run your scene
  const myScene = new MyScene();
  directorThien.runScene(myScene);

  // Start the game
  gameThien.start();
});
```

## Project Structure

The engine uses TypeScript with ES modules:

```
/
│   ├── eventTagret.es.ts      # Base event system
│   ├── directorThien.es.ts    # Director system
│   ├── gameThien.es.ts        # Game loop and state management
│   └── demoGameEngine.es.ts   # Demo implementation
└── index.html                 # Main HTML file
```

## Engine Architecture

### Core Components

- **EventTargetThien**: Base class for event handling
- **DirectorThien**: Manages game flow, systems, and scenes
- **GameThien**: Main game class controlling the game loop
- **Scene**: Base class for game scenes
- **System**: Interface for systems that can be registered with the director

### Key Classes

#### EventTargetThien

Provides event handling capabilities:

- `on(type: string, callback: Function): void`: Register event listener
- `off(type: string, callback?: Function): void`: Remove event listener
- `emit(type: string, ...args: any[]): void`: Emit event
- `once(type: string, callback: Function): void`: Register one-time event listener

#### DirectorThien

Manages the game flow:

- `init(): void`: Initialize the director
- `tick(dt: number): void`: Update one frame
- `registerSystem(id: string, system: System, priority: number): void`: Register a system
- `runScene(scene: Scene): void`: Run a scene

#### GameThien

Controls the game loop:

- `init(config: GameConfig): void`: Initialize the game
- `start(): void`: Start the game loop
- `pause(): void`: Pause the game
- `resume(): void`: Resume the game after pause
- `end(): void`: End the game

## TypeScript Configuration

The project uses the following TypeScript configuration:

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "es2015",
    "moduleResolution": "node",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": false,
    "skipLibCheck": true
  }
}
```

## Troubleshooting

### Common Issues

- **"Exports is not defined"**: Resolved by using ES modules with `type="module"` in script tags
- **"EventTarget has already been declared"**: Fixed by renaming to EventTargetThien to avoid conflicts
- **Module resolution issues**: Make sure you're running via a web server (ES modules require this)
- **TypeScript errors**: Ensure you've built the project with `npm run build` before testing
- **Black screen**: Check browser console for errors

## Credits

Created by Thien
