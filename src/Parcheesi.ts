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
		this.board = new Board(this.players);

		// player turns loop
		// while(true)
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