// Player, has functions to run game, Coach class will make multiple
// Rockys, running genetic algorithm to find best combinations of
// weighting factors on our heuristic
import * as _ from 'lodash'
import * as util from 'util'
import * as d from '../Distances'
import { MAX_MOVES_TO_CONSIDER } from './coach_config'

import { Board } from '../Board'
import { Roll } from '../Roll'
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
		// console.log("C'mon, champ, hit me in the face! My mom hits harder than you!");
	}

	allMoves(board: Board, distances: number[]): _Move[][] {
		let final_moves: _Move[][] = [];
		this.allMovesHelper(board, distances, [], final_moves, distances, board);

		return final_moves;
	}

	private allMovesHelper(board: Board, distances: number[], current_moves: _Move[], final_moves: _Move[][], starting_dice: number[], starting_board: Board): void {

		if (final_moves.length > MAX_MOVES_TO_CONSIDER) {
			return;
		}

		let new_board: Board, new_distances: number[], new_current_moves: _Move[],
			maybe_bonus: number | null;

		board.getPawnsOfColorInBase(this.color).forEach(pawn => {
			let move: MoveEnter = new MoveEnter(pawn);
			if (move.isLegal(board, this, distances)) {
				// Isolate from usage in other branches
				new_current_moves = _.cloneDeep(current_moves);
				new_current_moves.push(move); // Add current move
				new_board = _.cloneDeep(board);
				new_distances = _.cloneDeep(distances);
				
				let cloned_new_current_moves = _.cloneDeep(new_current_moves);
				let cloned_starting_board = _.cloneDeep(starting_board);
				let cloned_starting_dice = _.cloneDeep(starting_dice);
				let roll = new Roll(cloned_starting_board, this, cloned_new_current_moves, cloned_starting_dice);
				if (roll.take()) {
					final_moves.push(new_current_moves);
					return;
				}

				// Apply move, add bonues as appropriate
				maybe_bonus = new_board.makeMove(move);
				if (maybe_bonus !== null)
					new_distances.push(maybe_bonus);

				new_distances = d.consumeMove(new_distances, move);

				// Pass altered board down the chain to build set
				this.allMovesHelper(new_board, new_distances, new_current_moves, final_moves, starting_dice, starting_board);
			}
		});

		board.getPawnsOfColorOnBoard(this.color).forEach(pawn => {
			distances.forEach(dist => {
				let move: MoveForward = new MoveForward(pawn, dist);

				if (move.isLegal(board, this, distances)) {
					// Isolate from usage in other branches
					new_current_moves = _.cloneDeep(current_moves);
					new_current_moves.push(move); // Add current move
					new_board = _.cloneDeep(board);
					new_distances = _.cloneDeep(distances);
					
					let cloned_new_current_moves = _.cloneDeep(new_current_moves);
					let cloned_starting_board = _.cloneDeep(starting_board);
					let cloned_starting_dice = _.cloneDeep(starting_dice);
					let roll = new Roll(cloned_starting_board, this, cloned_new_current_moves, cloned_starting_dice);
					if (roll.take()) {
						final_moves.push(new_current_moves);
						return;
					}

					// Apply move, add bonues as appropriate
					maybe_bonus = new_board.makeMove(move);
					if (maybe_bonus !== null)
						new_distances.push(maybe_bonus);

					new_distances = d.consumeMove(new_distances, move);

					// Pass altered board down the chain to build set
					this.allMovesHelper(new_board, new_distances, new_current_moves, final_moves, starting_dice, starting_board);
				}
			});
		});
	}


	// TODO: Encapsulate duplicate code in AllMovesHelper here
	// allMovesIndividualMoveApplier() {

	// }

	doMove(brd: Board, distances: number[]): _Move[] {
		let goodness = (moves: _Move[]) => {
			let _brd = _.cloneDeep(brd);
			moves.forEach(_brd.makeMove, _brd)

			return this.heuristic(_brd, this.color)
		};

		let allMoves = this.allMoves(brd, distances);

		let ret = _.maxBy(allMoves, goodness);

		return ret ? ret : [];
	}
}
