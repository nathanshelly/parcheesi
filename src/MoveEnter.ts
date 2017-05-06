import * as checker from './RulesChecker'

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

  isLegal(board: Board, player: _Player, possible_distances: number[], starting_blockades: Pawn[][]): boolean {
    if(!this.pawn.verify(player.color))
      return false;

    return checker.hasFive(possible_distances) && !checker.blockadeOnHome(player.color, board) && board.pawnInBase(this.pawn);
  }
}
