import { _Player } from './_Player'
import { _Move } from './_Move'
import { Color } from './Color'
import { Board } from './Board'

export abstract class BasicPlayer implements _Player {
    color: Color;

    startGame(color: Color): void {
        this.color = color;
    };

    DoublesPenalty(): void {
        console.log("Fricking doubles.");
    };
    
    abstract doMove(brd: Board, distances: number[]): _Move[];
}