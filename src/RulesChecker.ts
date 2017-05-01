import * as _ from 'lodash'
import * as c from '../src/Constants'
import * as _distances from '../src/Distances'

import { Pawn } from '../src/Pawn'
import { Color } from '../src/Color'
import { Board } from '../src/Board'
import { _Player } from '../src/_Player'
import { Parcheesi } from '../src/Parcheesi'
import { BasicPlayer } from '../src/BasicPlayer'

import { _Move } from '../src/_Move'
import { MoveEnter } from '../src/MoveEnter'
import { MoveForward } from '../src/MoveForward'

import { _Spot } from '../src/_Spot'
import { BaseSpot } from '../src/BaseSpot'
import { HomeSpot } from '../src/HomeSpot'
import { HomeRowSpot } from '../src/HomeRowSpot'
import { MainRingSpot } from '../src/MainRingSpot'


export class RulesChecker {
	legalRoll(moves: _Move[], possible_distances: number[], player: _Player, board: Board): boolean {
		let starting_blockades: Pawn[][] = board.getBlockadesOfColor(player.color);
		// check legality of roll here
		
		while(moves.length > 0) {
			// cannot be undefined due to length condition of while loop
			// TODO check that we still have possible distances
			let move: _Move = moves.shift() as _Move

			if(this.legalMove(move, possible_distances, player, board, starting_blockades)) {
				let possible_bonus: number | null = board.makeMove(move);

				possible_distances = _distances.consumeMove(possible_distances, move);

				if(possible_bonus !== null)
					possible_distances = _distances.addDistance(possible_distances, possible_bonus);
			}
		}

		return this.legalMove(moves[0], possible_distances, player, board, starting_blockades);
	}

	// check legality of one of user's moves
	legalMove(move: _Move, possible_distances: number[], player: _Player, board: Board, starting_blockades: Pawn[][]): boolean {
		if (!this.verifyPawn(move.pawn, player.color))
			return false;
		
		if(move instanceof MoveEnter)
			return this.legalMoveEnter(move, possible_distances, board);
		else if (move instanceof MoveForward)
			return this.legalMoveFoward(move, possible_distances, player, board, starting_blockades);

		return false;
	}

	// ENTRANCE CHECKS
	
	legalMoveEnter(move: MoveEnter, possible_distances: number[], board: Board): boolean {
		return this.hasFive(possible_distances) && !this.blockadeOnHome(move.pawn.color, board) && board.pawnInBase(move.pawn);
	}

	blockadeOnHome(color: Color, board: Board): boolean {
		return board.getEntrySpot(color).has_blockade();
	}

	hasFive(possible_distances: number[]): boolean {
		return _distances.findFive(possible_distances).length > 0;
	}

	// MAIN RING CHECKS

	legalMoveFoward(move: MoveForward, possible_distances: number[], player: _Player, board: Board, starting_blockades: Pawn[][]): boolean {
			if  (move.distance < 1
				|| move.distance > c.LARGEST_POSSIBLE_MOVE
				|| possible_distances.indexOf(move.distance) === -1
				|| board.pawnInBase(move.pawn))
					return false;

		let blockade_on_spot_checker = (spot: _Spot) => { return spot.has_blockade(); };

		// getSpotAtOffsetFromSpot implicitly checks that distance is not off board 
		// (which itself implicitly checks that they enter home on exact value)
		// passed in blockade_on_spot_checker will cause getSpotAtOffsetFromSpot to return null
		// if move attempts to move onto or through blockade
		let final_spot: _Spot | null = board.getSpotAtOffsetFromSpot(board.findPawn(move.pawn),
																										move.distance,
																										player.color,
																										blockade_on_spot_checker);
		
		// overshot home
		if(final_spot === null)
			return false;
		
		// reached home, no further ways to cheat
		if(final_spot instanceof HomeSpot)
			return true;

		// can't reform blockade on same roll
		if(this.reformedBlockade(move.pawn, final_spot, starting_blockades))
			return false;

		// reached homeRowSpot and didn't reform blockade, no further ways to cheat
		if(final_spot instanceof HomeRowSpot)
			return true;
		
		// last way to cheat:
		// bopping pawn on safety spot
		if(final_spot instanceof MainRingSpot)
			if(!this.isSpotEmpty(final_spot) && final_spot.color_of_pawns() !== player.color)
				return board.landingWillBop(move, final_spot);

		// no cheat found, we have a legal MoveForward
		return true;
	}
	
	isSpotEmpty(spot: _Spot): boolean {
		return spot.n_pawns() === 0;
	}

	reformedBlockade(pawn: Pawn, spot: _Spot, starting_blockades: Pawn[][]): boolean {
		if(spot.has_blockade())
			throw new Error("Checking to see if move reforms blockade, spot already has blockade on it.")
		
		let would_be_pawns: Pawn[] = spot.get_live_pawns();
		would_be_pawns.push(pawn);
		// sorting for equality check
		would_be_pawns = would_be_pawns.sort();

		return starting_blockades.some(blockade => { return _.isEqual(would_be_pawns, blockade); });
	}

	// GLOBAL MOVE CHECKS

	// verify that pawn is correct:
	// pawn's color matches player
	// pawn's ID is legal
	verifyPawn(pawn: Pawn, color: Color): boolean {
		return !this.pawnIsWrongColor(pawn, color) && !this.pawnIdOutsideLegalRange(pawn);
	}

	pawnIsWrongColor(pawn: Pawn, color: Color): boolean {
		return pawn.color !== color;
	}

	pawnIdOutsideLegalRange(pawn: Pawn): boolean {
		return pawn.id >= c.NUM_PLAYER_PAWNS || pawn.id < 0
	}

	// checks if all legal moves have been made
	madeAllLegalMoves(possible_distances: number[], player: _Player, board: Board, starting_blockades: Pawn[][]): boolean {
		return ! (this.legalMoveEnterPossible(possible_distances, player, board, starting_blockades)
					 		|| this.legalMoveForwardPossible(possible_distances, player, board, starting_blockades));
	}

	// checks if all legal MoveEnters have been made
	private	legalMoveEnterPossible(possible_distances: number[], player: _Player, board: Board, starting_blockades: Pawn[][]): boolean {
		let base_pawns: Pawn[] = board.getPawnsOfColorInBase(player.color);

		return base_pawns.some(pawn => { 
			// legalMove instead of legalMoveEnter to maintain checking done only in legalMove
			return this.legalMove(new MoveEnter(pawn), possible_distances, player, board, starting_blockades);
		});
	}

	// checks if all legal MoveForwards have been made
	private legalMoveForwardPossible(possible_distances: number[], player: _Player, board: Board, starting_blockades: Pawn[][]): boolean {
		let main_ring_pawns: Pawn[] = board.getPawnsOfColorOnBoard(player.color);

		return main_ring_pawns.some(pawn => {
			return possible_distances.some(distance => { 
				// legalMove instead of legalMoveForward to maintain checking done in legalMove
				return this.legalMove(new MoveForward(pawn, distance), possible_distances, player, board, starting_blockades); 
			});});
	}
}
