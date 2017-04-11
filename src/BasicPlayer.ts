import { _Player } from './_Player'
import { _Move } from './_Move'
import { Color } from './Color'
import { ParcheesiBoard } from './ParcheesiBoard'

export abstract class BasicPlayer implements _Player {
    color: Color;

    startGame(color: Color): void {
        this.color = color;
    };

    DoublesPenalty(): void {
        console.log("Fricking doubles.");
    };

    abstract doMove(brd: ParcheesiBoard, dice: [number, number]): [_Move, _Move];
}