import * as _ from 'lodash'
import * as c from '../src/Constants'
import * as checker from '../src/RulesChecker'

import { Pawn } from '../src/Pawn'
import { Color } from '../src/Color'
import { Board } from '../src/Board'
import { _Player } from '../src/_Player'
import { Parcheesi } from '../src/Parcheesi'
import { BasicPlayer } from '../src/BasicPlayer'

import { _Move } from '../src/_Move'
import { MoveEnter } from '../src/MoveEnter'
import { MoveForward } from '../src/MoveForward'

import { _Spot } from '../src/_Spot'
import { BaseSpot } from '../src/BaseSpot'
import { HomeSpot } from '../src/HomeSpot'
import { HomeRowSpot } from '../src/HomeRowSpot'
import { MainRingSpot } from '../src/MainRingSpot'

import { expect } from 'chai';
import 'mocha';

class PrettyDumbPlayer extends BasicPlayer {
    doMove(brd: Board, distances: number[]): _Move[] {
        throw new Error('Method not implemented - not needed in testing board instantiaton.');
    }
}

describe('Filename: move_foward_unit.test.ts\n\nUnit tests for main moves:', () => {
    let game: Parcheesi;

    beforeEach(() => {
        game = new Parcheesi();
        let player1 = new PrettyDumbPlayer();
        player1.startGame(Color.Green);
        game.register(player1)
        game.start();
    });

    it('should correctly identify if number five in possible moves', () => {
        let possible_distances: number[] = [c.VALUE_TO_ENTER_ON, 1];
        expect(checker.hasFive(possible_distances)).to.equal(true);
    });

});