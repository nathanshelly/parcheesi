import * as _ from 'lodash'
import * as c from './Constants'

import { Pawn } from './Pawn'

export abstract class _Spot {
    max_n_pawns: number;
    pawns: (Pawn | null)[];

    n_pawns(): number { return this.get_live_pawns().length; };
    
    has_blockade(): boolean { return this.n_pawns() === c.NUM_PAWNS_IN_BLOCKADE}

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
        let matching_index: number = this.pawns.map(p => {return _.isEqual(p, pawn); }).indexOf(true);
        this.pawns[matching_index] = null;
    }
}
