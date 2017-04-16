import * as c from './Constants'
import { _Spot } from './_Spot'
import { Pawn } from './Pawn'
import { Color } from './Color'

export class HomeSpot implements _Spot {
    position: number = c.HOME_ROW_SIZE;
    max_n_pawns: number = c.MAX_N_PAWNS_HOME_SPOT;
    pawns: (Pawn | null)[];

    constructor() {
        this.pawns = (new Array(this.max_n_pawns)).map(() => {return null});
    }
}