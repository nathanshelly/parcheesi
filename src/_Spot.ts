import { Color } from './Color'
import { Pawn } from './Pawn'

export interface _Spot {
    max_n_pawns: number;
    pawns: (Pawn | null)[];
}