import { Color } from './Color'
import { Board } from './Board'
import { _Move } from './_Move'

// represents a player
export interface _Player {
	color: Color;
	// inform the player that a game has started
  // and what color the player is.
	startGame(color: Color): void;

  // ask the player what move they want to make
	doMove(brd: Board, dice: [number, number]): [_Move, _Move];

  // inform the player that they have suffered
  // a doubles penalty
	DoublesPenalty(): void;
}