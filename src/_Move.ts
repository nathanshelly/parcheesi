import { Pawn } from './Pawn'

// represents a possible move
export interface _Move {
	pawn: Pawn;
	start: number;
	distance: number;
}