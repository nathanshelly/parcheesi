import * as _ from 'lodash'
import * as tm from './testMethods'
import * as c from '../src/Constants'

import { Pawn } from '../src/Pawn'
import { Color } from '../src/Color'
import { _Player } from '../src/_Player'
import { PrettyDumbPlayer } from '../src/BasicPlayer'

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

describe("Filename: spot_unit.test.ts\n\nnPawn tests", () => {
	let board: Board;
	let player1: PrettyDumbPlayer;
	let pawn_one: Pawn, pawn_two: Pawn, pawn_three: Pawn, pawn_four: Pawn;

	beforeEach(() => {
		player1 = new PrettyDumbPlayer();
		player1.startGame(Color.Blue);
	
		board = new Board([player1]);

		pawn_one 		= new Pawn(0, player1.color);
		pawn_two 		= new Pawn(1, player1.color);
		pawn_three 	= new Pawn(2, player1.color);
		pawn_four 	= new Pawn(3, player1.color);
	});

	it("should correctly count 4 pawns in base spot", () => {
		expect(board.getBaseSpot(player1.color).nPawns()).to.equal(4);
	});

	it("should correctly count 2 pawns in base spot, 2 pawns on entry", () => {
		tm.placePawnsOnGivenColorEntrySpot([pawn_one, pawn_two], board, player1.color);
		let spot = board.getSpotAtOffsetFromEntry(0, player1.color) as _Spot;
		
		expect(board.getBaseSpot(player1.color).nPawns()).to.equal(2);
		expect(spot.nPawns()).to.equal(2);
	});

	it("should correctly count 0 pawns in base spot, 2 pawns on home row, 2 pawn in home spot", () => {
		tm.placePawnsAtOffsetFromYourEntry([pawn_three, pawn_one], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
		let home_row_spot = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_ROW_START_OFFSET, player1.color) as _Spot;

		tm.placePawnsAtOffsetFromYourEntry([pawn_two, pawn_four], board, c.ENTRY_TO_HOME_OFFSET);
		let home_spot = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_OFFSET, player1.color) as _Spot;
		
		expect(board.getBaseSpot(player1.color).nPawns()).to.equal(0);
		expect(home_row_spot.nPawns()).to.equal(2);
		expect(home_spot.nPawns()).to.equal(2);
	});
});

describe("getLivePawns tests", () => {
	let board: Board;
	let player1: PrettyDumbPlayer;
	let pawn_one: Pawn, pawn_two: Pawn, pawn_three: Pawn, pawn_four: Pawn;

	beforeEach(() => {
		player1 = new PrettyDumbPlayer();
		player1.startGame(Color.Blue);
	
		board = new Board([player1]);

		pawn_one 		= new Pawn(0, player1.color);
		pawn_two 		= new Pawn(1, player1.color);
		pawn_three 	= new Pawn(2, player1.color);
		pawn_four 	= new Pawn(3, player1.color);
	});

	it("should correctly get all pawns in base spot", () => {
		let pawns = board.getBaseSpot(player1.color).getLivePawns();

		expect(pawns).to.deep.equal([pawn_one, pawn_two, pawn_three, pawn_four]);
	});

	it("should correctly get the 2 pawns in base spot and the 2 pawns on entry", () => {
		tm.placePawnsOnGivenColorEntrySpot([pawn_one, pawn_two], board, player1.color);
		let spot = board.getSpotAtOffsetFromEntry(0, player1.color) as _Spot;
		
		expect(board.getBaseSpot(player1.color).getLivePawns()).to.deep.equal([pawn_three, pawn_four]);
		expect(spot.getLivePawns()).to.deep.equal([pawn_one, pawn_two]);
	});

	it("should correctly get the 2 pawns in home row spot and the 2 pawns in home spot", () => {		
		tm.placePawnsAtOffsetFromYourEntry([pawn_three, pawn_one], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
		let home_row_spot = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_ROW_START_OFFSET, player1.color) as _Spot;

		tm.placePawnsAtOffsetFromYourEntry([pawn_two, pawn_four], board, c.ENTRY_TO_HOME_OFFSET);
		let home_spot = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_OFFSET, player1.color) as _Spot;
		
		expect(home_row_spot.getLivePawns()).to.deep.equal([pawn_three, pawn_one]);
		expect(home_spot.getLivePawns()).to.deep.equal([pawn_two, pawn_four]);
	});
});

describe("isEmpty tests", () => {
	let board: Board;
	let player1: PrettyDumbPlayer;
	let pawn_one: Pawn, pawn_two: Pawn, pawn_three: Pawn, pawn_four: Pawn;

	beforeEach(() => {
		player1 = new PrettyDumbPlayer();
		player1.startGame(Color.Blue);
	
		board = new Board([player1]);

		pawn_one 		= new Pawn(0, player1.color);
		pawn_two 		= new Pawn(1, player1.color);
		pawn_three 	= new Pawn(2, player1.color);
		pawn_four 	= new Pawn(3, player1.color);
	});

	it("should correctly say base spot is not empty and entry spot is", () => {
		let spot = board.getSpotAtOffsetFromEntry(0, player1.color) as _Spot;
		
		expect(board.getBaseSpot(player1.color).isEmpty()).to.be.false;
		expect(spot.isEmpty()).to.be.true;
	});

	it("should correctly say base spot is empty, first home row spot and home spot are not", () => {
		tm.placePawnsAtOffsetFromYourEntry([pawn_three, pawn_one], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
		let home_row_spot = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_ROW_START_OFFSET, player1.color) as _Spot;

		tm.placePawnsAtOffsetFromYourEntry([pawn_two, pawn_four], board, c.ENTRY_TO_HOME_OFFSET);
		let home_spot = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_OFFSET, player1.color) as _Spot;
		
		expect(board.getBaseSpot(player1.color).isEmpty()).to.be.true;
		expect(home_row_spot.isEmpty()).to.be.false;
		expect(home_spot.isEmpty()).to.be.false;
	});
});

describe("pawnExists tests", () => {
	let board: Board;
	let player1: PrettyDumbPlayer;
	let pawn_one: Pawn, pawn_two: Pawn, pawn_three: Pawn, pawn_four: Pawn;

	beforeEach(() => {
		player1 = new PrettyDumbPlayer();
		player1.startGame(Color.Blue);
	
		board = new Board([player1]);

		pawn_one 		= new Pawn(0, player1.color);
		pawn_two 		= new Pawn(1, player1.color);
		pawn_three 	= new Pawn(2, player1.color);
		pawn_four 	= new Pawn(3, player1.color);
	});

	it("should correctly say pawn_one exists on base spot", () => {
		expect(board.getBaseSpot(player1.color).pawnExists(pawn_one)).to.be.true;
	});

	it("should correctly say pawns exist on respective spots", () => {
		tm.placePawnsAtOffsetFromYourEntry([pawn_three, pawn_one], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
		let home_row_spot = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_ROW_START_OFFSET, player1.color) as _Spot;

		tm.placePawnsAtOffsetFromYourEntry([pawn_two, pawn_four], board, c.ENTRY_TO_HOME_OFFSET);
		let home_spot = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_OFFSET, player1.color) as _Spot;
		
		expect(board.getBaseSpot(player1.color).pawnExists(pawn_one)).to.be.false;
		
		expect(home_row_spot.pawnExists(pawn_three)).to.be.true;
		expect(home_row_spot.pawnExists(pawn_two)).to.be.false;
		
		expect(home_spot.pawnExists(pawn_four)).to.be.true;
		expect(home_spot.pawnExists(new Pawn(0, player1.color))).to.be.false;
	});
});