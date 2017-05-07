import * as _ from 'lodash'
import * as c from './Constants'

import { Pawn } from './Pawn'
import { Color } from './Color'
import { _Spot } from './_Spot'
import { HomeSpot } from './HomeSpot'

export class HomeRowSpot extends _Spot {
    max_n_pawns: number = c.MAX_N_PAWNS_HOME_ROW;

    color: Color;

    private _next: HomeRowSpot | HomeSpot;

    index: number; // for debugging purposes

    constructor(ind: number, color: Color) {
        super();

        this.pawns = _.fill(new Array(this.max_n_pawns), null);
        this.color = color;
        this.index = ind;

        if (ind < c.HOME_ROW_SIZE - 1)
            this._next = new HomeRowSpot(ind + 1, color);
        else
            this._next = new HomeSpot(color);
    }

    next(color: Color): _Spot | null {
        return this._next;
    }

    hasBlockade(): boolean {return this.nPawns() === c.MAX_N_PAWNS_HOME_ROW}
}