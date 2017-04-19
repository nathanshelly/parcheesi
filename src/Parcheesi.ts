import { Board } from './Board'
import { _Player } from './_Player'
import { _Parcheesi } from './_Parcheesi'

export class Parcheesi implements _Parcheesi {
	players: _Player[] = [];
	board: Board;

	// add a player to the game
	register(p: _Player): void {
		if (this.players.length > 3) {
			// fail silently for now
		}
		else {
			this.players.push(p);
		}
	};

	// start a game
	start(): void {
		this.board = new Board(this.players);
	};
};