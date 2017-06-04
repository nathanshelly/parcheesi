// Player, has functions to run game, Coach class will make multiple
// Rockys, running genetic algorithm to find best combinations of
// weighting factors on our heuristic
import * as _ from 'lodash'

import { Board } from '../Board'
import { Color } from '../Color'
import { _Move } from '../_Move'
import { SelfNamingPlayer } from '../SelfNamingPlayer'
import { Heuristic } from './Heuristics'

export class Rocky extends SelfNamingPlayer {
	heuristic: Heuristic;

	constructor(heuristic: Heuristic) {
		super("Rocky");

		this.heuristic = heuristic;
	}

	doublesPenalty(): void {
		console.log("C'mon, champ, hit me in the face! My mom hits harder than you!");
	}

	private allMoves(board: Board, distances: number[]): _Move[] {
		return [];
	}

	doMove(brd: Board, distances: number[]): _Move[] {
		let goodness = (moves: _Move[]) => {
			let _brd = _.cloneDeep(brd);
			moves.forEach(_brd.makeMove)

			return this.heuristic(_brd, this.color)
		};

		return [];		
	}
}
