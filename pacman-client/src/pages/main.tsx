import React from 'react';
import { LinkButton as Button } from '../components/button';

export const MainScreen: React.FC = () => (
    <>
        <h1>PACMAN</h1>
        <Button to="/game">Play &gt;</Button>
        <Button to="/score">Score &gt;</Button>
    </>
)