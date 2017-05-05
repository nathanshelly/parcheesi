import * as _ from 'lodash'
import * as c from './Constants'
import * as _distances from './Distances'

import { Pawn } from './Pawn'
import { Color } from './Color'
import { Board } from './Board'
import { _Player } from './_Player'
import { Parcheesi } from './Parcheesi'
import { BasicPlayer } from './BasicPlayer'

import { _Move } from './_Move'
import { MoveEnter } from './MoveEnter'
import { MoveForward } from './MoveForward'

import { _Spot } from './_Spot'
import { BaseSpot } from './BaseSpot'
import { HomeSpot } from './HomeSpot'
import { HomeRowSpot } from './HomeRowSpot'
import { MainRingSpot } from './MainRingSpot'

// ENTRANCE CHECKS

export function blockadeOnHome(color: Color, board: Board): boolean {
	return board.getEntrySpot(color).hasBlockade();
}

export function hasFive(possible_distances: number[]): boolean {
	return _distances.findFive(possible_distances).length > 0;
}

// MAIN RING CHECKS

export function isSpotEmpty(spot: _Spot): boolean {
	return spot.nPawns() === 0;
}

export function reformedBlockade(pawn: Pawn, spot: _Spot, starting_blockades: Pawn[][]): boolean {
	if(spot.hasBlockade())
		throw new Error("Checking to see if move reforms blockade, spot already has blockade on it.")
	
	let would_be_pawns: Pawn[] = spot.getLivePawns();
	would_be_pawns.push(pawn);
	// sorting for equality check
	would_be_pawns = would_be_pawns.sort();

	return starting_blockades.some(blockade => { return _.isEqual(would_be_pawns, blockade); });
}

// GLOBAL MOVE CHECKS

// verify that pawn is correct:
// pawn's color matches player
// pawn's ID is legal
export function verifyPawn(pawn: Pawn, color: Color): boolean {
	return !pawnIsWrongColor(pawn, color) && !pawnIdOutsideLegalRange(pawn);
}

export function pawnIsWrongColor(pawn: Pawn, color: Color): boolean {
	return pawn.color !== color;
}

export function pawnIdOutsideLegalRange(pawn: Pawn): boolean {
	return pawn.id >= c.NUM_PLAYER_PAWNS || pawn.id < 0
}

// checks if all legal moves have been made
export function madeAllLegalMoves(possible_distances: number[], player: _Player, board: Board, starting_blockades: Pawn[][]): boolean {
	return ! (legalMoveEnterPossible(possible_distances, player, board, starting_blockades)
						|| legalMoveForwardPossible(possible_distances, player, board, starting_blockades));
}

// checks if all legal MoveEnters have been made
export function legalMoveEnterPossible(possible_distances: number[], player: _Player, board: Board, starting_blockades: Pawn[][]): boolean {
	let base_pawns: Pawn[] = board.getPawnsOfColorInBase(player.color);

	return base_pawns.some(pawn => {
		// TODO - test this
		return new MoveEnter(pawn).isLegal(board, player, possible_distances, starting_blockades);
	});
}

// checks if all legal MoveForwards have been made
export function legalMoveForwardPossible(possible_distances: number[], player: _Player, board: Board, starting_blockades: Pawn[][]): boolean {
	let main_ring_pawns: Pawn[] = board.getPawnsOfColorOnBoard(player.color);

	return main_ring_pawns.some(pawn => {
		return possible_distances.some(distance => {
			// TODO - test this
			return new MoveForward(pawn, distance).isLegal(board, player, possible_distances, starting_blockades);
		});});
}