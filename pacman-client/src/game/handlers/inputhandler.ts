import { Direction } from "../objects/abstracts/gameobject";
import { Player } from "../objects/player";

export default class InputHandler {
    constructor(player: Player) {
        this.player = player;
        this.initializeEvents();
    }
    player: Player;

    initializeEvents() {
        window.addEventListener('keydown', e => this.handleKeyDown(e.code));
    }

    handleKeyDown(keyCode: string) {
        //console.log("InputHandler Keypressed: " + keyCode);
        switch (keyCode) {
            case "KeyW":
            case "ArrowUp":
                this.player.setDirection(Direction.Up);
                break;
            case "KeyA":
            case "ArrowLeft":
                this.player.setDirection(Direction.Left);
                break;
            case "KeyS":
            case "ArrowDown":
                this.player.setDirection(Direction.Down);
                break;
            case "KeyD":
            case "ArrowRight":
                this.player.setDirection(Direction.Right);
                break;
            case "Space":
                this.player.spawn();
                break;
            default: break;
        }
    }
}