// Player, has functions to run game, Coach class will make multiple
// Rockys, running genetic algorithm to find best combinations of
// weighting factors on our heuristic
import * as _ from 'lodash'
import * as d from '../Distances'

import { Board } from '../Board'
import { Color } from '../Color'
import { _Move } from '../_Move'
import { MoveEnter } from '../MoveEnter'
import { MoveForward } from '../MoveForward'

import { SelfNamingPlayer } from '../SelfNamingPlayer'
import { Heuristic } from './Heuristics'

export class Rocky extends SelfNamingPlayer {
	heuristic: Heuristic;

	constructor(heuristic: Heuristic) {
		super("Rocky");

		this.heuristic = heuristic;
	}

	doublesPenalty(): void {
		console.log("C'mon, champ, hit me in the face! My mom hits harder than you!");
	}

	private allMoves(board: Board, distances: number[]): _Move[][] {
		return this.allMovesHelper(board, distances, []);
	}

	allMovesHelper(board: Board, distances: number[], current_moves: _Move[]): _Move[][] {
		if(distances.length === 0)
			return [current_moves];

		let new_board: Board, new_distances: number[], new_current_moves: _Move[],
				maybe_bonus: number | null, final_moves: _Move[][] = [];

		board.getPawnsOfColorInBase(this.color).forEach(pawn => {
			let move: MoveEnter = new MoveEnter(pawn);
			if (move.isLegal(board, this, distances)) {
				new_board = _.cloneDeep(board);
				new_distances = _.cloneDeep(distances);
				new_current_moves = _.cloneDeep(current_moves);
				new_current_moves.push(move);

				maybe_bonus = new_board.makeMove(move);
				if(maybe_bonus !== null)
					new_distances.push(maybe_bonus);
				
				new_distances = d.consumeMove(distances, move);

				final_moves.concat(this.allMovesHelper(new_board, new_distances, new_current_moves));
			}
		});

		board.getPawnsOfColorOnBoard(this.color).forEach(pawn => {
			distances.forEach(dist => {
				let move: MoveForward = new MoveForward(pawn, dist);

				if(move.isLegal(board, this, distances)) {
					new_board = _.cloneDeep(board);
					new_distances = _.cloneDeep(distances);
					new_current_moves = _.cloneDeep(current_moves);

					// add legal move to current move set
					new_current_moves.push(move);

					// make move and adjust distances accordingly
					maybe_bonus = new_board.makeMove(move);
					if(maybe_bonus !== null)
						new_distances.push(maybe_bonus);
					
					new_distances = d.consumeMove(distances, move);
					
					// recursively search for more moves
					final_moves.concat(this.allMovesHelper(new_board, new_distances, new_current_moves));
				}
			});
		});

		return final_moves;
	}
	

	// TODO: Encapsulate duplicate code in AllMovesHelper here
	// allMovesIndividualMoveApplier() {

	// }

	doMove(brd: Board, distances: number[]): _Move[] {
		let goodness = (moves: _Move[]) => {
			let _brd = _.cloneDeep(brd);
			moves.forEach(_brd.makeMove)

			return this.heuristic(_brd, this.color)
		};

		return [];		
	}
}
