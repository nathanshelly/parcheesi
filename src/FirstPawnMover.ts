import * as d from './Distances';

import { Board } from './Board';
import { _Move } from './_Move';
import { PawnMover } from './PawnMover';

export class FirstPawnMover extends PawnMover {
	doMove(brd: Board, distances: number[]): _Move[] {
		return this.movesForPawns(brd, distances, true);
	}
}
