import { _Move } from './_Move'
import { Pawn } from './Pawn'

// represents a move that starts on one of the home rows
export class MoveHome implements _Move {
  pawn: Pawn;
  start: number;
  distance: number;

  constructor(pawn: Pawn, start: number, distance: number) {
    this.pawn = pawn;
    this.start = start;
    this.distance = distance;
  }
}
