import { GameObject } from "./abstracts/gameobject";

export class Wall extends GameObject {
    constructor(x: number, y:  number) {
        super(x, y);
    }
    
    colour: string = "blue";

    draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = this.colour;
        context.fillRect(this.pos.x, this.pos.y, this.size, this.size);
    }
}