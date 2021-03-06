import * as _ from 'lodash'
import * as c from '../src/Constants'

import { Pawn } from '../src/Pawn'
import { Board } from '../src/Board'
import { Color } from '../src/Color'
import { _Spot } from '../src/_Spot'

export function placePawnsOnGivenColorEntrySpot(pawns: [Pawn, Pawn | null], board: Board, color: Color): void {
	removeOldPawns(pawns, board);
	board.getMainRingEntry(color).pawns = pawns;
}

export function placePawnsAtOffsetFromYourEntry(pawns: [Pawn, Pawn | null], board: Board, offset: number): void {
	let color: Color = pawns[0].color;
	
	let spot: _Spot = board.getMainRingEntry(color);
	let next_spot: _Spot | null = board.spotRunner(spot, offset, color);

	if(next_spot === null)
		throw new Error('tried to place pawns at invalid offset (ran off board)')

	if((next_spot.nPawns() + pawns.length) > next_spot.max_n_pawns)
		throw new Error('tried to place too many pawns on spot')

	removeOldPawns(pawns, board);

	for(let i = 0; i < pawns.length; i++)
		if(pawns[i] !== null)
			next_spot.addPawn(pawns[i] as Pawn);
}

function removeOldPawns(pawns: [Pawn | null, Pawn | null], board: Board) {
	pawns.forEach(pawn => {
		if(pawn !== null)
			board.findSpotOfPawn(pawn).removePawn(pawn);
	});
}

export function convertMainRingLocToServerLoc(loc: number) {
	return (loc + 1) % c.MAIN_RING_SIZE;
}

export function convertServerLocToMainRingLoc(loc: number) {
	return loc === 0 ? c.MAIN_RING_SIZE - 1 : loc - 1;
}