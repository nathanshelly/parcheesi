import { Pawn } from './Pawn'
import { _Move } from './_Move'

// represents a move that starts on the main ring
// (but does not have to end up there)
export class MoveForward implements _Move {
  pawn: Pawn;
  distance: number;

	constructor(pawn: Pawn, distance: number) {
    this.pawn = pawn;
    this.distance = distance;
  }
}
