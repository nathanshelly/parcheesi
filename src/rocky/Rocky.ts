// Player, has functions to run game, Coach class will make multiple
// Rockys, running genetic algorithm to find best combinations of
// weighting factors on our heuristic
import * as _ from 'lodash'
import * as util from 'util'
import * as d from '../Distances'

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
		console.log("C'mon, champ, hit me in the face! My mom hits harder than you!");
	}

	allMoves(board: Board, distances: number[]): _Move[][] {
		let final_moves: _Move[][] = [];
		this.allMovesHelper(board, distances, [], final_moves);

		return final_moves.filter(ms => {
			let _board = _.cloneDeep(board);
			let _moves = _.cloneDeep(ms);
			let _distances = _.cloneDeep(distances);
			let roll = new Roll(_board, this, _moves, _distances);

			return roll.take();
		});
	}

	private allMovesHelper(board: Board, distances: number[], current_moves: _Move[], final_moves: _Move[][]): void {
		if(distances.length === 0) {
			final_moves.push(current_moves);
			return;
		}
			
		let new_board: Board, new_distances: number[], new_current_moves: _Move[],
				maybe_bonus: number | null, no_legal_moves: boolean = true;

		board.getPawnsOfColorInBase(this.color).forEach(pawn => {
			let move: MoveEnter = new MoveEnter(pawn);
			if (move.isLegal(board, this, distances)) {
				no_legal_moves = false;

				new_board = _.cloneDeep(board);
				new_distances = _.cloneDeep(distances);
				new_current_moves = _.cloneDeep(current_moves);
				new_current_moves.push(move);

				maybe_bonus = new_board.makeMove(move);
				if(maybe_bonus !== null)
					new_distances.push(maybe_bonus);
				
				new_distances = d.consumeMove(new_distances, move);

				this.allMovesHelper(new_board, new_distances, new_current_moves, final_moves);
			}
		});

		board.getPawnsOfColorOnBoard(this.color).forEach(pawn => {
			distances.forEach(dist => {
				let move: MoveForward = new MoveForward(pawn, dist);

				if(move.isLegal(board, this, distances)) {
					no_legal_moves = false;

					new_board = _.cloneDeep(board);
					new_distances = _.cloneDeep(distances);
					new_current_moves = _.cloneDeep(current_moves);

					// add legal move to current move set
					new_current_moves.push(move);

					// make move and adjust distances accordingly
					maybe_bonus = new_board.makeMove(move);
					if(maybe_bonus !== null)
						new_distances.push(maybe_bonus);
					
					new_distances = d.consumeMove(new_distances, move);
					
					// recursively search for more moves
					this.allMovesHelper(new_board, new_distances, new_current_moves, final_moves);
				}
			});
		});

		if(no_legal_moves)
			final_moves.push(current_moves);
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

		let now = new Date().getTime();
		console.log("About to compute all moves...");
		let allMoves = this.allMoves(brd, distances);

		let ret = _.maxBy(allMoves, goodness);

		console.log(`Chose moves, took ${new Date().getTime() - now}ms`);
		return ret ? ret : [];
	}
}
