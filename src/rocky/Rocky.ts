// Player, has functions to run game, Coach class will make multiple
// Rockys, running genetic algorithm to find best combinations of
// weighting factors on our heuristic

import { Board } from '../Board'
import { Color } from '../Color'
import { _Move } from '../_Move'
import { _Player } from '../_Player'


export class Rocky implements _Player {
	color: Color;

	startGame(color: Color): string {
		this.color = color;
		return "Rocky";
	}

	doublesPenalty(): void {
		console.log("C'mon, champ, hit me in the face! My mom hits harder than you!");
	}

	doMove(brd: Board, distances: number[]): _Move[] {
		return [];		
	}
}