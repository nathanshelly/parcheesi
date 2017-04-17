import * as c from './Constants'
import { _Spot } from './_Spot'
import { Pawn } from './Pawn'
import { Position } from './Position'
import * as _ from 'lodash'

export class HomeRowSpot implements _Spot {
    position: Position;
    max_n_pawns: number = c.MAX_N_PAWNS_HOME_ROW;
    pawns: (Pawn | null)[];

    constructor(pos: Position) {
        this.position = pos;
        this.pawns = _.fill(new Array(this.max_n_pawns), null);
    }
}