import * as _ from 'lodash'
import * as c from '../src/Constants'

import { Pawn } from '../src/Pawn'
import { Board } from '../src/Board'
import { Color } from '../src/Color'
import { _Spot } from '../src/_Spot'

export function placePawnsOnGivenColorEntrySpot(pawns: [Pawn, Pawn | null], board: Board, color: Color): void {
	removeOldPawns(pawns, board);
	board.getEntrySpot(color).pawns = pawns;
}

export function placePawnsAtOffsetFromYourEntry(pawns: [Pawn, Pawn | null], board: Board, offset: number): void {
	let color = pawns[0].color;
	
	let spot: _Spot = board.getEntrySpot(color);
	let next_spot: _Spot | null = board.getSpotAtOffsetFromSpot(spot, offset, color);

	if(next_spot === null)
		throw new Error('tried to place pawns at invalid offset (ran off board)')

	if(next_spot.n_pawns() > 0)
		throw new Error('tried to place pawns on spot with pawns already there')
	removeOldPawns(pawns, board);
	next_spot.pawns = pawns;
}

function removeOldPawns(pawns: [Pawn | null, Pawn | null], board: Board) {
	pawns.forEach(pawn => {
		if(pawn !== null)
			board.findPawn(pawn).remove_pawn(pawn);
	});
}
