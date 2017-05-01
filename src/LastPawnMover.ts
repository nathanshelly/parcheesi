import { PawnMover } from './PawnMover';
import { Board } from './Board';
import { _Move } from './_Move';
import { Pawn } from './Pawn';

export class LastPawnMover extends PawnMover {
	doMove(brd: Board, distances: number[]): _Move[] {
		return this.movesForPawns(brd, distances, false);
	}
}

