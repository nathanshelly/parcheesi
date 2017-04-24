import * as _ from 'lodash'
import * as c from '../src/Constants'

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
	legalRoll(moves: _Move[], possible_moves: number[], player: _Player, board: Board): boolean {
		let starting_blockades: Pawn[][] = board.findBlockadesOfColor(player.color);
		// check legality of roll here
		// for testing purposes assumes moves has one move

		// AT SOME POINT
		
		while(moves.length > 0) {
			// cannot be undefined due to length condition of while loop
			let move: _Move = moves.shift() as _Move
			if(this.legalMove(move, possible_moves, player, board, starting_blockades))
				board.makeMove(move)
		}

		return this.legalMove(moves[0], possible_moves, player, board, starting_blockades);
	}

	// check legality of one of user's moves
	legalMove(move: _Move, possible_moves: number[], player: _Player, board: Board, starting_blockades: Pawn[][]): boolean {
		if (!this.verifyPawn(move.pawn, player.color))
			return false;
		
		if(move instanceof MoveEnter)
			return this.legalMoveEnter(move, possible_moves, board);
		else if (move instanceof MoveForward)
			return this.legalMoveFoward(move, possible_moves, player, board, starting_blockades);

		return false;
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

	madeAllLegalMoves(possible_moves: number[], player: _Player, board: Board, starting_blockades: Pawn[][]): boolean {
		let base_pawns: Pawn[] = board.getPawnsOfColorInBase(player.color);

		if(base_pawns.some(pawn => { return this.legalMove(new MoveEnter(pawn), possible_moves, player, board, starting_blockades); }))
			return false;

		let main_ring_pawns: Pawn[] = board.getPawnsOfColorOnBoard(player.color);

		if(main_ring_pawns.some(pawn => {
			return possible_moves.some(distance => { 
				return this.legalMove(new MoveForward(pawn, distance), possible_moves, player, board, starting_blockades); 
			});
		}))
			return false;
		
		return true;
	}

	// MAIN RING CHECKS

	legalMoveFoward(move: MoveForward, possible_moves: number[], player: _Player, board: Board, starting_blockades: Pawn[][]): boolean {
			if (move.distance < 1
				|| move.distance > c.LARGEST_POSSIBLE_MOVE
				|| possible_moves.indexOf(move.distance) === -1
				|| board.pawnInBase(move.pawn))
					return false;

		let blockade_on_spot = (spot: _Spot) => { return spot.has_blockade(); };

		// spotRunner implicitly checks that distance is not off board 
		// (which itself implicitly checks that they enter home on exact value)
		let final_spot: _Spot | null = board.spotRunner(board.findPawn(move.pawn),
																										move.distance,
																										player.color,
																										blockade_on_spot);

		if(final_spot === null)
			return false;
		if(final_spot instanceof HomeSpot)
			return true;

		if(this.reformedBlockade(move.pawn, final_spot, starting_blockades))
			return false;
		if(final_spot instanceof HomeRowSpot)
			return true;
		
		if(final_spot instanceof MainRingSpot)
			if(!this.isSpotEmpty(final_spot) && final_spot.color_of_pawns() !== player.color)
				return board.landingWillBop(move, final_spot);

		return true;
	}
	
	isSpotEmpty(spot: _Spot): boolean {
		return spot.n_pawns() === 0;
	}

	reformedBlockade(pawn: Pawn, spot: _Spot, starting_blockades: Pawn[][]): boolean {
		// passed in spot is assumed to have no blockade due to sequencing of calls
		let would_be_pawns: Pawn[] = spot.get_live_pawns();
		would_be_pawns.push(pawn);

		return starting_blockades.filter(blockade => { return _.isEqual(would_be_pawns, blockade); }).length === 1;
	}

	isSafetySpot(spot: _Spot): boolean {
		if(spot instanceof MainRingSpot)
			return spot.sanctuary;

		return false;
	}


	// ENTRANCE CHECKS
	
	legalMoveEnter(move: MoveEnter, possible_moves: number[], board: Board): boolean {
		return this.hasFive(possible_moves) && !this.blockadeOnHome(move.pawn.color, board) && board.pawnInBase(move.pawn);
	}

	blockadeOnHome(color: Color, board: Board): boolean {
		return board.getEntrySpot(color).has_blockade();
	};

	// determine if set of pairs has any pair that sums to c.ENTRY_VALUE
	hasFive(possible_moves: number[]): boolean {
		let pairs = this.makeDiceCombinations(possible_moves);
		return pairs.some(pair => {
			return pair[0] + pair[1] == c.ENTRY_VALUE;
		});
	};

	makeDiceCombinations(possible_moves: number[]): [number, number][]{
		let pairs: [number, number][] = [];
		
		// generate all pairs of dice 
		for(let i = 0; i < possible_moves.length; i++) {
			for(let j = 0; j < i; j++) {
				pairs.push([possible_moves[i], possible_moves[j]]);
			}
		}

		// add lone pawn combos
		possible_moves.forEach(move => { pairs.push([move, 0]); });
		return pairs;
	};
}