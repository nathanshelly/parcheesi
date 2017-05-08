import * as c from './Constants'

import { _Player } from './_Player'
import { _Move } from './_Move'
import { Color } from './Color'
import { Board } from './Board'

export abstract class BasicPlayer implements _Player {
    color: Color;

    startGame(color: Color): string {
        this.color = color;
        return c.TEST_NAME;
    };

    doublesPenalty(): void { console.log("Fricking doubles."); };
    
    abstract doMove(brd: Board, distances: number[]): _Move[];
}

export class PrettyDumbPlayer extends BasicPlayer {
	doMove(brd: Board, distances: number[]): _Move[] {
		throw new Error('Method not implemented - not needed when manually building moves.');
	}
}