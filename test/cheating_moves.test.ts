import * as _ from 'lodash'
import * as c from '../src/Constants'

import { Pawn } from '../src/Pawn'
import { Color } from '../src/Color'
import { Board } from '../src/Board'
import { _Player } from '../src/_Player'
import { Parcheesi } from '../src/Parcheesi'
import { BasicPlayer } from '../src/BasicPlayer'
import { RulesChecker } from '../src/RulesChecker'

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

describe('Non-move-specific cheating:', () => {
    let game: Parcheesi;
    let board: Board;
    let checker: RulesChecker = new RulesChecker();

    class WrongMoveCheater extends BasicPlayer {
        doMove(brd: Board, dice: number[]): _Move[] {
            let move1 = new MoveForward(new Pawn(0, Color.Blue), 10);
            return [move1];
        }
    }

    beforeEach(() => {
        game = new Parcheesi();
        let player1 = new WrongMoveCheater();
        player1.startGame(Color.Green);
        game.register(player1)
        game.start();
    });

    it('moving a pawn of the wrong color should fail', () => {
        let pawn = new Pawn(1, Color.Blue);
        expect(checker.pawnIsWrongColor(pawn, Color.Red)).to.equal(true);
    })

    it('moving a pawn of the right color should succeed', () => {
        let pawn = new Pawn(1, Color.Blue);
        expect(checker.pawnIsWrongColor(pawn, Color.Blue)).to.equal(false);
    })

    it('moving a pawn of legal id should succeed', () => {
        let pawn = new Pawn(3, Color.Blue);
        expect(checker.pawnIdOutsideLegalRange(pawn)).to.equal(false);
    })

    it('moving a pawn of illegal id should fail', () => {
        let pawn = new Pawn(4, Color.Blue);
        expect(checker.pawnIdOutsideLegalRange(pawn)).to.equal(true);
    })

    // come back to this when makeAllLegalMoves is implemented
    // it('leaving valid moves unused should fail', () => {
    // })

    // it('leaving no valid moves unused should succeed', () => {
    // })
})