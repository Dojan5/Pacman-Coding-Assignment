import { Box, System as CollisionSystem } from 'detect-collisions';

export interface IGameObject {
    size: number;
    draw(context: CanvasRenderingContext2D): void;
    update(collisionSystem: CollisionSystem): void;
}

export enum Direction {
    None,
    Up,
    Right,
    Down,
    Left
}

export class GameObject extends Box implements IGameObject {
    constructor(x: number, y: number) {
        super({x, y}, 8, 8)
        this.size = 8;
    }
    
    size: number;
    isSolid: boolean = false;


    /**
     * Game object update method
     * @param collisionSystem 
     */
    update(collisionSystem: CollisionSystem): void {

    }


    /**
     * Game object draw method, renders the object to the provided canvas context when called
     * @param context 
     */
    draw(context: CanvasRenderingContext2D): void {
        throw new Error("Method not implemented.");
    }

}