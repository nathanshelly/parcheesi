import { _Parcheesi } from './_Parcheesi'
import { _Player } from './_Player'
import { _Move } from './_Move'
import { Board } from './Board'
import { Color } from './Color'
import { MoveEnter } from './MoveEnter'
import { rollDice } from './Dice'

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
  	start() : void {

	};
}