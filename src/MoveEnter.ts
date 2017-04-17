import { _Move } from './_Move'
import { Pawn } from './Pawn'
import { Position } from './Position'
import * as c from '../src/Constants'

// represents a move where a player enters a piece
export class MoveEnter implements _Move {
  pawn: Pawn;
  start: Position;
  distance: number;

	constructor(pawn: Pawn) {
    this.pawn = pawn;
		this.start = new Position(c.BASE_POSITION.main_ring_location, c.BASE_POSITION.home_row_location);
		this.distance = c.BASE_POSITION.main_ring_location;
  }
}
