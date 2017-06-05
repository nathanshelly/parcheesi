import * as _ from 'lodash'
import * as c from './Constants'
import * as d from './Distances'

import { Pawn } from './Pawn'
import { Color } from './Color';
import { Board } from './Board'
import { _Spot } from './_Spot'
import { _Player } from './_Player'

import { _Move } from './_Move'
import { MoveEnter } from './MoveEnter'
import { MoveForward } from './MoveForward'

export class Roll {
	private starting_blockades: [Pawn[], _Spot][];
	private is_taken: boolean;
	board: Board;
	player: _Player;
	moves: _Move[];
	possible_distances: number[];
	
	constructor(board: Board, player: _Player, moves: _Move[], possible_distances: number[]) {
		this.board = board;
		this.moves = moves;
		this.player = player;
		this.possible_distances = possible_distances;
		
		this.starting_blockades = board.getBlockadesOfColor(player.color);
	}

	take(): boolean {
		if(this.is_taken)
			throw new Error('Tried to take roll twice.')
		else
			this.is_taken = true;

		while(this.moves.length > 0) {
			// because we make sure length > 0, moves.shift() must return move
			let move = this.moves.shift() as _Move;

			if(move.isLegal(this.board, this.player, this.possible_distances)) {
				this.possible_distances = d.consumeMove(this.possible_distances, move);

				let possible_bonus: number | null = this.board.makeMove(move);
				if(possible_bonus !== null)
					this.possible_distances.push(possible_bonus)
			}
			else
				return false;
		}

		if(this.reformedBlockade() || !this.madeAllLegalMoves())
			return false;
		
		return true;
	}

		// checks if all legal moves have been made
	madeAllLegalMoves(): boolean {
		return ! (this.legalMoveEnterPossible() || this.legalMoveForwardPossible());
	}

	// checks if all legal MoveEnters have been made
	legalMoveEnterPossible(): boolean {
		let base_pawns: Pawn[] = this.board.getPawnsOfColorInBase(this.player.color);

		return base_pawns.some(pawn => {
			// TODO - test this
			return new MoveEnter(pawn).isLegal(this.board, this.player, this.possible_distances);
		});
	}

	// checks if all legal MoveForwards have been made
	legalMoveForwardPossible(): boolean {
		let main_ring_pawns: Pawn[] = this.board.getPawnsOfColorOnBoard(this.player.color);

		return main_ring_pawns.some(pawn => {
			return this.possible_distances.some(distance => {
				// TODO - test this
				let move = new MoveForward(pawn, distance)
				let move_legal = move.isLegal(this.board, this.player, this.possible_distances);
				
				/* Important to only check reforms blockade if legal - otherwise danger of null */
				return move_legal && !this.moveReformsBlockade(move);
			});
		});
	}

	moveReformsBlockade(move: MoveForward): boolean {
		let _board = _.cloneDeep(this.board);
		_board.makeMove(move);
		return this.reformedBlockade(_board);
	}

	reformedBlockade(ending_board: Board = this.board): boolean {
		let ending_blockades = ending_board.getBlockadesOfColor(this.player.color);
		return this.starting_blockades.some(sb => {
			return ending_blockades.some(eb => {
				let pawns_equal = _.isEqual(sb[0], eb[0]);
				// let spot_equal = _.isEqual(sb[1], eb[1]);
				let spot_equal = sb[1].index === eb[1].index; // Comparison of spots failing sometimes?
				return pawns_equal && !spot_equal;
			});
		});
	}
}
