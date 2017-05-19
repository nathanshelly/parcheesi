import * as c from './Constants'

import { Pawn } from './Pawn'
import { Board } from './Board'
import { _Spot } from './_Spot'

export interface _PawnHandler {
	manipulatePawns(spot: _Spot, loc: number): void;
}

export class PawnGetter implements _PawnHandler {
	pawn_locs: [Pawn, number][];
	running_main_ring: boolean;

	constructor(running_main_ring: boolean) {
		this.running_main_ring = running_main_ring;
		this.pawn_locs = [];
	}

	manipulatePawns(spot: _Spot, loc: number): void {
		let pawns = spot.getLivePawns();
		let maybe_adjusted_loc = this.running_main_ring ? (loc + 1) % c.MAIN_RING_SIZE : loc;
		pawns.forEach(pawn => { this.pawn_locs.push([pawn, maybe_adjusted_loc]); });
	}	
}

export class PawnSetter implements _PawnHandler {
	pawn_locs: [Pawn, number][];
	board: Board;
	running_main_ring: boolean;

	constructor(pawn_locs: [Pawn, number][], board: Board, running_main_ring: boolean) {
		this.pawn_locs = pawn_locs.sort((tuple_one, tuple_two) => tuple_one[1] - tuple_two[1]);
		this.board = board;
		this.running_main_ring = running_main_ring;
	}

	manipulatePawns(spot: _Spot, curr_loc: number): void {
		let pawn: Pawn, loc: number;


		// TODO : do while?
		// (curr_loc + 1) % main_ring_size to accoutn for differences between board indexing
		while(this.pawn_locs.length > 0 && this.pawn_locs[0][1] === (this.running_main_ring ? (curr_loc + 1) % c.MAIN_RING_SIZE : curr_loc) ) {
			// casting fine because confirmed that pawn_locs has values
			[pawn, loc] = this.pawn_locs.shift() as [Pawn, number];
			
			// place pawn on correct spot and remove from spot
			spot.addPawn(pawn);
			this.board.findSpotOfPawn(pawn).removePawn(pawn);
		}
	}
}
