import React from 'react';
import Game from '../game/Game';

export const Pacman = () => {
    const canvasReference = React.useRef<HTMLCanvasElement>(null)
    let width = 224;
    let height = 248;

    React.useEffect(() => {
        const canvas = canvasReference.current as HTMLCanvasElement;
        const game = new Game(canvas);
        game.initiate();
    }, []);

    return <canvas 
        id="game"
        ref={canvasReference} 
        width={width} 
        height={height} />
}