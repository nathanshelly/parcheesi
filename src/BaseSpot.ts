import * as _ from 'lodash'
import * as c from './Constants'

import { _Spot } from './_Spot'
import { Pawn } from './Pawn'
import { Color } from './Color'
import { MainRingSpot } from './MainRingSpot'

export class BaseSpot extends _Spot {
    max_n_pawns: number = c.MAX_N_PAWNS_BASE;
    
    color: Color;
    
    private _next: MainRingSpot;

    constructor(_next: MainRingSpot, color: Color) {
        super();

        this.color = color;
        this.pawns = _.fill(new Array(this.max_n_pawns), null).map((_, i) => {return new Pawn(i, color, this)});

        this._next = _next;
    }

    next(): MainRingSpot {
        return this._next;
    }
}