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

class PrettyDumbPlayer extends BasicPlayer {
    doMove(brd: Board, distances: number[]): _Move[] {
        throw new Error('Method not implemented - not needed when manually building moves.');
    }
}

describe("Filename: board_integration.test.ts\n\nThe board's move-making functionality", () => {
    let board: Board;
    let players: _Player[];
    let player1: PrettyDumbPlayer, player2: PrettyDumbPlayer;

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

        expect(entry.nPawns()).to.equal(0);

        board.makeMove(move);

        expect(entry.nPawns()).to.equal(1);
    });

    it("should perform forward moves from the main ring to the main ring correctly", () => {
        let pawn = new Pawn(0, player1.color);
        tm.placePawnsOnGivenColorEntrySpot([pawn, null], board, pawn.color);

        let move = new MoveForward(pawn, 3);

        let end = board.getSpotAtOffsetFromEntry(3, player1.color) as _Spot;
        
        expect(end.nPawns()).to.equal(0);

        board.makeMove(move);

        expect(end.nPawns()).to.equal(1);
    });

    it("should perform forward moves from the main ring to the home row correctly", () => {
        let pawn = new Pawn(0, player1.color);
        tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET - 2);

        let move = new MoveForward(pawn, 6);
        
        let end = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_ROW_START_OFFSET + 4, player1.color) as _Spot;
        
        expect(end.nPawns()).to.equal(0);
        
        board.makeMove(move);

        expect(end.nPawns()).to.equal(1);
    });

    it("should perform forward moves from the main ring to the home spot correctly", () => {
        let pawn = new Pawn(0, player1.color);
        tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET - 2);

        let offset = c.HOME_ROW_SIZE + 2;
        let move = new MoveForward(pawn, offset);
        
        let end = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_ROW_START_OFFSET + c.HOME_ROW_SIZE, player1.color) as _Spot;
        
        expect(end.nPawns()).to.equal(0);
        
        board.makeMove(move);

        expect(end.nPawns()).to.equal(1);
    });

    it("should perform forward moves from the home row to the home row correctly", () => {
        let pawn = new Pawn(0, player1.color);
        tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + 2);

        let move = new MoveForward(pawn, 2);
        
        let end = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_ROW_START_OFFSET + 4, player1.color) as _Spot;
        
        expect(end.nPawns()).to.equal(0);
        
        board.makeMove(move);

        expect(end.nPawns()).to.equal(1);
    });

    it("should perform forward moves from the home row to the home spot correctly", () => {
        let pawn = new Pawn(0, player1.color);
        tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + 2);

        let move = new MoveForward(pawn, c.HOME_ROW_SIZE - 2);
        
        let end = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_ROW_START_OFFSET + c.HOME_ROW_SIZE, player1.color) as _Spot;
        
        expect(end.nPawns()).to.equal(0);
        
        board.makeMove(move);

        expect(end.nPawns()).to.equal(1);
    });

    it("should correctly form blockades on the main ring", () => {
        let pawn0 = new Pawn(0, player1.color);
        tm.placePawnsAtOffsetFromYourEntry([pawn0, null], board, 4);

        let pawn1 = new Pawn(1, player1.color);
        tm.placePawnsOnGivenColorEntrySpot([pawn1, null], board, pawn1.color);

        let move = new MoveForward(pawn1, 4);

        let end = board.getSpotAtOffsetFromEntry(4, player1.color) as _Spot;
        expect(end.nPawns()).to.equal(1);
        expect(end.hasBlockade()).to.be.false;

        board.makeMove(move);

        expect(end.nPawns()).to.equal(2);
        expect(end.hasBlockade()).to.be.true;
    });

    it("should correctly form blockades on the home row", () => {
        let pawn0 = new Pawn(0, player1.color);
        tm.placePawnsAtOffsetFromYourEntry([pawn0, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + 2);

        let pawn1 = new Pawn(1, player1.color);
        tm.placePawnsAtOffsetFromYourEntry([pawn1, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);

        let move = new MoveForward(pawn1, 2);

        let end = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_ROW_START_OFFSET + 2, player1.color) as _Spot;
        expect(end.nPawns()).to.equal(1);
        expect(end.hasBlockade()).to.be.false;

        board.makeMove(move);

        expect(end.nPawns()).to.equal(2);
        expect(end.hasBlockade()).to.be.true;
    });
});