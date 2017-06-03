import { Board } from './Board';
import { _Move } from './_Move';
import { PawnMover } from './PawnMover';

export class LastPawnMover extends PawnMover {
	doMove(brd: Board, distances: number[]): _Move[] {
		return this.movesForPawns(brd, distances, false);
	}
}

