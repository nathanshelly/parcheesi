import * as _ from 'lodash'

import { Turn } from './Turn'
import { Board } from './Board'
import { Color } from './Color'
import { _Player } from './_Player'
import { _Parcheesi } from './_Parcheesi'

export class Parcheesi implements _Parcheesi {
	players: _Player[] = [];
	board: Board;

	// add a player to the game
	register(p: _Player): void {
		if (this.players.length > 3) {
			throw new Error("Tried to register more than 4 players")
		}
		else {
			this.players.push(p);
		}
	};

	// start a game
	start(): void {
		this.board = new Board();
	};

	// start a real game
	start_real_game(): void {
		if(this.players.length === 0)
			throw new Error("No players!")

		this.board = new Board();

		let turn: number = 0;
		// player turns loop
		while(!this.winner()) {
			let board_copy: Board = _.cloneDeep(this.board);
			let current_turn: Turn = new Turn(board_copy, this.players[turn]);
			
			let possible_new_board = current_turn.take();
			// possible_new_board !== null 
			// 	? this.board = possible_new_board 
			// 	: this.bootPlayer();

			if(possible_new_board !== null)
				this.board = possible_new_board;
			else
				// handle cheater

			// needs to be more sophisticated once we start booting cheaters
			turn = (turn + 1) % this.players.length;
		}
	};

	winner(): Color | null {
		let homes = this.board.getHomeSpots();
		for (let i = 0; i < homes.length; ++i)
			// TODO - test if below works, cleaner than looking for null
			// if (homes[i].n_pawns() === c.NUM_PLAYER_PAWNS)
			if (homes[i].pawns.indexOf(null) !== -1)
				return homes[i].color;

		return null;
	}
};