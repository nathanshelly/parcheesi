import * as c from './Constants'

import { SelfNamingPlayer } from './SelfNamingPlayer'
import { _Move } from './_Move'
import { Color } from './Color'
import { Board } from './Board'

export abstract class BasicPlayer extends SelfNamingPlayer {

	constructor() {
		super(c.TEST_NAME);
	}

	doublesPenalty(): void {
		// console.log("Fricking doubles.");
	};
    
    abstract doMove(brd: Board, distances: number[]): _Move[];
}

export class PrettyDumbPlayer extends BasicPlayer {
	doMove(brd: Board, distances: number[]): _Move[] {
		throw new Error('Method not implemented - not needed when manually building moves.');
	}
}
