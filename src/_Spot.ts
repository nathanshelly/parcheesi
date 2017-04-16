import { Color } from './Color'
import { Pawn } from './Pawn'

export interface _Spot {
    position: number;
    max_n_pawns: number;
    pawns: (Pawn | null)[];
}