import { SpawnPoint } from '.';
import { System as CollisionSystem } from 'detect-collisions';
import { GameObject, Direction, IGameObject } from './abstracts/gameobject';

enum PlayerState {
    Alive,
    PoweredUp,
    Dead
};

export class Player extends GameObject {
    constructor(spawnPoint: SpawnPoint) {
        super(spawnPoint.pos.x, spawnPoint.pos.y);

        this.spawnPoint = spawnPoint;
        this.state = PlayerState.Dead;
        this.direction = Direction.None;
        this.nextDirection = Direction.None;
    }
    state: PlayerState;
    colour = "orange";
    direction: Direction;
    nextDirection: Direction;
    spawnPoint: SpawnPoint;

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
                this.setPosition(this.pos.x, this.pos.y - 1);
                break;
            case Direction.Down:
                this.setPosition(this.pos.x, this.pos.y + 1);
                break;
            case Direction.Left:
                this.setPosition(this.pos.x - 1, this.pos.y);
                break;
            case Direction.Right:
                this.setPosition(this.pos.x + 1, this.pos.y);
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
        throw new Error('Method not implemented.');
    }

    handlePointCollisions(response: SAT.Response): void {
        if (response.b.isEaten) { return; }

        if (response.aInB) {
            response.b.eat();
        }
    }

    handlePowerupCollisions(response: SAT.Response): void {
        if (response.b.isEaten) { return; }

        if (response.aInB) {
            response.b.eat();
            this.state = PlayerState.PoweredUp;
        }
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

        context.fillRect(this.pos.x, this.pos.y, this.size, this.size);
    }
}