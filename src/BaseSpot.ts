import * as c from './Constants'
import { _Spot } from './_Spot'
import { Pawn } from './Pawn'
import { Color } from './Color'
import { MainRingSpot } from './MainRingSpot'

export class BaseSpot implements _Spot {
    position: number;
    max_n_pawns: number = c.MAX_N_PAWNS_BASE;
    pawns: (Pawn | null)[];
    color: Color;
    entryPoint: MainRingSpot;

    constructor(pos: number, entryPoint: MainRingSpot, color: Color) {
        this.position = pos;
        this.entryPoint = entryPoint;
        this.color = color;
        this.pawns = (new Array(this.max_n_pawns)).map((_, i) => {return new Pawn(i, color)});
    }
}