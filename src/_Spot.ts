import { Color } from './Color'
import { Pawn } from './Pawn'
import { Position } from './Position'

export interface _Spot {
    position: Position;
    max_n_pawns: number;
    pawns: (Pawn | null)[];
}