import * as c from './Constants'
import { _Spot } from './_Spot'
import { Pawn } from './Pawn'

export class HomeRowSpot implements _Spot {
    position: number;
    max_n_pawns: number = c.MAX_N_PAWNS_HOME_ROW;
    pawns: (Pawn | null)[];

    constructor(pos: number) {
        this.position = pos;
        this.pawns = (new Array(this.max_n_pawns).map(() => {return null}));
    }
}