import { Pawn } from './Pawn'
import { Position } from './Position'

// represents a possible move
export interface _Move {
	pawn: Pawn;
	start: Position;
	distance: number;
}