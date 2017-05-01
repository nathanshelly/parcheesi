import * as _ from 'lodash'
import * as tm from './testMethods'
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

describe('Filename: move_enter_unit.test.ts\n\nUnit tests for entering with correct number:', () => {
    let game: Parcheesi;

    beforeEach(() => {
        game = new Parcheesi();
    });
    
    it('should correctly identify if number five in possible moves', () => {
        let possible_distances: number[] = [5, 1];
        expect(checker.hasFive(possible_distances)).to.equal(true);
    });

    it('should correctly identify if number five in possible moves', () => {
        let possible_distances: number[] = [5, 2, 5, 2];
        expect(checker.hasFive(possible_distances)).to.equal(true);
    });

    it('should correctly identify 1 and 4 combination summing to five in possible moves', () => {
        let possible_distances: number[] = [1, 4];
        expect(checker.hasFive(possible_distances)).to.equal(true);
    });

    it('should correctly identify if combination summing to five in possible moves', () => {
        let possible_distances: number[] = [2, 3];
        expect(checker.hasFive(possible_distances)).to.equal(true);
    });

    it('should correctly identify if no five or combination of 5', () => {
        let possible_distances: number[] = [1, 2];
        expect(checker.hasFive(possible_distances)).to.equal(false);
    });

    it('should correctly identify if no five or combination of 5', () => {
        let possible_distances: number[] = [3, 4, 3, 4];
        expect(checker.hasFive(possible_distances)).to.equal(false);
    });
});

describe('Unit tests for confirming pawn is in base spot:', () => {
    let game: Parcheesi;

    class PrettyDumbPlayer extends BasicPlayer {
        doMove(brd: Board, distances: number[]): _Move[] {
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
        let pawn = new Pawn(0, Color.Green);
        expect(game.board.pawnInBase(pawn)).to.equal(true);
    });
    
    it('should correctly identify if green 0 pawn in base spot', () => {
        let color = Color.Green;
        let pawn = new Pawn(0, color);
        game.board.bases[color].pawns[0] = null;
        expect(game.board.pawnInBase(pawn)).to.equal(false);
    });

    it('should correctly identify that pawn of unregistered player is not in base spot', () => {
        let pawn = new Pawn(0, Color.Blue);

        expect(() => { game.board.pawnInBase(pawn); }).to.throw(Error);
    });
});

describe('Unit tests for entering pawn:', () => {
    let board: Board;
    let players: _Player[];
    let player1: PrettyDumbPlayer, player2: PrettyDumbPlayer;

    class PrettyDumbPlayer extends BasicPlayer {
        doMove(brd: Board, distances: number[]): _Move[] {
            throw new Error('Method not implemented - not needed when manually building moves.');
        }
    }

    beforeEach(() => {
        player1 = new PrettyDumbPlayer();
        player1.startGame(Color.Blue);

        player2 = new PrettyDumbPlayer();
        player2.startGame(Color.Green);

        players = [player1, player2];
        
        board = new Board(players);
    });
    
    it('should correctly identify if blockade of same color exists on home spot', () => {
        let blockade_pawn_1 = new Pawn(0, Color.Green);
        let blockade_pawn_2 = new Pawn(1, Color.Green);
        tm.placePawnsOnGivenColorEntrySpot([blockade_pawn_1, blockade_pawn_2], board, Color.Green);

        expect(checker.blockadeOnHome(Color.Green, board)).to.equal(true);
    });

    it('should correctly identify if blockade of opponent color exists on home spot', () => {
        let blockade_pawn_1 = new Pawn(0, Color.Blue);
        let blockade_pawn_2 = new Pawn(1, Color.Blue);
        tm.placePawnsOnGivenColorEntrySpot([blockade_pawn_1, blockade_pawn_2], board, Color.Green);
        
        expect(checker.blockadeOnHome(Color.Green, board)).to.equal(true);
    });

    it('should correctly identify if no blockade of same color exists on home spot', () => {
        expect(checker.blockadeOnHome(Color.Yellow, board)).to.equal(false);
    });
});