import * as _ from 'lodash'
import * as c from '../src/Constants'

import { Pawn } from '../src/Pawn'
import { Board } from '../src/Board'
import { Color } from '../src/Color'

export function placeBlockade(pawns: [Pawn, Pawn], board: Board, color: Color): void {
	board.getEntrySpot(color).pawns = pawns;
}