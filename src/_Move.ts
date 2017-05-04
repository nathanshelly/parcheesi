import { Pawn } from './Pawn'
import { Board } from './Board'
import { _Player } from './_Player'

// represents a possible move
export interface _Move {
	pawn: Pawn;

	isLegal(board: Board, player: _Player, possible_distances: number[], starting_blockades: Pawn[][]): boolean;
}