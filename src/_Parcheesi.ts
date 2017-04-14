import { _Player } from './_Player'

// represents a game
export interface _Parcheesi {

	// add a player to the game
  register(p: _Player): void;
  
  // start a game
  start() : void;
}