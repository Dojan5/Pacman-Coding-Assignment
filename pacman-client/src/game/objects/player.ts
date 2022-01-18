import { SpawnPoint } from '.';
import { System as CollisionSystem } from 'detect-collisions';
import { GameObject, Direction, IGameObject } from './abstracts/gameobject';
import { ScoreHandler } from '../handlers';

enum PlayerState {
    Alive,
    PoweredUp,
    Dead
};

export class Player extends GameObject {
    constructor(spawnPoint: SpawnPoint, scoreHandler: ScoreHandler) {
        super(spawnPoint.pos.x, spawnPoint.pos.y);

        this.spawnPoint = spawnPoint;
        this.state = PlayerState.Dead;
        this.direction = Direction.None;
        this.nextDirection = Direction.None;
        this.scoreHandler = scoreHandler;
    }
    scoreHandler: ScoreHandler;
    state: PlayerState;
    colour = "orange";
    direction: Direction;
    nextDirection: Direction;
    spawnPoint: SpawnPoint;
    velocity: number = 1;

    setDirection(direction: Direction) {
        this.nextDirection = direction;
    }

    spawn() {
        this.direction = Direction.None;
        this.nextDirection = Direction.None;
        this.pos.x = this.spawnPoint.pos.x;
        this.pos.y = this.spawnPoint.pos.y;
        this.state = PlayerState.Alive;
    }

    update(collisionSystem: CollisionSystem) {
        switch (this.nextDirection) {
            case Direction.Up:
                this.setPosition(this.pos.x, this.pos.y - this.velocity);
                break;
            case Direction.Down:
                this.setPosition(this.pos.x, this.pos.y + this.velocity);
                break;
            case Direction.Left:
                this.setPosition(this.pos.x - this.velocity, this.pos.y);
                break;
            case Direction.Right:
                this.setPosition(this.pos.x + this.velocity, this.pos.y);
                break;
            case Direction.None:
            default: break;
        }
        collisionSystem.getPotentials(this).forEach((collider) => {
            if (collisionSystem.checkCollision(this, collider)) {
                this.handleCollisions(collisionSystem.response);
            }
        });
    }

    handleCollisions(response: SAT.Response): void {
        switch (response.b.constructor.name) {
            case "Wall":
                this.handleWallCollisions(response);
                break;
            case "Point":
                this.handlePointCollisions(response);
                break;
            case "Powerup":
                this.handlePowerupCollisions(response);
                break;
            case "Enemy":
                this.handleEnemyCollisions(response);
                break;
            case "SpawnPoint":
            default:
                return;
        }
    }
    handleEnemyCollisions(response: SAT.Response) {
        this.scoreHandler.change(-50);
        this.die();
    }

    die() {
        this.state = PlayerState.Dead;
        this.setPosition(-1, -1);
        setTimeout(() => this.spawn(), 1500);
    }

    handlePointCollisions(response: SAT.Response): void {
        if (response.b.isEaten) { return; }

        if (response.aInB) {
            this.scoreHandler.change(1);
            response.b.eat();
        }
    }

    handlePowerupCollisions(response: SAT.Response): void {
        if (response.b.isEaten) { return; }

        if (response.aInB) {
            this.scoreHandler.change(50);
            response.b.eat();
            this.activatePowerUp(8000);
        }
    }

    activatePowerUp(buffTimer: number = 5000) {
        this.state = PlayerState.PoweredUp;
        setTimeout(() => {
            this.state = PlayerState.Alive;
        }, buffTimer);
    }

    handleWallCollisions(response: SAT.Response): void {
        this.pos.x -= response.overlapV.x;
        this.pos.y -= response.overlapV.y;
    }

    draw(context: CanvasRenderingContext2D): void {
        //Don't draw if dead
        if (this.state === PlayerState.Dead) {
            return;
        }
        context.fillStyle = this.colour;

        if (this.state === PlayerState.PoweredUp) {
            context.fillStyle = "limegreen";
        }

        //context.fillRect(this.pos.x, this.pos.y, this.size, this.size);
        context.beginPath();
        context.arc(this.pos.x + 4, this.pos.y + 4, 4, 0, Math.PI * 2, false);
        context.fill();
    }
}