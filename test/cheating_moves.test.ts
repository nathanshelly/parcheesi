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
import { Position } from '../src/Position'
import * as c from '../src/Constants'
import * as _test from './testMethods'

import { expect } from 'chai';
import 'mocha';
import * as _ from 'lodash';

describe('Non-move-specific cheating:', () => {
    let game: Parcheesi;
    let board: Board;
    let checker: RulesChecker = new RulesChecker();

    class WrongMoveCheater extends BasicPlayer {
        doMove(brd: Board, dice: number[]): _Move[] {
            let move1 = new MoveMain(new Pawn(0, Color.Blue, new Position(0, 0)), new Position(0, 0), 10);
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
        let pawn = new Pawn(1, Color.Blue, new Position(0, 0))
        expect(checker.pawnIsWrongColor(pawn, Color.Red)).to.equal(true);
    })

    it('moving a pawn of the right color should succeed', () => {
        let pawn = new Pawn(1, Color.Blue, new Position(0, 0))
        expect(checker.pawnIsWrongColor(pawn, Color.Blue)).to.equal(false);
    })

    it('moving a pawn of legal id should succeed', () => {
        let pawn = new Pawn(3, Color.Blue, new Position(0, 0))
        expect(checker.pawnIdOutsideLegalRange(pawn)).to.equal(false);
    })

    it('moving a pawn of illegal id should fail', () => {
        let pawn = new Pawn(4, Color.Blue, new Position(0, 0))
        expect(checker.pawnIdOutsideLegalRange(pawn)).to.equal(true);
    })

    // come back to this when makeAllLegalMoves is implemented
    // it('leaving valid moves unused should fail', () => {
    // })

    // it('leaving no valid moves unused should succeed', () => {
    // })
})