import { Pawn } from './Pawn'

export abstract class _Spot {
    max_n_pawns: number;
    pawns: (Pawn | null)[];

    n_pawns(): number { return this.pawns.filter(p => { return p != null }).length; };
}
