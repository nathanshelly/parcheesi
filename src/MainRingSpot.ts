import * as c from './Constants'
import { Color } from './Color';
import { _Spot } from './_Spot'
import { HomeRow } from './HomeRow'
import { Pawn } from './Pawn'

export class MainRingSpot implements _Spot {
    home_row: HomeRow | null = null;
    position: number;
    sanctuary: boolean;
    max_n_pawns: number = c.MAX_N_PAWNS_MAIN;
    pawns: (Pawn | null)[];

    constructor(pos: number, sanc: boolean, home_color: Color | null) {
        this.position = pos;
        this.sanctuary = sanc;
        this.pawns = (new Array(this.max_n_pawns)).map(() => {return null});
        if (home_color) {
            this.home_row = new HomeRow(home_color);
        }
    }
}