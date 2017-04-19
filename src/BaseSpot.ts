import * as c from './Constants'
import { _Spot } from './_Spot'
import { Pawn } from './Pawn'
import { Color } from './Color'
import { MainRingSpot } from './MainRingSpot'
import * as _ from 'lodash'

export class BaseSpot implements _Spot {
    max_n_pawns: number = c.MAX_N_PAWNS_BASE;
    pawns: (Pawn | null)[];
    
    color: Color;
    
    private _next: MainRingSpot;

    constructor(_next: MainRingSpot, color: Color) {
        this.color = color;
        this.pawns = _.fill(new Array(this.max_n_pawns), null).map((_, i) => {return new Pawn(i, color, this)});

        this._next = _next;
    }

    next(): MainRingSpot {
        return this._next;
    }
}