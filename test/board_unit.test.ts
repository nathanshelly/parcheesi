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

describe("Filename: board_unit.test.ts\n\ngetBlockadesOfColor tests", () => {
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

    it("should correctly identify no blockades when no pawns on board", () => {
        expect(board.getBlockadesOfColor(player1.color).length).to.equal(0);
    });

		it("should correctly identify no blockades of color when only blockades of other color on board", () => {
			let pawn_one = new Pawn(0, player2.color);
			let pawn_two = new Pawn(1, player2.color);
			
			tm.placePawnsOnGivenColorEntrySpot([pawn_one, pawn_two], board, player1.color);
				
			expect(board.getBlockadesOfColor(player1.color).length).to.equal(0);

			tm.placePawnsOnGivenColorEntrySpot([pawn_one, pawn_two], board, player2.color);
				
			expect(board.getBlockadesOfColor(player1.color).length).to.equal(0);
    });

		it("should correctly identify blockade of your color on entry spot", () => {
			let pawn_one = new Pawn(0, player1.color);
			let pawn_two = new Pawn(1, player1.color);
			
			tm.placePawnsOnGivenColorEntrySpot([pawn_one, pawn_two], board, player1.color);

			expect(board.getBlockadesOfColor(player1.color).length).to.equal(1);
    });

		it("should correctly identify blockade of your color on arbitrary spot", () => {
			let pawn_one = new Pawn(0, player1.color);
			let pawn_two = new Pawn(1, player1.color);
			
			tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 20);

			expect(board.getBlockadesOfColor(player1.color).length).to.equal(1);

			tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 40);

			expect(board.getBlockadesOfColor(player1.color).length).to.equal(1);
    });

		it("should correctly identify blockade of your color on your home row", () => {
			let pawn_one = new Pawn(0, player1.color);
			let pawn_two = new Pawn(1, player1.color);
			
			tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 68);

			expect(board.getBlockadesOfColor(player1.color).length).to.equal(1);
    });

		it("should correctly identify two blockades of your color on arbitrary spots", () => {
			let pawn_one 		= new Pawn(0, player1.color);
			let pawn_two 		= new Pawn(1, player1.color);
			let pawn_three 	= new Pawn(2, player1.color);
			let pawn_four 	= new Pawn(3, player1.color);
			
			tm.placePawnsOnGivenColorEntrySpot([pawn_one, pawn_two], board, player1.color);
			tm.placePawnsAtOffsetFromYourEntry([pawn_three, pawn_four], board, 20);

			expect(board.getBlockadesOfColor(player1.color).length).to.equal(2);

			tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 40);
			tm.placePawnsAtOffsetFromYourEntry([pawn_three, pawn_four], board, 41);

			expect(board.getBlockadesOfColor(player1.color).length).to.equal(2);
    });

		it("should correctly identify two blockades of your color on your home row", () => {
			let pawn_one 		= new Pawn(0, player1.color);
			let pawn_two 		= new Pawn(1, player1.color);
			let pawn_three 	= new Pawn(2, player1.color);
			let pawn_four 	= new Pawn(3, player1.color);
			
			tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 69);
			tm.placePawnsAtOffsetFromYourEntry([pawn_three, pawn_four], board, 66);

			expect(board.getBlockadesOfColor(player1.color).length).to.equal(2);
    });

		it("should correctly identify two blockades of your color on home row and main ring", () => {
			let pawn_one 		= new Pawn(0, player1.color);
			let pawn_two 		= new Pawn(1, player1.color);
			let pawn_three 	= new Pawn(2, player1.color);
			let pawn_four 	= new Pawn(3, player1.color);
			
			tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 41);
			tm.placePawnsAtOffsetFromYourEntry([pawn_three, pawn_four], board, 68);

			expect(board.getBlockadesOfColor(player1.color).length).to.equal(2);
    });
});