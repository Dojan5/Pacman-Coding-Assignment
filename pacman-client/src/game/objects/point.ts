import { GameObject, IGameObject } from "./abstracts/gameobject";

export class Point extends GameObject {
    constructor(x: number, y: number) {
        super(x, y);
    }

    isEaten: boolean = false;

    eat() {
        this.isEaten = true;
    }

    draw(context: CanvasRenderingContext2D): void {
        //Don't draw if eaten
        if(this.isEaten) {
            return;
        }

        context.fillStyle = "gold";
        context.fillRect(this.pos.x + 3, this.pos.y + 3, 2, 2);
    }
}