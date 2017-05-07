import * as _ from 'lodash'
import * as c from './Constants'

import { Pawn } from './Pawn'
import { Color } from './Color'

export abstract class _Spot {
    max_n_pawns: number;
    pawns: (Pawn | null)[];

    index: number; // for debugging purposes

    abstract hasBlockade(): boolean;

    abstract next(color: Color): _Spot | null;

    // cast as Pawn[] because TypeScript doesn't understand that filter will ensure no null in list:
    // (either Pawn[] or [] which is still Pawn[])
    getLivePawns(): Pawn[] { return this.pawns.filter(p => { return p !== null}) as Pawn[]; };

    nPawns(): number { return this.getLivePawns().length; };
    
    isEmpty(): boolean { return this.nPawns() === 0; }

    // TODO: maybe not self-explanatory enough? even necessary?
    colorOfPawns(): Color | null { return this.nPawns() > 0 ? this.getLivePawns()[0].color : null; }
    
    // check if given pawn is in pawns array
    // doesn't allow more than one of same pawn in array
    pawnExists(pawn: Pawn): boolean { return this.pawns.filter(p => { return _.isEqual(p, pawn); }).length === 1}

    addPawn(pawn: Pawn): void {
        if(this.nPawns() === this.max_n_pawns)
            throw new Error("Spot is already full!");
        if(this.pawnExists(pawn))
            throw new Error("Pawn already on spot!");

        this.pawns[this.pawns.indexOf(null)] = pawn;
    }

    removePawn(pawn: Pawn): void {
        if(!this.pawnExists(pawn))
            throw new Error("Pawn doesn't exist on spot!");

        // need to indexOf(true) on mapped array because indexOf comparison
        // won't correctly match pawns on board with player created pawns
        let matching_index: number = this.pawns.map(p => {return _.isEqual(p, pawn); }).indexOf(true);
        this.pawns[matching_index] = null;
    }
}
