import * as _ from 'lodash'
import * as c from './Constants'

import { Pawn } from './Pawn'
import { Color } from './Color'

export abstract class _Spot {
    max_n_pawns: number;
    pawns: (Pawn | null)[];

    index: number; // for debugging purposes

    abstract has_blockade(): boolean;

    n_pawns(): number { return this.get_live_pawns().length; };
    
    // cast as Pawn[] because TypeScript doesn't understand that filter will ensure no null in list:
    // (either Pawn[] or [] which is still Pawn[])
    get_live_pawns(): Pawn[] { return this.pawns.filter(p => { return p !== null}) as Pawn[]; };

    // check if given pawn is in pawns array
    // doesn't allow more than one of same pawn in array
    pawn_exists(pawn: Pawn): boolean { return this.pawns.filter(p => { return _.isEqual(p, pawn); }).length === 1}

    // assumes null spot
    add_pawn(pawn: Pawn): void {this.pawns[this.pawns.indexOf(null)] = pawn}

    // assumes pawn exists
    remove_pawn(pawn: Pawn): void {
        // need to indexOf(true) on mapped array because indexOf comparison
        // won't correctly match pawns on board with player created pawns
        let matching_index: number = this.pawns.map(p => {return _.isEqual(p, pawn); }).indexOf(true);
        this.pawns[matching_index] = null;
    }

    color_of_pawns(): Color | null { return this.n_pawns() > 0 ? this.get_live_pawns()[0].color : null; }
}
