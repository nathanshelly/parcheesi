// represents a game
interface _Game {

	// add a player to the game
  register(p: _Player): void;
  
  // start a game
  start() : void;
}