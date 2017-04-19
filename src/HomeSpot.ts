import * as _ from 'lodash'
import * as c from './Constants'

import { Pawn } from './Pawn'
import { Color } from './Color'
import { _Spot } from './_Spot'

export class HomeSpot implements _Spot {
    max_n_pawns: number = c.MAX_N_PAWNS_HOME_SPOT;
    pawns: (Pawn | null)[];

    color: Color;

    constructor(color: Color) {
        this.pawns = _.fill(new Array(this.max_n_pawns), null);
        this.color = color;
    }
}