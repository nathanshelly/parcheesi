import { _Move } from './_Move'
import { Pawn } from './Pawn'
import { Position } from './Position'

// represents a move that starts on the main ring
// (but does not have to end up there)
export class MoveMain implements _Move {
  pawn: Pawn;
  start: Position;
  distance: number;

	constructor(pawn: Pawn, start: Position, distance: number) {
    this.pawn = pawn;
    this.start = start;
    this.distance = distance;
  }
}
