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

import * as tm from './TestMethods'

import { expect } from 'chai';
import 'mocha';

describe('Filename: move_enter.test.ts\n\nNon-move-specific cheating:', () => {
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

describe("Enter move cheats", () => {
    let rc: RulesChecker;
    let board: Board;
    let players: _Player[];
    let player1: PrettyDumbPlayer, player2: PrettyDumbPlayer;

    class PrettyDumbPlayer extends BasicPlayer {
        doMove(brd: Board, dice: [number, number]): [_Move, _Move] {
            throw new Error('Method not implemented - not needed in testing board instantiaton.');
        }
    }

    before(() => {
        rc = new RulesChecker();
    });

    beforeEach(() => {
        player1 = new PrettyDumbPlayer();
        player1.startGame(Color.Blue);

        player2 = new PrettyDumbPlayer();
        player2.startGame(Color.Red);

        players = [player1, player2];
        
        board = new Board(players);
    });

    it("should not allow entrance of a pawn of illegal ID", () => {
        let pawn = new Pawn(-1, player1.color);
        let move = new MoveEnter(pawn);

        let dice = [5, 6];
        
        let res = rc.legalMove(move, dice, player1, board);
        expect(res).to.be.false;

        pawn = new Pawn(4, player1.color);
        move = new MoveEnter(pawn);

        dice = [5, 6];
        
        res = rc.legalMove(move, dice, player1, board);
        expect(res).to.be.false;
    });

    it("should not allow entrance of a pawn of the wrong color", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);

        let dice = [5, 6];
        
        let res = rc.legalMove(move, dice, player2, board);
        expect(res).to.be.false;
    });

    it("should allow an enter move of a pawn in the base, with no blockade, with a five", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);

        let dice = [5, 6];
        
        let res = rc.legalMove(move, dice, player1, board);
        expect(res).to.be.true;
    });

    it("should not allow an enter move for a pawn outside the base", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);
        board.makeMove(move);

        let res = rc.legalMove(move, [5, 6], player1, board);
        expect(res).to.be.false;
    });

    it("should not allow an enter move without a five", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);
        
        let dice = [1, 2];

        let res = rc.legalMove(move, dice, player1, board);
        expect(res).to.be.false;
    });

    it("should not allow an enter move if a blockade of our own exists on the entry spot", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);
        board.makeMove(move);

        pawn = new Pawn(1, player1.color);
        move = new MoveEnter(pawn);
        board.makeMove(move);

        let dice = [5, 6];
        
        let res = rc.legalMove(move, dice, player1, board);
        expect(res).to.be.false;
    });

    it("should not allow an enter move if a blockade of another player's exists on the entry spot", () => {
        let pawns: [Pawn, Pawn] = [new Pawn(0, player2.color), new Pawn(1, player2.color)];
        tm.placePawnsOnEntrySpot(pawns, board, player1.color);

        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);

        let dice = [5, 6];

        let res = rc.legalMove(move, dice, player1, board);
        expect(res).to.be.false;
    });
});