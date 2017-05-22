import * as c from './Constants'

import { Pawn } from './Pawn'
import { Board } from './Board'
import { _Spot } from './_Spot'

export interface _PawnHandler {
	manipulatePawns(spot: _Spot, loc: number): void;
}

export class PawnGetter implements _PawnHandler {
	pawn_locs: [Pawn, number][];

	constructor() {
		this.pawn_locs = [];
	}

	manipulatePawns(spot: _Spot, loc: number): void {
		let pawns = spot.getLivePawns();
		pawns.forEach(pawn => { this.pawn_locs.push([pawn, loc]); });
	}	
}

export class PawnSetter implements _PawnHandler {
	pawn_locs: [Pawn, number][];
	board: Board;

	constructor(pawn_locs: [Pawn, number][], board: Board) {
		this.board = board;
		this.pawn_locs = pawn_locs.sort((tuple_one, tuple_two) => { return tuple_one[1] - tuple_two[1]; });
	}

	manipulatePawns(spot: _Spot, curr_loc: number): void {
		let pawn: Pawn, loc: number;
		// TODO : do while?
		// (curr_loc + 1) % main_ring_size to account for differences between board indexing
		while(this.pawn_locs.length > 0 && this.pawn_locs[0][1] === curr_loc) {
			// casting fine because confirmed that pawn_locs has values
			[pawn, loc] = this.pawn_locs.shift() as [Pawn, number];
			
			// remove pawn from current spot and then place on new spot
			this.board.findSpotOfPawn(pawn).removePawn(pawn);
			spot.addPawn(pawn);
		}
	}
}

