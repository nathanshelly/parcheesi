interface _Game {
	// add a player to the game
  register(p: Player): void;
  
  // start a game
  start() : void;	
}