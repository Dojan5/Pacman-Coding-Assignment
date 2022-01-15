import { System as CollisionSystem } from 'detect-collisions';
import { GameObject } from "./abstracts/gameobject";

export class Nest extends GameObject {
    constructor(x: number, y:number) {
        super(x,y)
    }

    colour: string = "rgba(255,255,255,.25)";

    draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = this.colour;
        context.fillRect(this.pos.x, this.pos.y, this.size, this.size);
    }

}