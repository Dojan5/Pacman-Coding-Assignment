import { System as CollisionSystem } from 'detect-collisions';
import { Nest } from '.';
import { Direction, GameObject } from './abstracts/gameobject';

export enum EnemyState {
    Dead,
    Chase,
    Scatter,
    Frightened
}

export enum EnemyType {
    Blinky,
    Pinky,
    Inky,
    Clyde
}

export class Enemy extends GameObject {
    constructor(x: number, y: number, type: EnemyType, nest: Nest) {
        super(x, y);
        this.nest = nest;
        this.state = EnemyState.Dead;
        //Select a colour randomly
        this.enemyType = type;
        switch (type) {
            case EnemyType.Blinky:
                this.colour = "rgb(255,0,0)";
                break;
            case EnemyType.Pinky:
                this.colour = "rgb(255,102,178)";
                break;
            case EnemyType.Inky:
                this.colour = "rgb(102,255,178)";
                break;
            case EnemyType.Clyde:
                this.colour = "rgb(255,255,102)";
                break;
        }
        this.canSpawn = true;
        this.direction = Direction.Up;
        this.nextDirection = Math.random() > 0 ? Direction.Left : Direction.Right;
    }
    colour: string;
    enemyType: EnemyType;
    canSpawn: boolean;
    nest: Nest;
    direction: Direction;
    nextDirection: Direction;

    state: EnemyState;

    move(collisionSystem: CollisionSystem) {
        switch (this.direction) {
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
            default:
                break;
        }
        collisionSystem.getPotentials(this).forEach((collider) => {
            if (collisionSystem.checkCollision(this, collider)) {
                this.handleCollisions(collisionSystem.response)
            }
        })
    }

    handleCollisions(response: SAT.Response) {
        switch (response.b.constructor.name) {
            case "Wall":
                this.pos.x -= response.overlapV.x;
                this.pos.y -= response.overlapV.y;
                this.changeDirection(response);
                break;
            default: return;
        }
    }

    kill(respawnTimer: number = 8000) {
        this.canSpawn = false;
        this.state = EnemyState.Dead;
        setTimeout(() => { this.canSpawn = true }, respawnTimer);
    }

    respawn() {
        this.state = EnemyState.Chase;
        this.canSpawn = false;
        this.nextDirection = Direction.Up;
    }

    changeDirection(response: SAT.Response) {
        this.direction = this.nextDirection;
        let roll = Math.floor(Math.random() * 3);
        if (response.overlapV.x === -1) {
            switch (roll) {
                case 0:
                    this.nextDirection = Direction.Up;
                    break;
                case 1:
                    this.nextDirection = Direction.Right;
                    break;
                case 2:
                    this.nextDirection = Direction.Down;
                    break;
            }
        }
        if (response.overlapV.y === -1) {
            switch (roll) {
                case 0:
                    this.nextDirection = Direction.Left;
                    break;
                case 1:
                    this.nextDirection = Direction.Right;
                    break;
                case 2:
                    this.nextDirection = Direction.Down;
                    break;
            }
        }
        if (response.overlapV.x === 1) {
            switch (roll) {
                case 0:
                    this.nextDirection = Direction.Up;
                    break;
                case 1:
                    this.nextDirection = Direction.Left;
                    break;
                case 2:
                    this.nextDirection = Direction.Down;
                    break;
            }
        }
        if (response.overlapV.y === 1) {
            switch (roll) {
                case 0:
                    this.nextDirection = Direction.Up;
                    break;
                case 1:
                    this.nextDirection = Direction.Right;
                    break;
                case 2:
                    this.nextDirection = Direction.Left;
                    break;
            }
        }
    }

    update(collisionSystem: CollisionSystem) {
        if (this.state === EnemyState.Dead && this.canSpawn) {
            this.respawn();
        }

        if (this.state === EnemyState.Dead && !this.canSpawn) {
            this.setPosition(this.nest.pos.x, this.nest.pos.y);
            return;
        }

        if (this.state === EnemyState.Chase) {
            this.move(collisionSystem);
        }

    }

    draw(context: CanvasRenderingContext2D): void {
        if (this.state === EnemyState.Dead) {
            return;
        }

        let fillColour = this.colour;

        if (this.state === EnemyState.Frightened) {
            fillColour = "blue";
        }


        context.fillStyle = fillColour;
        context.beginPath();
        context.arc(this.pos.x + 4, this.pos.y + 4, 4, 0, Math.PI * 2, false);
        context.fill();
        context.fillRect(this.pos.x, this.pos.y + 4, this.size, this.size / 2);
        context.fillStyle = "white";
        context.fillRect(this.pos.x + 1, this.pos.y + 2, 1, 1);
        context.fillRect(this.pos.x + 4, this.pos.y + 2, 1, 1);
    }
}