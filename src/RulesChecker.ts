import * as _ from 'lodash'
import * as c from '../src/Constants'

import { Pawn } from '../src/Pawn'
import { Color } from '../src/Color'
import { Board } from '../src/Board'
import { BaseSpot } from '../src/BaseSpot'
import { _Player } from '../src/_Player'
import { Parcheesi } from '../src/Parcheesi'
import { BasicPlayer } from '../src/BasicPlayer'

import { _Move } from '../src/_Move'
import { MoveEnter } from '../src/MoveEnter'
import { MoveForward } from '../src/MoveForward'


export class RulesChecker {
	legalMove(move: _Move, possible_moves: number[], player: _Player, board: Board): boolean {
		if (!this.moveWellFormed(move, player.color, board))
			return false;
		
		if(move instanceof MoveEnter)
			return this.legalMoveEnter(move, possible_moves, board);
		else if (move instanceof MoveForward)
			return this.legalMoveFoward(move, possible_moves, player, board);

		return false;
	}

	// GLOBAL MOVE CHECKS

	// verify that move is valid
	// means verifying pawn
	// and in case of MoveForward confirming that distance will not move piece off board
	// (ignoring roadblocks or anything else that might invalidate the move)
	moveWellFormed(move: _Move, color: Color, board: Board): boolean {
		if(!this.verifyPawn(move.pawn, color))
			return false;
		
		if(move instanceof MoveForward)
			if	(move.distance <= 0
				|| move.distance > c.LARGEST_POSSIBLE_MOVE
				|| board.advanceToNewSpot(board.findPawn(move.pawn), move.distance, color) === null)
					return false;

		return true;
	}

	// verify that pawn is correct:
	// pawn's color matches player
	// pawn's ID is legal
	verifyPawn(pawn: Pawn, color: Color) {
		return !this.pawnIsWrongColor(pawn, color) && !this.pawnIdOutsideLegalRange(pawn);
	}

	pawnIsWrongColor(pawn: Pawn, color: Color): boolean {
		return pawn.color !== color;
	}

	pawnIdOutsideLegalRange(pawn: Pawn): boolean {
		return pawn.id >= c.NUM_PLAYER_PAWNS || pawn.id < 0
	}

	// madeAllLegalMoves(possible_moves: number[], board: Board, player: _Player): boolean {
	// 	// TODO: actually write this function, check that remaining moves cannot be played
	// 	return true;

	// 	let pawns: Pawn[] = board.findPawnsOfColorOnBoard(player.color);
	// 	return possible_moves.filter(move => {
	// 		pawns.some(pawn => {
	// 			if()
				
	// 			let move = new Move
	// 			this.legalMove()
	// 		});
	// 		this.legalMove()
	// 	}).length === 0;
	// }

	// MAIN RING CHECKS

	legalMoveFoward(move: _Move, possible_moves: number[], player: _Player, board: Board): boolean {
		return true;
	}

	blockadeInPath(move: _Move, color: Color, board: Board) {
				

		return 
	}

	// ENTRANCE CHECKS
	
	legalMoveEnter(move: _Move, possible_moves: number[], board: Board): boolean {
		return this.hasFive(possible_moves) && this.pawnInBase(move.pawn, board) && !this.blockadeOnHome(move.pawn.color, board);
	}

	blockadeOnHome(color: Color, board: Board): boolean {
		return board.getEntrySpot(color).has_blockade();
	};

	// assumes pawns color and id are correct
	// must be checked previously
	// does not assume pawn's spot is correct
	pawnInBase(pawn: Pawn, board: Board): boolean {
		return board.getBaseSpot(pawn.color).pawn_exists(pawn);
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