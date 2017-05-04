import * as c from './Constants'

import { Pawn } from './Pawn'
import { Color } from './Color';
import { Board } from './Board'
import { _Spot } from './_Spot'
import { _Move } from './_Move'
import { _Player } from './_Player'

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
}