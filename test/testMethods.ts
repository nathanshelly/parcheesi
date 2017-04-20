import * as _ from 'lodash'
import * as c from '../src/Constants'

import { Pawn } from '../src/Pawn'
import { _Move } from '../src/_Move'
import { _Spot } from '../src/_Spot'
import { Board } from '../src/Board'
import { MoveForward } from '../src/MoveForward'


export function placePawnForTesting(move: MoveForward, board: Board): void {
	let pawn_spot: _Spot = board.findPawn(move.pawn);

	let new_spot: _Spot | null = board.advanceToNewSpot(pawn_spot, move.distance, move.pawn.color);

	if(new_spot === null)
		throw new Error('tried to place pawn off board');

	new_spot.add_pawn(move.pawn);
}

export function placeBlockade(pawns: [Pawn, Pawn], board: Board): void {
	board.getEntrySpot(pawns[0].color).pawns = pawns;
}