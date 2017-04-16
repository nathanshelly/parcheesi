import { Parcheesi } from '../src/Parcheesi'
import { BasicPlayer } from '../src/BasicPlayer'
import { Board } from '../src/Board'
import { BaseSpot } from '../src/BaseSpot'
import { HomeRow } from '../src/HomeRow'
import { _Move } from '../src/_Move'
import { MoveEnter } from '../src/MoveEnter'
import { MoveMain } from '../src/MoveMain'
import { Pawn } from '../src/Pawn'
import { Color } from '../src/Color'
import { RulesChecker } from '../src/RulesChecker'
import * as c from '../src/Constants'

import { expect } from 'chai';
import 'mocha';
import * as _ from 'lodash';

describe('Unit tests for entering with correct number:', () => {
    let game: Parcheesi;
    let checker: RulesChecker;

    beforeEach(() => {
        game = new Parcheesi();
        checker = new RulesChecker();
    });
    
    it('should correctly identify if number five in possible moves', () => {
        let possible_moves: number[] = [5, 1];
        expect(checker.hasFive(possible_moves)).to.equal(true);
    });

    it('should correctly identify if number five in possible moves', () => {
        let possible_moves: number[] = [5, 2, 5, 2];
        expect(checker.hasFive(possible_moves)).to.equal(true);
    });

    it('should correctly identify 1 and 4 combination summing to five in possible moves', () => {
        let possible_moves: number[] = [1, 4];
        expect(checker.hasFive(possible_moves)).to.equal(true);
    });

    it('should correctly identify if combination summing to five in possible moves', () => {
        let possible_moves: number[] = [2, 3];
        expect(checker.hasFive(possible_moves)).to.equal(true);
    });

    it('should correctly identify if no five or combination of 5', () => {
        let possible_moves: number[] = [1, 2];
        expect(checker.hasFive(possible_moves)).to.equal(false);
    });

    it('should correctly identify if no five or combination of 5', () => {
        let possible_moves: number[] = [3, 4, 3, 4];
        expect(checker.hasFive(possible_moves)).to.equal(false);
    });
});

describe('Unit tests for entering pawn in home spot:', () => {
    let game: Parcheesi;
    let checker: RulesChecker;

    beforeEach(() => {
        game = new Parcheesi();
        checker = new RulesChecker();
    });
    
    // it('should correctly identify if blue pawn in base spot', () => {
    //     let pawn = new Pawn(0, Color.Blue);
    //     expect(checker.pawnInBase(pawn)).to.equal(true);
    // });
});