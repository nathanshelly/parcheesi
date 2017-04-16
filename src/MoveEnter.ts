import { _Move } from './_Move'
import { Pawn } from './Pawn'

// represents a move where a player enters a piece
export class MoveEnter implements _Move {
  pawn: Pawn;
  start: number;
  distance: number;

	constructor(pawn: Pawn) {
    this.pawn = pawn;
		this.start = -1;
		this.distance = -1;
  }
}
