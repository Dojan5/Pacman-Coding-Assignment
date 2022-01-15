import { System as CollisionSystem } from 'detect-collisions';
import { GameObject } from './abstracts/gameobject';

enum BehaviourState {
    Chase,
    Scatter,
    Frightened
}

export class Enemy extends GameObject {
    constructor(x: number, y: number) {
        super(x, y);
        this.behaviour = BehaviourState.Chase;
        //Select a colour randomly
        let random = Math.floor(Math.random() * 4);
        this.colour = this.colours[random];

    }

    colours: string[] = ["red", "yellow", "pink", "cyan"];
    colour: string;

    behaviour: BehaviourState;

    update(collisionSystem: CollisionSystem) {

    }
    
    draw(context: CanvasRenderingContext2D): void {
        let fillColour = this.colour;

        if(this.behaviour === BehaviourState.Frightened) {
            fillColour = "blue";
        }
            

        context.fillStyle = fillColour;
        context.fillRect(this.pos.x, this.pos.y, this.size, this.size);
    }
}