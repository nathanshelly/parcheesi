import { PawnMover } from './PawnMover';
import { Board } from './Board';
import { _Move } from './_Move';
import { Pawn } from './Pawn';

export class FirstPawnMover extends PawnMover {
	doMove(brd: Board, distances: number[]): _Move[] {
		let pawns_in_order: Pawn[] = brd.getPawnsOfColor(this.color);
		return this.movesForPawns(brd, distances, pawns_in_order.reverse());
	}
}

