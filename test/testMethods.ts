import * as _ from 'lodash'
import * as c from '../src/Constants'

import { MainRingSpot } from '../src/MainRingSpot'
import { BaseSpot } from '../src/BaseSpot'
import { _Player } from '../src/_Player'
import { Pawn } from '../src/Pawn'
import { Board } from '../src/Board'
import { Color } from '../src/Color'
import { MoveEnter } from '../src/MoveEnter'
import { MoveForward } from '../src/MoveForward'
import { HomeRow } from '../src/HomeRow'
import { _Move } from '../src/_Move'


export function placePawnForTesting(move: _Move, board: Board): void {
		let end_position: Position = board.calculateNewPosition(move.start, move.distance, move.pawn.color);
		let new_pawn_index: number = board.spotForPosition(end_position, move.pawn.color).pawns.indexOf(null);
		board.spotForPosition(move.start, move.pawn.color).pawns[new_pawn_index] = move.pawn;
	}

export function placeBlockade(position: Position, pawns: [Pawn, Pawn], board: Board): void {
	board.spotForPosition(position, pawns[0].color).pawns = pawns;
}