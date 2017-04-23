import * as _ from 'lodash'
import * as c from '../src/Constants'

import { Pawn } from '../src/Pawn'
import { Board } from '../src/Board'
import { Color } from '../src/Color'
import { _Spot } from '../src/_Spot'

export function placePawnsOnEntrySpot(pawns: [Pawn | null, Pawn | null], board: Board, color: Color): void {
	removeOldPawns(pawns, board);
	board.getEntrySpot(color).pawns = pawns;
}

export function placePawnsAtOffsetFromEntry(pawns: [Pawn | null, Pawn | null], board: Board, color: Color, offset: number): void {
	let spot: _Spot = board.getEntrySpot(color);
	let next_spot: _Spot | null = board.advanceToNewSpot(spot, offset, color);

	if(next_spot === null)
		throw new Error('tried to place pawns at invalid offset (ran off board)')

	removeOldPawns(pawns, board);
	
	next_spot.pawns = pawns;
}

function removeOldPawns(pawns: [Pawn | null, Pawn | null], board: Board) {
	pawns.forEach(pawn => {
		if(pawn !== null)
			board.findPawn(pawn).remove_pawn(pawn);
	});
}