import * as d from './Distances';
import * as checker from './RulesChecker';

import { _Move } from './_Move';
import { MoveEnter } from './MoveEnter';
import { MoveForward } from './MoveForward';

import { Pawn } from './Pawn';
import { Board } from './Board';
import { BasicPlayer } from './BasicPlayer';

export abstract class PawnMover extends BasicPlayer {
	movesForPawns(brd: Board, distances: number[], pawns: Pawn[]): _Move[] {
		let moves: _Move[] = [];
		
		let found: boolean;
		do {
			found = false;

			for (let i = 0; i < pawns.length; i++) {
				let pawn = pawns[i];
				let move = this.moveForPawn(distances, pawn, brd);

				if (move !== null) {
					found = true;
					moves.push(move);
					
					distances = d.consumeMove(distances, move);

					let bonus = brd.makeMove(move);
					if (bonus !== null)
						distances.push(bonus);
					
					break;
				}
			}
		} while (distances.length > 0 && found)

		return moves;
	}
	
	moveForPawn(distances: number[], pawn: Pawn, board: Board): _Move | null {
		let move: _Move;
		
		if (board.pawnInBase(pawn)) {
			move = new MoveEnter(pawn);
			if (checker.legalMoveEnter(move, distances, board))
				return move;
		}
		else {
			for (let i = 0; i < distances.length; i++) {
				move = new MoveForward(pawn, distances[i]);
				if (checker.legalMove(move, distances, this, board, board.getBlockadesOfColor(this.color)))
					return move;
			}	
		}

		return null;
	}

}

