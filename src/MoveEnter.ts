import * as d from './Distances'

import { Pawn } from './Pawn'
import { Board } from './Board'
import { _Move } from './_Move'
import { _Player } from './_Player'

// represents a move where a player enters a piece
export class MoveEnter implements _Move {
  pawn: Pawn;

	constructor(pawn: Pawn) {
    this.pawn = pawn;
  }

  isLegal(board: Board, player: _Player, possible_distances: number[]): boolean {
    if(!this.pawn.verify(player.color))
      return false;

    return d.hasFive(possible_distances) && !board.blockadeOnEntrySpot(player.color) && board.pawnInBase(this.pawn);
  }
}
