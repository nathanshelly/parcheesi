import { BasicPlayer } from './BasicPlayer';
import { Board } from './Board';
import { _Move } from './_Move';
import { Pawn } from './Pawn';
import { RulesChecker } from './RulesChecker';
import { MoveEnter } from './MoveEnter';
import { MoveForward } from './MoveForward';
import * as d from './Distances';

class FirstPawnMover extends BasicPlayer {
	rc: RulesChecker = new RulesChecker();

	doMove(brd: Board, distances: number[]): _Move[] {
		let pawns_in_order: Pawn[] = brd.getPawnsOfColor(this.color);
		let moves: _Move[] = [];
		
		let found: boolean;
		do {
			found = false;

			for (let i = pawns_in_order.length - 1; i >= 0; i--) {
				let pawn = pawns_in_order[i];
				let move = this.moveForPawn(distances, pawn, brd);

				if (move !== null) {
					found = true;
					moves.push(move);
					
					distances = d.consumeDistance(distances, move);

					let bonus = brd.makeMove(move);
					if (bonus !== null)
						distances.push(bonus);
				}
			}
		} while (distances.length > 0 && found)

		return moves;
	}
	
	moveForPawn(distances: number[], pawn: Pawn, board: Board): _Move | null {
		let move: _Move;
		
		if (board.pawnInBase(pawn)) {
			move = new MoveEnter(pawn);
			if (this.rc.legalMoveEnter(move, distances, board))
				return move;
		}
		else {
			for (let i = 0; i < distances.length; i++) {
				move = new MoveForward(pawn, distances[i]);
				if (this.rc.legalMove(move, distances, this, board, board.getBlockadesOfColor(this.color)))
					return move;
			}	
		}

		return null;
	}
}

