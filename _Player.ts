interface _Player {
	// inform the player that a game has started
  // and what color the player is.
  // void startGame(String color);
	startGame(color: string): void;

  // ask the player what move they want to make
  // Move doMove(Board brd, int[] dice)
	doMove(brd: Board, dice: number[]): Move;

  // inform the player that they have suffered
  // a doubles penalty
  // void DoublesPenalty();
	DoublesPenalty(): void;
}