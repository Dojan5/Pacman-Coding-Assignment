import { System as CollisionSystem } from 'detect-collisions';
import { Enemy, EnemyState, EnemyType } from '.';
import { GameObject } from "./abstracts/gameobject";

export class Nest extends GameObject {
    constructor(x: number, y: number, type: EnemyType) {
        super(x, y)
        this.nestType = type;
        this.enemy = new Enemy(this.pos.x, this.pos.y, type, this);

        switch (type) {
            case EnemyType.Blinky:
                this.colour = "rgba(255,0,0,.25)"
                break;
            case EnemyType.Pinky:
                this.colour = "rgba(255,102,178,.25)"
                break;
            case EnemyType.Inky:
                this.colour = "rgba(102,255,178,.25)"
                break;
            case EnemyType.Clyde:
                this.colour = "rgba(255,255,102,.25)"
                break;
        }
    }

    enemy: Enemy;
    nestType: EnemyType;


    colour: string;

    draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = this.colour;
        context.fillRect(this.pos.x, this.pos.y, this.size, this.size);
    }

}