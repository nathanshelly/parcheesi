import * as c from './Constants'
import { _Spot } from './_Spot'
import { Pawn } from './Pawn'
import * as _ from 'lodash'

export class HomeRowSpot implements _Spot {
    position: number;
    max_n_pawns: number = c.MAX_N_PAWNS_HOME_ROW;
    pawns: (Pawn | null)[];

    constructor(pos: number) {
        this.position = pos;
        this.pawns = _.fill(new Array(this.max_n_pawns), null).map(() => {return null});
    }
}