import { IGameObject } from "../objects/abstracts/gameobject";


export class CollisionHandler {
    constructor(objects: IGameObject[]) {
        this.objects = objects;
    }
    objects: IGameObject[];

    checkColission(): boolean {
        return false;
    }
}