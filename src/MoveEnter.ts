import { Pawn } from './Pawn'
import { _Move } from './_Move'

// represents a move where a player enters a piece
export class MoveEnter implements _Move {
  pawn: Pawn;

	constructor(pawn: Pawn) {
    this.pawn = pawn;
  }
}
