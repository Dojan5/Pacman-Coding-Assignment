import { CollisionHandler } from "./handlers/collisionhandler";
import InputHandler from "./handlers/inputhandler";
import LevelHandler from "./handlers/levelhandler";
import { SpawnPoint } from "./objects";
import { GameObject, IGameObject } from "./objects/abstracts/gameobject";
import { Player } from "./objects/player";
import { System as CollisionSystem } from "detect-collisions";

interface IGame {
    canvas: HTMLCanvasElement
}

enum GameState {
    Paused,
    Running,
    Over
}

export default class Game implements IGame {
    constructor(canvas : HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.context.imageSmoothingEnabled = false;
        this.state = GameState.Running;

        this.collisionSystem = new CollisionSystem();

        this.width = canvas.getBoundingClientRect().width;
        this.height = canvas.getBoundingClientRect().height;
    }
    //Meta
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
    state: GameState; 
    
    inputHandler: InputHandler | null = null;
    levelHandler: LevelHandler = new LevelHandler();
    collisionSystem: CollisionSystem;
    gameObjects: GameObject[] = [];
    player: Player | null = null;

    //Timing
    elapsed = 0;
    lag = 0;
    fps = 30;
    interval = 1000/this.fps;
    delta = 0;
    lastTime: number = Date.now();
    ticks = 0;

    //Game
    score = 0;

    initiate() {
        let level = this.levelHandler.buildLevel();
        this.gameObjects = [...level];
        //Initiate player
        let spawnpoint = this.gameObjects.find(m => m.constructor.name === "SpawnPoint") as SpawnPoint;
        this.player = new Player(spawnpoint);
        this.gameObjects.push(this.player);
        //Initiate input handler
        this.inputHandler = new InputHandler(this.player) as InputHandler;


        //Spawn the player
        this.player.spawn();

        //Instantiate collision handler
        this.gameObjects.forEach(m => this.collisionSystem.insert(m));
        this.collisionSystem.update();
        this.collisionSystem.draw(this.context);
        this.main(0);
    }
    
    main(time: number): void {
        //Initialise
        if(this.lastTime === null) {
            this.lastTime = time;
            requestAnimationFrame(() => this.main(Date.now()))
            return;
        }
        this.delta = time / this.lastTime;
        if(this.delta > this.interval) {
            this.lastTime = time - (this.delta % this.interval)
        }
        
        //Update game state
        this.update(this.delta);
        
        requestAnimationFrame(() => this.main(Date.now()))
    }


    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    
    update(delta: number): void {
        this.clear();
        this.gameObjects.forEach(o => o.update(this.collisionSystem));
        this.gameObjects.forEach(o => o.draw(this.context));
    }
}