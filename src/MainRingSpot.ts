import * as _ from 'lodash'
import * as c from './Constants'

import { Pawn } from './Pawn'
import { Color } from './Color';
import { _Spot } from './_Spot'
import { HomeRowSpot } from './HomeRowSpot'

export class MainRingSpot extends _Spot {
    private next_main: MainRingSpot;
    private first_home: HomeRowSpot | null;
    
    sanctuary: boolean;
    
    max_n_pawns: number = c.MAX_N_PAWNS_MAIN;

    // index: number; // for debugging purposes

    constructor(sanc: boolean, home_color: Color | null) {
        super();

        this.sanctuary = sanc;
        this.pawns = _.fill(new Array(this.max_n_pawns), null);
        
        if (home_color !== null) // home_color can be equal to zero
            this.first_home = new HomeRowSpot(0, home_color);
    }

    // private flag enforces calling setNextMain once
    private called: boolean = false;
    setNextMain(spot: MainRingSpot): void { 
        if (this.called)
            throw new Error("Tried to set MainRingSpot next twice");

        this.called = true;
        this.next_main = spot;
    }

    next(c: Color): HomeRowSpot | MainRingSpot {
        if (this.first_home && this.first_home.color == c)
            return this.first_home;
        return this.next_main;
    }

    has_blockade(): boolean {return this.n_pawns() === c.MAX_N_PAWNS_MAIN}
}