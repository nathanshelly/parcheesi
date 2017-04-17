import { Parcheesi } from '../src/Parcheesi'
import { BasicPlayer } from '../src/BasicPlayer'
import { Board } from '../src/Board'
import { BaseSpot } from '../src/BaseSpot'
import { HomeRow } from '../src/HomeRow'
import { _Move } from '../src/_Move'
import { MoveEnter } from '../src/MoveEnter'
import { MoveMain } from '../src/MoveMain'
import { Pawn } from '../src/Pawn'
import { Position } from '../src/Position'
import { Color } from '../src/Color'
import { RulesChecker } from '../src/RulesChecker'
import * as c from '../src/Constants'
import * as _test from './testMethods'

import { expect } from 'chai';
import 'mocha';
import * as _ from 'lodash';

describe('Unit tests for entering with correct number:', () => {
    let game: Parcheesi;
    let checker: RulesChecker = new RulesChecker();

    beforeEach(() => {
        game = new Parcheesi();
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

describe('Unit tests for confirming pawn is in base spot:', () => {
    let game: Parcheesi;
    let checker: RulesChecker = new RulesChecker();

    class PrettyDumbPlayer extends BasicPlayer {
        doMove(brd: Board, dice: [number, number]): [_Move, _Move] {
            throw new Error('Method not implemented - not needed in testing board instantiaton.');
        }
    }

    beforeEach(() => {
        game = new Parcheesi();
        let player1 = new PrettyDumbPlayer();
        player1.startGame(Color.Green);
        game.register(player1)
        game.start();
    });
    
    it('should correctly identify if green 0 pawn in base spot', () => {
        let pawn = new Pawn(0, Color.Green, new Position(0, 0));
        expect(checker.pawnInBase(pawn, game.board)).to.equal(true);
    });
    
    it('should correctly identify if green 0 pawn in base spot', () => {
        let color = Color.Green;
        let pawn = new Pawn(0, color, new Position(0, 0));
        game.board.bases[color].pawns[0] = null;
        expect(checker.pawnInBase(pawn, game.board)).to.equal(false);
    });

    it('should correctly identify that pawn of unregistered player is not in base spot', () => {
        let pawn = new Pawn(0, Color.Blue, new Position(0, 0));
        expect(checker.pawnInBase(pawn, game.board)).to.equal(false);
    });
});

describe('Unit tests for entering pawn:', () => {
    let game: Parcheesi;
    let checker: RulesChecker = new RulesChecker();

    class PrettyDumbPlayer extends BasicPlayer {
        doMove(brd: Board, dice: [number, number]): [_Move, _Move] {
            throw new Error('Method not implemented - not needed in testing board instantiaton.');
        }
    }

    beforeEach(() => {
        game = new Parcheesi();
        // building board correctly?
        game.board = new Board([]);
    });
    
    it('should correctly identify if blockade exists on home spot of same color', () => {
        // technically both blockade_pawns are also still in the player's base 
        // but shouldn't matter for purposes of this tests
        let blockade_pawn_1 = new Pawn(0, Color.Green, new Position(0, 0));
        let blockade_pawn_2 = new Pawn(1, Color.Green, new Position(0, 0));
        _test.placeBlockade(c.ENTRY_POINTS[Color.Green], [blockade_pawn_1, blockade_pawn_2], game.board);

        expect(checker.noBlockadeOnHome(Color.Green, game.board)).to.equal(false);
    });

    it('should correctly identify if blockade exists on home spot of opposite color', () => {
        // technically both blockade_pawns are also still in the player's base 
        // but shouldn't matter for purposes of this test
        let blockade_pawn_1 = new Pawn(0, Color.Blue, new Position(0, 0));
        let blockade_pawn_2 = new Pawn(1, Color.Blue, new Position(0, 0));
        _test.placeBlockade(c.ENTRY_POINTS[Color.Green], [blockade_pawn_1, blockade_pawn_2], game.board);
        
        expect(checker.noBlockadeOnHome(Color.Green, game.board)).to.equal(false);
    });

    it('should correctly identify if no blockade exists on home spot of same color', () => {
        // technically both blockade_pawns are also still in the player's base 
        // but shouldn't matter for purposes of this test
        expect(checker.noBlockadeOnHome(Color.Yellow, game.board)).to.equal(true);
    });
});