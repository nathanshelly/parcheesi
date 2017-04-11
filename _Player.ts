// represents a player
interface _Player {
	// inform the player that a game has started
  // and what color the player is.
	startGame(color: Color): void;

  // ask the player what move they want to make
	doMove(brd: _Board, dice: [number, number]): [_Move, _Move];

  // inform the player that they have suffered
  // a doubles penalty
	DoublesPenalty(): void;
}