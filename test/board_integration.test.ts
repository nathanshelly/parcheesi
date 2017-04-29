import * as _ from 'lodash'
import * as c from '../src/Constants'
import * as tm from './testMethods'

import { Pawn } from '../src/Pawn'
import { Color } from '../src/Color'
import { _Player } from '../src/_Player'
import { BasicPlayer } from '../src/BasicPlayer'

import { _Move } from '../src/_Move'
import { MoveEnter } from '../src/MoveEnter'
import { MoveForward } from '../src/MoveForward'

import { Board } from '../src/Board'
import { _Spot } from '../src/_Spot'
import { BaseSpot } from '../src/BaseSpot'
import { HomeSpot } from '../src/HomeSpot'
import { HomeRowSpot } from '../src/HomeRowSpot'
import { MainRingSpot } from '../src/MainRingSpot'

import { expect } from 'chai'
import 'mocha'

describe("Filename: board_unit.test.ts\n\nThe board's move-making functionality", () => {
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
        player2.startGame(Color.Red);

        players = [player1, player2];
        
        board = new Board(players);
    });

    it("should perform entrance moves correctly", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);

        let entry = board.getEntrySpot(player1.color);

        expect(entry.n_pawns()).to.equal(0);

        board.makeMove(move);

        expect(entry.n_pawns()).to.equal(1);
    });

    it("should perform forward moves from the main ring to the main ring correctly", () => {
        let pawn = new Pawn(0, player1.color);
        tm.placePawnsOnGivenColorEntrySpot([pawn, null], board, pawn.color);

        let move = new MoveForward(pawn, 3);

        let end = board.getSpotAtOffsetFromEntry(3, player1.color) as _Spot;
        
        expect(end.n_pawns()).to.equal(0);

        board.makeMove(move);

        expect(end.n_pawns()).to.equal(1);
    });

    it("should perform forward moves from the main ring to the home row correctly", () => {
        let pawn = new Pawn(0, player1.color);
        tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, c.ENTRY_TO_HOME_START_OFFSET - 2);

        let move = new MoveForward(pawn, 6);
        
        let end = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_START_OFFSET + 4, player1.color) as _Spot;
        
        expect(end.n_pawns()).to.equal(0);
        
        board.makeMove(move);

        expect(end.n_pawns()).to.equal(1);
    });

    it("should perform forward moves from the main ring to the home spot correctly", () => {
        let pawn = new Pawn(0, player1.color);
        tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, c.ENTRY_TO_HOME_START_OFFSET - 2);

        let offset = c.HOME_ROW_SIZE + 2;
        let move = new MoveForward(pawn, offset);
        
        let end = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_START_OFFSET + c.HOME_ROW_SIZE, player1.color) as _Spot;
        
        expect(end.n_pawns()).to.equal(0);
        
        board.makeMove(move);

        expect(end.n_pawns()).to.equal(1);
    });

    it("should perform forward moves from the home row to the home row correctly", () => {
        let pawn = new Pawn(0, player1.color);
        tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, c.ENTRY_TO_HOME_START_OFFSET + 2);

        let move = new MoveForward(pawn, 2);
        
        let end = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_START_OFFSET + 4, player1.color) as _Spot;
        
        expect(end.n_pawns()).to.equal(0);
        
        board.makeMove(move);

        expect(end.n_pawns()).to.equal(1);
    });

    it("should perform forward moves from the home row to the home spot correctly", () => {
        let pawn = new Pawn(0, player1.color);
        tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, c.ENTRY_TO_HOME_START_OFFSET + 2);

        let move = new MoveForward(pawn, c.HOME_ROW_SIZE - 2);
        
        let end = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_START_OFFSET + c.HOME_ROW_SIZE, player1.color) as _Spot;
        
        expect(end.n_pawns()).to.equal(0);
        
        board.makeMove(move);

        expect(end.n_pawns()).to.equal(1);
    });

    it("should correctly form blockades on the main ring", () => {
        let pawn0 = new Pawn(0, player1.color);
        tm.placePawnsAtOffsetFromYourEntry([pawn0, null], board, 4);

        let pawn1 = new Pawn(1, player1.color);
        tm.placePawnsOnGivenColorEntrySpot([pawn1, null], board, pawn1.color);

        let move = new MoveForward(pawn1, 4);

        let end = board.getSpotAtOffsetFromEntry(4, player1.color) as _Spot;
        expect(end.n_pawns()).to.equal(1);
        expect(end.has_blockade()).to.be.false;

        board.makeMove(move);

        expect(end.n_pawns()).to.equal(2);
        expect(end.has_blockade()).to.be.true;
    });

    it("should correctly form blockades on the home row", () => {
        let pawn0 = new Pawn(0, player1.color);
        tm.placePawnsAtOffsetFromYourEntry([pawn0, null], board, c.ENTRY_TO_HOME_START_OFFSET + 2);

        let pawn1 = new Pawn(1, player1.color);
        tm.placePawnsAtOffsetFromYourEntry([pawn1, null], board, c.ENTRY_TO_HOME_START_OFFSET);

        let move = new MoveForward(pawn1, 2);

        let end = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_START_OFFSET + 2, player1.color) as _Spot;
        expect(end.n_pawns()).to.equal(1);
        expect(end.has_blockade()).to.be.false;

        board.makeMove(move);

        expect(end.n_pawns()).to.equal(2);
        expect(end.has_blockade()).to.be.true;
    });
});

describe("The board's bonus functionality", () => {
    it("should confer a bonus upon landing on the home spot", () => {
        expect(0).to.equal(1);
    });

    it("should detect that a landing on the main ring from the main ring will bop correctly", () => {
        expect(0).to.equal(1);
    });
    
    it("should detect that a landing on the main ring from a base will bop correctly", () => {
        expect(0).to.equal(1);
    });

    it("should detect that a landing will bop in the main ring", () => {
        expect(0).to.equal(1);
    });

    it("should confer a bonus and send back a pawn upon a bop from a forward move", () => {
        expect(0).to.equal(1);
    });

    it("should confer a bonus and send back a pawn upon a bop from an entrance move", () => {
        expect(0).to.equal(1);
    });
});

describe("The board's locating functionality", () => {
    it("should find a pawn in the base correcty", () => {
        expect(0).to.equal(1);
    });

    it("should find a pawn in the main ring correctly", () => {
        expect(0).to.equal(1);
    });

    it("should find a pawn in the home row correctly", () => {
        expect(0).to.equal(1);
    });

    it("should find a pawn in the home spot correctly", () => {
        expect(0).to.equal(1);
    });

    it("should detect that a pawn is in the base correctly", () => {
        expect(0).to.equal(1);
    });

    it("should detect that a pawn is not in the base correctly", () => {
        expect(0).to.equal(1);
    });

    it("should get a base spot with pawns on it correctly", () => {
        expect(0).to.equal(1);
    });

    it("should get main ring spots with pawns on them correctly", () => {
        expect(0).to.equal(1);
    });

    it("should get home row spots with pawns on them correctly", () => {
        expect(0).to.equal(1);
    });

    it("should get a base, main ring spot, home row spot, and home spot, all with pawns on them, correctly", () => {
        expect(0).to.equal(1);
    });
});

describe("The board's end-game functionality", () => {
    it("should accurately determine if there is a winner", () => {
        expect(0).to.equal(1);
    });
});