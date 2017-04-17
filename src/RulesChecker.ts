import { _Player } from '../src/_Player'
import { Parcheesi } from '../src/Parcheesi'
import { BasicPlayer } from '../src/BasicPlayer'
import { Board } from '../src/Board'
import { BaseSpot } from '../src/BaseSpot'
import { HomeRow } from '../src/HomeRow'
import { _Move } from '../src/_Move'
import { MoveEnter } from '../src/MoveEnter'
import { MoveMain } from '../src/MoveMain'
import { Pawn } from '../src/Pawn'
import { Color } from '../src/Color'
import * as c from '../src/Constants'

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

	legalMoveMain(move: _Move, possible_moves: number[], player: _Player, board: Board): boolean {
		return true;
	}

	// ENTRANCE CHECKS
	
	legalMoveEnter(move: _Move, possible_moves: number[], board: Board): boolean {
		return this.hasFive(possible_moves) && this.pawnInBase(move.pawn, board) && this.noBlockadeOnHome(move.pawn.color, board);
	}

	noBlockadeOnHome(color: Color, board: Board): boolean {
		return board.mainRing[c.ENTRY_POINTS[color]].pawns.filter(pawn => {
				return pawn === null;
		}).length > 0;
	};

	pawnInBase(pawn: Pawn, board: Board): boolean {
		if(board.bases[pawn.color] == undefined)
			return false;
		
		let pawns_in_base: (Pawn | null)[] = board.bases[pawn.color].pawns;
		return pawns_in_base.some(base_pawn => {
			return base_pawn && (base_pawn as Pawn).id == pawn.id ? true : false;
		});
	};

	hasFive(possible_moves: number[]): boolean {
		let pairs = this.makePairs(possible_moves);
		return pairs.some(pair => {
			return pair[0] + pair[1] == 5;
		});
	};

	makePairs(possible_moves: number[]): [number, number][]{
		let pairs: [number, number][] = [];
		for(let i = 0; i < possible_moves.length; i++) {
			for(let j = 0; j < i; j++) {
				pairs.push([possible_moves[i], possible_moves[j]]);
			}
		}
		possible_moves.forEach(move => {
			pairs.push([move, 0]);
		});
		return pairs;
	};
}