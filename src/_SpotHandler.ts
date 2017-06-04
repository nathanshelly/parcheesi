import * as c from './Constants'

import { Pawn } from './Pawn'
import { Board } from './Board'
import { Color } from './Color'
import { _Spot } from './_Spot'
import { MainRingSpot } from './MainRingSpot'

export interface _SpotHandler {
	manipulateSpot(spot: _Spot, loc: number): void;
}

export class PawnGetter implements _SpotHandler {
	pawn_locs: [Pawn, number][];

	constructor() { this.pawn_locs = []; }

	manipulateSpot(spot: _Spot, loc: number): void {
		spot.getLivePawns().forEach(pawn => { this.pawn_locs.push([pawn, loc]); });
	}	
}

export class PawnSetter implements _SpotHandler {
	pawn_locs: [Pawn, number][];
	board: Board;

	constructor(pawn_locs: [Pawn, number][], board: Board) {
		this.board = board;
		this.pawn_locs = pawn_locs.sort((tuple_one, tuple_two) => { 
			return tuple_one[1] - tuple_two[1];
		});
	}

	manipulateSpot(spot: _Spot, curr_loc: number): void {
		let pawn: Pawn, loc: number;
		while(this.pawn_locs.length > 0 && this.pawn_locs[0][1] === curr_loc) {
			// casting fine because confirmed that pawn_locs has values
			[pawn, loc] = this.pawn_locs.shift() as [Pawn, number];
			
			// remove pawn from current spot and then place on new spot
			this.board.findSpotOfPawn(pawn).removePawn(pawn);
			spot.addPawn(pawn);
		}
	}
}

export class GeneralLocGetterForColor implements _SpotHandler {
	color: Color;
	locs: number[];

	constructor(color: Color, manipulate_spot_lambda: (spot: _Spot, loc: number) => void) {
		this.locs = [];
		this.color = color;
		this.manipulateSpot = manipulate_spot_lambda;
	}

	manipulateSpot(spot: _Spot, loc: number): void {
		throw new Error("GeneralGetterForColor ran with unset manipulateSpot method.");
	}
}