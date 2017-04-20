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
	legalMove(move: _Move, possible_moves: number[], player: _Player, board: Board, ): boolean {
		if (this.pawnIsWrongColor(move.pawn, player.color) || this.pawnIdOutsideLegalRange(move.pawn))
			return false;

		if(move instanceof MoveEnter)
			return this.legalMoveEnter(move, possible_moves, board);
		else
			return this.legalMoveMain(move, possible_moves, player, board);
	}

	// GLOBAL MOVE CHECKS

	// verify that move is valid
	// means verifying pawn
	// and confirming that distance will not move piece off board 
	// (ignoring roadblocks or anything else that might invalidate the move)
	verifyMove(move: _Move, color: Color, board: Board) {
		
		
		let valid_distance: boolean = true;
		if(move instanceof MoveForward)
			valid_distance = board.advanceToNewSpot(move.pawn.spot, move.distance, color) ? true : false;

		return valid_distance && this.verifyPawn(move.pawn, color, board);
	}

	// verify that pawn is correct:
	// pawn's color matches player
	// pawn's ID is legal
	// pawn is where it says it is
	verifyPawn(pawn: Pawn, color: Color, board: Board) {
		return !this.pawnIsWrongColor(pawn, color) && !this.pawnIdOutsideLegalRange(pawn) && this.pawnInSpot(pawn, board);
	}

	pawnIsWrongColor(pawn: Pawn, color: Color): boolean {
		return pawn.color !== color;
	}

	pawnIdOutsideLegalRange(pawn: Pawn): boolean {
		return pawn.id >= c.NUM_PLAYER_PAWNS || pawn.id < 0
	}

	// players can make own spots so can't trust that pawn's spot
	// is actually a spot on board
	pawnInSpot(pawn: Pawn, board: Board): boolean {
		// split into two functions called based on move type?
		let pawns: Pawn[] = board.getPawnsOfColor(pawn.color);

		// _.isEqual should do what we expect, make sure tests confirm this
		// should only be possible to have pawn match one pawn on board
		// if not, previous invariant has failed
		return pawns.some(p => { return _.isEqual(pawn, p); });
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

	legalMoveMain(move: _Move, possible_moves: number[], player: _Player, board: Board): boolean {
		return true;
	}

	// ENTRANCE CHECKS
	
	legalMoveEnter(move: _Move, possible_moves: number[], board: Board): boolean {
		return this.hasFive(possible_moves) && this.pawnInBase(move.pawn, board) && !this.blockadeOnHome(move.pawn.color, board);
	}

	blockadeOnHome(color: Color, board: Board): boolean {
		return board.mainRing[c.ENTRY_POINTS[color]].has_blockade();
	};

	// assumes pawns color and id are correct
	// must be checked previously
	// does not assume pawn's spot is correct
	pawnInBase(pawn: Pawn, board: Board): boolean {
		if(board.bases[pawn.color] === undefined)
			return false;
		
		return pawn.
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