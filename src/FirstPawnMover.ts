import * as d from './Distances';
import * as checker from '../src/RulesChecker'

import { Pawn } from './Pawn';
import { Board } from './Board';
import { _Move } from './_Move';
import { PawnMover } from './PawnMover';
import { MoveEnter } from './MoveEnter';
import { BasicPlayer } from './BasicPlayer';
import { MoveForward } from './MoveForward';

export class FirstPawnMover extends PawnMover {
	doMove(brd: Board, distances: number[]): _Move[] {
		return this.movesForPawns(brd, distances, true);
	}
}
