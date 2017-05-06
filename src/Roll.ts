import * as c from './Constants'

import { Pawn } from './Pawn'
import { Color } from './Color';
import { Board } from './Board'
import { _Spot } from './_Spot'
import { _Player } from './_Player'

import { _Move } from './_Move'
import { MoveEnter } from './MoveEnter'
import { MoveForward } from './MoveForward'

export class Roll {
	private starting_blockades: Pawn[][];
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

			if(move.isLegal(this.board, this.player, this.possible_distances, this.starting_blockades)) {
				let possible_bonus: number | null = this.board.makeMove(move);
				if(possible_bonus !== null)
					this.possible_distances.push(possible_bonus)
			}
			else
				return false;
		}
		
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
			return new MoveEnter(pawn).isLegal(this.board, this.player, this.possible_distances, this.starting_blockades);
		});
	}

	// checks if all legal MoveForwards have been made
	legalMoveForwardPossible(): boolean {
		let main_ring_pawns: Pawn[] = this.board.getPawnsOfColorOnBoard(this.player.color);

		return main_ring_pawns.some(pawn => {
			return this.possible_distances.some(distance => {
				// TODO - test this
				return new MoveForward(pawn, distance).isLegal(this.board, this.player, this.possible_distances, this.starting_blockades);
			});});
	}
}