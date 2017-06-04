import { _Player } from './_Player'
import { Color } from './Color'
import { Board } from './Board'
import { _Move } from './_Move'

export abstract class SelfNamingPlayer implements _Player {
	color: Color;
	name: string;

	constructor(name: string) {
		this.name = name;
	}

	startGame(color: Color): string {
		this.color = color;
		return this.name;
	}

	abstract doublesPenalty(): void;

	abstract doMove(brd: Board, distances: number[]): _Move[];
}
