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
	legalMove(move: _Move, possible_moves: number[], board: Board): boolean {
		if(move instanceof MoveEnter)
			return this.legalMoveEnter(move, possible_moves, board);
		else
			return this.legalMoveMain(move, possible_moves, board);
	}

	legalMoveEnter(move: _Move, possible_moves: number[], board: Board): boolean {
		return this.hasFive(possible_moves);
	}

	legalMoveMain(move: _Move, possible_moves: number[], board: Board): boolean {
		return true;
	}



	pawnInBase(pawn: Pawn, board: Board) {
		let pawns_in_base: (Pawn | null)[] = board.bases[pawn.color].pawns;
		return pawns_in_base.indexOf
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