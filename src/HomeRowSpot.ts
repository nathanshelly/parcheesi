import * as c from './Constants'
import { _Spot } from './_Spot'
import { Pawn } from './Pawn'
import { Color } from './Color'
import { HomeSpot } from './HomeSpot'
import * as _ from 'lodash'

export class HomeRowSpot implements _Spot {
    max_n_pawns: number = c.MAX_N_PAWNS_HOME_ROW;
    pawns: (Pawn | null)[];

    color: Color;

    private _next: HomeRowSpot | HomeSpot;

    constructor(ind: number, color: Color) {
        this.pawns = _.fill(new Array(this.max_n_pawns), null);
        this.color = color;

        if (ind === c.HOME_ROW_SIZE)
            this._next = new HomeSpot(color);
        else
            this._next = new HomeRowSpot(ind + 1, color);
    }

    next(): HomeRowSpot | HomeSpot {
        return this._next;
    }
}