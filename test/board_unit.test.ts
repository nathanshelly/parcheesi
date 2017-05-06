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



describe("Filename: board_unit.test.ts\n\ngetBlockadesOfColor tests", () => {
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
		let pawn_one 	= new Pawn(0, player1.color);
		let pawn_two 	= new Pawn(1, player1.color);
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
		let pawn_one 	= new Pawn(0, player1.color);
		let pawn_two 	= new Pawn(1, player1.color);
		let pawn_three 	= new Pawn(2, player1.color);
		let pawn_four 	= new Pawn(3, player1.color);
		
		tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 69);
		tm.placePawnsAtOffsetFromYourEntry([pawn_three, pawn_four], board, 66);
		expect(board.getBlockadesOfColor(player1.color).length).to.equal(2);
    });

	it("should correctly identify two blockades of your color on home row and main ring", () => {
		let pawn_one 	= new Pawn(0, player1.color);
		let pawn_two 	= new Pawn(1, player1.color);
		let pawn_three 	= new Pawn(2, player1.color);
		let pawn_four 	= new Pawn(3, player1.color);
		
		tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 41);
		tm.placePawnsAtOffsetFromYourEntry([pawn_three, pawn_four], board, 68);
		expect(board.getBlockadesOfColor(player1.color).length).to.equal(2);
    });
});

describe("getSpotAtOffsetFromEntry tests", () => {
    let board: Board;
    let players: _Player[];
    let player1: PrettyDumbPlayer;

    beforeEach(() => {
        player1 = new PrettyDumbPlayer();
        player1.startGame(Color.Blue);

        players = [player1];
        board = new Board(players);
    });

    it("should correctly get main ring spot outside base", () => {
		let spot: _Spot = board.getSpotAtOffsetFromEntry(0, player1.color) as _Spot;
		let index = board.mainRing[c.COLOR_HOME_AND_ENTRY[player1.color]["ENTRY_FROM_BASE"]].index;
		
		expect(spot).to.be.instanceof(MainRingSpot);
		expect(spot.index).to.equal(index);
    });

	it("should correctly get main ring spot 7 spots after base", () => {
		let spot: _Spot = board.getSpotAtOffsetFromEntry(7, player1.color) as _Spot;
		let index = (board.mainRing[c.COLOR_HOME_AND_ENTRY[player1.color]["ENTRY_FROM_BASE"]].index + 7) % c.MAIN_RING_SIZE
		
		expect(spot).to.be.instanceof(MainRingSpot);
		expect(spot.index).to.equal(index);
    });

	it("should correctly get main ring spot at distance that wraps around end of board (40 spots after base)", () => {
		let spot: _Spot = board.getSpotAtOffsetFromEntry(40, player1.color) as _Spot;
		let index = (board.mainRing[c.COLOR_HOME_AND_ENTRY[player1.color]["ENTRY_FROM_BASE"]].index + 40) % c.MAIN_RING_SIZE;
		
		expect(spot).to.be.instanceof(MainRingSpot);
		expect(spot.index).to.equal(index);
    });

	it("should correctly get last main ring spot at offset from entry spot", () => {
		let spot: _Spot = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_ROW_START_OFFSET, player1.color) as _Spot;
		let index = 0;
		
		expect(spot).to.be.instanceof(HomeRowSpot);
		expect(spot.index).to.equal(index);
    });

	it("should correctly get home row spot at offset from entry spot", () => {
		let spot: _Spot = board.getSpotAtOffsetFromEntry(c.MAIN_RING_SIZE, player1.color) as _Spot;
		let index = c.MAIN_RING_SIZE - c.ENTRY_TO_HOME_ROW_START_OFFSET;
		
		expect(spot).to.be.instanceof(HomeRowSpot);
		expect(spot.index).to.equal(index);
    });

	it("should correctly get home spot at offset from entry spot", () => {
		let spot: _Spot = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_OFFSET, player1.color) as _Spot;
		let index = c.HOME_ROW_SIZE;
		
		expect(spot).to.be.instanceof(HomeSpot);
		expect(spot.index).to.equal(index);
    });
});

describe("getSpotAtOffsetFromSpot tests", () => {
    let board: Board;
    let players: _Player[];
    let player1: PrettyDumbPlayer;
	let blockade_on_spot_checker = (spot: _Spot) => { return spot.hasBlockade(); };

    beforeEach(() => {
        player1 = new PrettyDumbPlayer();
        player1.startGame(Color.Blue);

        players = [player1];
        
        board = new Board(players);
    });

	it("should correctly get same spot if offset equals 0", () => {
		let start_spot = board.getSpotAtOffsetFromEntry(7, player1.color) as _Spot;
		let spot = board.getSpotAtOffsetFromSpot(start_spot, 0, player1.color) as _Spot;
		
		let index = c.COLOR_HOME_AND_ENTRY[player1.color]["ENTRY_FROM_BASE"] + 7;
		
		expect(spot.index).to.equal(index);
		expect(spot).to.be.an.instanceof(MainRingSpot);
    });

	it("should correctly get main ring spot at random offset (i.e. 7)", () => {
		let start_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as _Spot;
		let spot = board.getSpotAtOffsetFromSpot(start_spot, 7, player1.color) as _Spot;
		
		let index = c.COLOR_HOME_AND_ENTRY[player1.color]["ENTRY_FROM_BASE"] + 7;
		
		expect(spot.index).to.equal(index);
		expect(spot).to.be.an.instanceof(MainRingSpot);
    });

	it("should correctly get last main ring spot before home row", () => {
		let start_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as _Spot;
		let spot = board.getSpotAtOffsetFromSpot(start_spot, c.ENTRY_TO_HOME_ROW_START_OFFSET - 1, player1.color) as _Spot;
		
		let index = c.COLOR_HOME_AND_ENTRY[player1.color]["HOME_ROW_ENTRY"];
		
		expect(spot.index).to.equal(index);
		expect(spot).to.be.an.instanceof(MainRingSpot);
    });

	it("should correctly get first spot of home row", () => {
		let start_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as _Spot;
		let spot = board.getSpotAtOffsetFromSpot(start_spot, c.ENTRY_TO_HOME_ROW_START_OFFSET, player1.color) as _Spot;
		
		let index = 0;
		
		expect(spot.index).to.equal(index);
		expect(spot).to.be.an.instanceof(HomeRowSpot);
    });

	it("should correctly get last spot of home row", () => {
		let start_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as _Spot;
		let spot = board.getSpotAtOffsetFromSpot(start_spot, c.ENTRY_TO_HOME_OFFSET - 1, player1.color) as _Spot;
		
		let index = c.HOME_ROW_SIZE - 1;
		
		expect(spot.index).to.equal(index);
		expect(spot).to.be.an.instanceof(HomeRowSpot);
    });

	it("should correctly get home spot", () => {
		let start_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as _Spot;
		let spot = board.getSpotAtOffsetFromSpot(start_spot, c.ENTRY_TO_HOME_OFFSET, player1.color) as _Spot;
		
		let index = c.HOME_ROW_SIZE;
		
		expect(spot.index).to.equal(index);
		expect(spot).to.be.an.instanceof(HomeSpot);
    });

	it("should correctly fail to get spot if ran with blockade check and blockade exists", () => {
		let pawn_one = new Pawn(0, player1.color);
		let pawn_two = new Pawn(1, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 7);
		
		let start_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as _Spot;
		let res = board.getSpotAtOffsetFromSpot(start_spot, c.ENTRY_TO_HOME_ROW_START_OFFSET, player1.color, blockade_on_spot_checker);
		
		expect(res).to.be.null;
    });

	it("should correctly fail to get spot if ran with blockade check and blockade exists in home row", () => {
		let pawn_one = new Pawn(0, player1.color);
		let pawn_two = new Pawn(1, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + 1);
		
		let start_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as _Spot;
		let res = board.getSpotAtOffsetFromSpot(start_spot, c.ENTRY_TO_HOME_ROW_START_OFFSET + 1, player1.color, blockade_on_spot_checker);
		
		expect(res).to.be.null;
    });
});

describe("getPawnsOfColorInBase tests", () => {
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
    
	it("should correctly find all pawns in home", () => {
		let pawns = board.getPawnsOfColorInBase(player1.color);
		expect(pawns.length).to.equal(4);
    });

	it("should correctly find no pawns in home", () => {
		let pawn_one 	= new Pawn(0, player1.color);
		let pawn_two 	= new Pawn(1, player1.color);
		let pawn_three 	= new Pawn(2, player1.color);
		let pawn_four 	= new Pawn(3, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 0);
		tm.placePawnsAtOffsetFromYourEntry([pawn_three, pawn_four], board, 1);
		
		let pawns = board.getPawnsOfColorInBase(player1.color);
		expect(pawns.length).to.equal(0);
    });

	it("should correctly find two pawns in home", () => {
		let pawn_one 	= new Pawn(0, player1.color);
		let pawn_two 	= new Pawn(1, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 0);
		// tm.placePawnsAtOffsetFromYourEntry([pawn_three, pawn_four], board, 1);
		
		let pawns = board.getPawnsOfColorInBase(player1.color);
		expect(pawns.length).to.equal(2);
    });
});

describe("getPawnsOfColorOnBoard tests (order matters)", () => {
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
    
	it("should correctly find zero pawns on board", () => {
		let pawns = board.getPawnsOfColorOnBoard(player1.color);
		expect(pawns.length).to.equal(0);
    });

	it("should correctly find two pawns in main ring", () => {
		let pawn_one = new Pawn(0, player1.color);
		let pawn_two = new Pawn(1, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 0);
		
		let pawns = board.getPawnsOfColorOnBoard(player1.color);
		expect(pawns).to.deep.equal([pawn_one, pawn_two]);
    });

	it("should correctly find all pawns in main ring", () => {
		let pawn_one 	= new Pawn(0, player1.color);
		let pawn_two 	= new Pawn(1, player1.color);
		let pawn_three 	= new Pawn(2, player1.color);
		let pawn_four 	= new Pawn(3, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 0);
		tm.placePawnsAtOffsetFromYourEntry([pawn_three, pawn_four], board, 1);
		
		let pawns = board.getPawnsOfColorOnBoard(player1.color);
		expect(pawns).to.deep.equal([pawn_one, pawn_two, pawn_three, pawn_four]);
    });

	it("should correctly find all pawns in main ring swapped order", () => {
		let pawn_one 	= new Pawn(0, player1.color);
		let pawn_two 	= new Pawn(1, player1.color);
		let pawn_three 	= new Pawn(2, player1.color);
		let pawn_four 	= new Pawn(3, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_three, pawn_four], board, 0);
		tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 1);
		
		let pawns = board.getPawnsOfColorOnBoard(player1.color);
		expect(pawns).to.deep.equal([pawn_three, pawn_four, pawn_one, pawn_two]);
    });

	it("should correctly find all pawns in random main ring spots", () => {
		let pawn_one 	= new Pawn(0, player1.color);
		let pawn_two 	= new Pawn(1, player1.color);
		let pawn_three 	= new Pawn(2, player1.color);
		let pawn_four 	= new Pawn(3, player1.color);

		
		tm.placePawnsAtOffsetFromYourEntry([pawn_four, null], board, 0);
		tm.placePawnsAtOffsetFromYourEntry([pawn_one, null], board, 4);
		tm.placePawnsAtOffsetFromYourEntry([pawn_three, null], board, 20);
		tm.placePawnsAtOffsetFromYourEntry([pawn_two, null], board, 63);
		
		let pawns = board.getPawnsOfColorOnBoard(player1.color);
		expect(pawns).to.deep.equal([pawn_four, pawn_one, pawn_three, pawn_two]);
    });

	it("should correctly find all pawns in home row spots", () => {
		let pawn_one 	= new Pawn(0, player1.color);
		let pawn_two 	= new Pawn(1, player1.color);
		let pawn_three 	= new Pawn(2, player1.color);
		let pawn_four 	= new Pawn(3, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_three, pawn_four], board, 66);
		tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 68);
				
		let pawns = board.getPawnsOfColorOnBoard(player1.color);
		expect(pawns).to.deep.equal([pawn_three, pawn_four, pawn_one, pawn_two]);
    });

	it("should correctly find all pawns in home spot", () => {
		let pawn_one 	= new Pawn(0, player1.color);
		let pawn_two 	= new Pawn(1, player1.color);
		let pawn_three 	= new Pawn(2, player1.color);
		let pawn_four 	= new Pawn(3, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_three, pawn_four], board, c.ENTRY_TO_HOME_OFFSET);
		tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, c.ENTRY_TO_HOME_OFFSET);
				
		let pawns = board.getPawnsOfColorOnBoard(player1.color);
		expect(pawns).to.deep.equal([pawn_three, pawn_four, pawn_one, pawn_two]);
    });

	it("should correctly find some pawns in main ring and some pawns in home row", () => {
		let pawn_one 	= new Pawn(0, player1.color);
		let pawn_two 	= new Pawn(1, player1.color);
		let pawn_three 	= new Pawn(2, player1.color);
		let pawn_four 	= new Pawn(3, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_four, null], board, 2);
		tm.placePawnsAtOffsetFromYourEntry([pawn_one, null], board, 40);
		tm.placePawnsAtOffsetFromYourEntry([pawn_three, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
		tm.placePawnsAtOffsetFromYourEntry([pawn_two, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + c.HOME_ROW_SIZE - 2);

		let pawns = board.getPawnsOfColorOnBoard(player1.color);
		expect(pawns).to.deep.equal([pawn_four, pawn_one, pawn_three, pawn_two]);
    });

	it("should correctly find some pawns in main ring and some pawns in home spot", () => {
		let pawn_one 	= new Pawn(0, player1.color);
		let pawn_two 	= new Pawn(1, player1.color);
		let pawn_three 	= new Pawn(2, player1.color);
		let pawn_four 	= new Pawn(3, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_four, null], board, 9);
		tm.placePawnsAtOffsetFromYourEntry([pawn_one, null], board, 20);
		tm.placePawnsAtOffsetFromYourEntry([pawn_three, pawn_two], board, c.ENTRY_TO_HOME_OFFSET);
				
		let pawns = board.getPawnsOfColorOnBoard(player1.color);
		expect(pawns).to.deep.equal([pawn_four, pawn_one, pawn_three, pawn_two]);
    });

	it("should correctly find some pawns in home row and some pawns in home spot", () => {
		let pawn_one 	= new Pawn(0, player1.color);
		let pawn_two 	= new Pawn(1, player1.color);
		let pawn_three 	= new Pawn(2, player1.color);
		let pawn_four 	= new Pawn(3, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_three, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
		tm.placePawnsAtOffsetFromYourEntry([pawn_two, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + c.HOME_ROW_SIZE - 2);
		tm.placePawnsAtOffsetFromYourEntry([pawn_four, pawn_one], board, c.ENTRY_TO_HOME_OFFSET);
				
		let pawns = board.getPawnsOfColorOnBoard(player1.color);
		expect(pawns).to.deep.equal([pawn_three, pawn_two, pawn_four, pawn_one]);
    });

	it("should correctly find some pawns in main ring, some pawns in home row and some pawns in home spot", () => {
		let pawn_one 	= new Pawn(0, player1.color);
		let pawn_two 	= new Pawn(1, player1.color);
		let pawn_three 	= new Pawn(2, player1.color);
		let pawn_four 	= new Pawn(3, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_four, null], board, 0);
		tm.placePawnsAtOffsetFromYourEntry([pawn_three, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
		tm.placePawnsAtOffsetFromYourEntry([pawn_two, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + c.HOME_ROW_SIZE - 2);
		tm.placePawnsAtOffsetFromYourEntry([pawn_one, null], board, c.ENTRY_TO_HOME_OFFSET);
				
		let pawns = board.getPawnsOfColorOnBoard(player1.color);
		expect(pawns).to.deep.equal([pawn_four, pawn_three, pawn_two, pawn_one]);
    });
});

describe("getPawnsOfColor tests (order matters)", () => {
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
    
	it("should correctly find all pawns", () => {
		let pawns = board.getPawnsOfColor(player1.color);
		expect(pawns.length).to.equal(4);
    });

	it("should correctly find pawns in base and pawns in main ring", () => {
		let pawn_one = new Pawn(0, player1.color);
		let pawn_two = new Pawn(1, player1.color);
		let pawn_three = new Pawn(2, player1.color);
		let pawn_four = new Pawn(3, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 0);
		
		let pawns = board.getPawnsOfColor(player1.color);
		expect(pawns).to.deep.equal([pawn_three, pawn_four, pawn_one, pawn_two]);
    });

	it("should correctly find pawns in base and pawns in home row", () => {
		let pawn_one = new Pawn(0, player1.color);
		let pawn_two = new Pawn(1, player1.color);
		let pawn_three = new Pawn(2, player1.color);
		let pawn_four = new Pawn(3, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
		
		let pawns = board.getPawnsOfColor(player1.color);
		expect(pawns).to.deep.equal([pawn_three, pawn_four, pawn_one, pawn_two]);
    });

	it("should correctly find pawns in base and pawns in home spot", () => {
		let pawn_one = new Pawn(0, player1.color);
		let pawn_two = new Pawn(1, player1.color);
		let pawn_three = new Pawn(2, player1.color);
		let pawn_four = new Pawn(3, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, c.ENTRY_TO_HOME_OFFSET);
		
		let pawns = board.getPawnsOfColor(player1.color);
		expect(pawns).to.deep.equal([pawn_three, pawn_four, pawn_one, pawn_two]);
    });
});

describe("moveOnePawnBackToBase tests", () => {
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

	it("should correctly move back one of several pawns on main ring spot", () => {
		let pawn_one = new Pawn(0, player1.color);
		let pawn_two = new Pawn(1, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 0);
		let remove_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as _Spot;
		
		board.moveOnePawnBackToBase(remove_spot);

		let pawns = board.getPawnsOfColorInBase(player1.color);
		expect(pawns.length).to.equal(c.NUM_PLAYER_PAWNS - 1);
    });

	it("should correctly move back one of several pawns on home row spot", () => {
		let pawn_one = new Pawn(0, player1.color);
		let pawn_two = new Pawn(1, player1.color);
		let pawn_three = new Pawn(2, player1.color);
		let pawn_four = new Pawn(3, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 0);
		tm.placePawnsAtOffsetFromYourEntry([pawn_three, pawn_four], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);

		let remove_spot = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_ROW_START_OFFSET, player1.color) as _Spot;
		
		board.moveOnePawnBackToBase(remove_spot);

		let pawns = board.getPawnsOfColorInBase(player1.color);
		expect(pawns.length).to.equal(c.NUM_PLAYER_PAWNS - 3);
    });

	it("should correctly move back one pawn on main ring spot", () => {
		let pawn_one = new Pawn(0, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_one, null], board, 20);
		let remove_spot = board.getSpotAtOffsetFromEntry(20, player1.color) as _Spot;
		
		board.moveOnePawnBackToBase(remove_spot);

		let pawns = board.getPawnsOfColorInBase(player1.color);
		expect(pawns.length).to.equal(c.NUM_PLAYER_PAWNS);
    });

	it("should correctly move back one pawn on home row spot", () => {
		let pawn_one = new Pawn(0, player1.color);
		let pawn_two = new Pawn(1, player1.color);
		let pawn_three = new Pawn(2, player1.color);
		let pawn_four = new Pawn(3, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 0);
		tm.placePawnsAtOffsetFromYourEntry([pawn_three, null], board, c.ENTRY_TO_HOME_OFFSET);
		tm.placePawnsAtOffsetFromYourEntry([pawn_four, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + 1);

		let remove_spot = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_ROW_START_OFFSET + 1, player1.color) as _Spot;
		
		board.moveOnePawnBackToBase(remove_spot);

		let pawns = board.getPawnsOfColorInBase(player1.color);
		expect(pawns.length).to.equal(c.NUM_PLAYER_PAWNS - 3);
    });

	it("should correctly error when trying to move back pawn from home spot", () => {
		let pawn_one = new Pawn(0, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_one, null], board, c.ENTRY_TO_HOME_OFFSET);
		let remove_spot = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_OFFSET, player1.color) as _Spot;
		
		expect(() => { board.moveOnePawnBackToBase(remove_spot); }).to.throw(Error);
    });

	it("should correctly error when trying to move back pawn from spot with no pawns", () => {
		let remove_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as _Spot;
		
		expect(() => { board.moveOnePawnBackToBase(remove_spot); }).to.throw(Error);
    });
});

describe("findPawn tests", () => {
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

	it("should correctly find a pawn in base spot", () => {
		let pawn_one = new Pawn(0, player1.color);
		let spot = board.findPawn(pawn_one);

		let index = c.TEST_BASE_INDEX;

		expect(spot).to.be.instanceof(BaseSpot);
		expect(spot.index).to.equal(index);
    });

	it("should correctly find a pawn in main ring", () => {
		let pawn_one = new Pawn(0, player1.color);
		
		tm.placePawnsAtOffsetFromYourEntry([pawn_one, null], board, 0);
		let spot = board.findPawn(pawn_one);

		let index = c.COLOR_HOME_AND_ENTRY[player1.color]["ENTRY_FROM_BASE"];

		expect(spot).to.be.instanceof(MainRingSpot);
		expect(spot.index).to.equal(index);
    });

	it("should correctly find a pawn in home row", () => {
		let pawn_one = new Pawn(0, player1.color);
		
		tm.placePawnsAtOffsetFromYourEntry([pawn_one, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
		let spot = board.findPawn(pawn_one);

		let index = 0;

		expect(spot).to.be.instanceof(HomeRowSpot);
		expect(spot.index).to.equal(index);
    });

	it("should correctly find a pawn in home spot", () => {
		let pawn_one = new Pawn(0, player1.color);
		
		tm.placePawnsAtOffsetFromYourEntry([pawn_one, null], board, c.ENTRY_TO_HOME_OFFSET);
		let spot = board.findPawn(pawn_one);

		let index = c.HOME_ROW_SIZE;

		expect(spot).to.be.instanceof(HomeSpot);
		expect(spot.index).to.equal(index);
    });
	
	it("should error if given pawn of invalid id", () => {
		let pawn_one = new Pawn(-1, player1.color);

		expect(() => { board.findPawn(pawn_one); }).to.throw(Error);

		let pawn_two = new Pawn(c.NUM_PLAYER_PAWNS + 1, player1.color);

		expect(() => { board.findPawn(pawn_two); }).to.throw(Error);
    });
});

describe("getHomeRowStarts ", () => {
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

	it("should correctly find c.NUM_PLAYERS home row spots", () => {
		let home_row_spots = board.getHomeRowStarts();
		let res = home_row_spots.every(spot => { return spot instanceof HomeRowSpot; });

		expect(res).to.be.true;
		expect(home_row_spots.length).to.equal(c.NUM_PLAYERS);
    });
});

describe("getHomeSpots ", () => {
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

	it("should correctly find c.NUM_PLAYERS home spots", () => {
		let home_spots = board.getHomeSpots();
		let res = home_spots.every(spot => { return spot instanceof HomeSpot; });

		expect(res).to.be.true;
		expect(home_spots.length).to.equal(c.NUM_PLAYERS);
    });
});

describe("landingWillBop ", () => {
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

	it("should correctly report MoveForward that pawn landing on single pawn of other color on non safe spot is a bop", () => {
		let player1_pawn_one = new Pawn(0, player1.color);
		let player2_pawn_one = new Pawn(2, player2.color);

		tm.placePawnsAtOffsetFromYourEntry([player1_pawn_one, null], board, 1);
		let landing_spot = board.getSpotAtOffsetFromEntry(1, player1.color) as MainRingSpot;
		
		let move = new MoveForward(player2_pawn_one, 1);

		expect(board.landingWillBop(move, landing_spot)).to.be.true;
    });

	it("should report that MoveForward pawn landing on single pawn of other color on safe spot is not a bop", () => {
		let player1_pawn_one 	= new Pawn(0, player1.color);
		let player2_pawn_one 	= new Pawn(2, player2.color);

		tm.placePawnsAtOffsetFromYourEntry([player1_pawn_one, null], board, 0);
		let landing_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as MainRingSpot;
		
		let move = new MoveForward(player2_pawn_one, 1);

		expect(board.landingWillBop(move, landing_spot)).to.be.false;
    });

	it("should report that MoveEnter pawn landing on single pawn of other color on your entry spot is a bop", () => {
		let player1_pawn_one = new Pawn(0, player1.color);
		let player2_pawn_one = new Pawn(2, player2.color);

		tm.placePawnsAtOffsetFromYourEntry([player2_pawn_one, null], board, c.OFFSET_BETWEEN_ENTRIES);
		let landing_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as MainRingSpot;
		
		let move = new MoveEnter(player1_pawn_one);

		expect(board.landingWillBop(move, landing_spot)).to.be.true;
    });

	it("should report that MoveEnter pawn landing on single pawn of other color on safe spot that is not your entry spot is not a bop", () => {
		let player1_pawn_one = new Pawn(0, player1.color);
		let player2_pawn_one = new Pawn(2, player2.color);

		tm.placePawnsAtOffsetFromYourEntry([player1_pawn_one, null], board, 0);
		let landing_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as MainRingSpot;
		
		let move = new MoveEnter(player2_pawn_one);

		expect(board.landingWillBop(move, landing_spot)).to.be.false;
    });

	it("should report that MoveEnter pawn landing on blockade of other color on your entry spot is not a bop", () => {
		let player1_pawn_one = new Pawn(0, player1.color);
		let player1_pawn_two = new Pawn(1, player1.color);

		let player2_pawn_one = new Pawn(2, player2.color);

		tm.placePawnsAtOffsetFromYourEntry([player2_pawn_one, player1_pawn_two], board, c.OFFSET_BETWEEN_ENTRIES);
		let landing_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as MainRingSpot;
		
		let move = new MoveEnter(player1_pawn_one);

		expect(board.landingWillBop(move, landing_spot)).to.be.false;
    });

	it("should report that MoveForward pawn landing on single pawn of same color is not a bop", () => {
		let player2_pawn_two = new Pawn(0, player2.color);
		let player2_pawn_one = new Pawn(2, player2.color);

		tm.placePawnsAtOffsetFromYourEntry([player2_pawn_one, null], board, 34);
		let landing_spot = board.getSpotAtOffsetFromEntry(34, player2.color) as MainRingSpot;
		
		let move = new MoveForward(player2_pawn_two, 1);

		expect(board.landingWillBop(move, landing_spot)).to.be.false;
    });
});

describe("earnedHomeBonus ", () => {
    let board: Board;
    let players: _Player[];
    let player1: PrettyDumbPlayer;

    beforeEach(() => {
        player1 = new PrettyDumbPlayer();
        player1.startGame(Color.Blue);
        players = [player1];
        
        board = new Board(players);
    });

	it("should reward home bonus if given home spot", () => {
		let landing_spot = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_OFFSET, player1.color);
		if(landing_spot !== null)
			expect(board.earnedHomeBonus(landing_spot)).to.equal(c.HOME_SPOT_BONUS);
    });

	it("should not reward home bonus if given main ring spot", () => {
		let landing_spot = board.getSpotAtOffsetFromEntry(c.OFFSET_BETWEEN_ENTRIES, player1.color);
		if(landing_spot !== null)
			expect(board.earnedHomeBonus(landing_spot)).to.be.null;
    });

	it("should not reward home bonus if given home row spot", () => {
		let landing_spot = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_ROW_START_OFFSET, player1.color);
		if(landing_spot !== null)
			expect(board.earnedHomeBonus(landing_spot)).to.be.null;
    });

	it("should not reward home bonus if given base spot", () => {
		let landing_spot = board.getBaseSpot(player1.color)
		if(landing_spot !== null)
			expect(board.earnedHomeBonus(landing_spot)).to.be.null;
    });
});

describe("earnedBopBonus ", () => {
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

	it("should reward and move back pawn for bop of MoveForward pawn landing on single pawn of other color on non safe spot", () => {
		let player1_pawn_one = new Pawn(0, player1.color);
		let player2_pawn_one = new Pawn(2, player2.color);

		tm.placePawnsAtOffsetFromYourEntry([player1_pawn_one, null], board, 1);
		let landing_spot = board.getSpotAtOffsetFromEntry(1, player1.color) as MainRingSpot;
		
		let move = new MoveForward(player2_pawn_one, 1);

		expect(board.earnedBopBonus(move, landing_spot)).to.equal(c.BOP_BONUS);
		expect(board.getPawnsOfColorInBase(player1.color).length).to.equal(c.NUM_PLAYER_PAWNS);
    });

	it("should give no reward for no bop from MoveForward pawn landing on single pawn of other color on safe spot", () => {
		let player1_pawn_one 	= new Pawn(0, player1.color);
		let player2_pawn_one 	= new Pawn(2, player2.color);

		tm.placePawnsAtOffsetFromYourEntry([player1_pawn_one, null], board, 0);
		let landing_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as MainRingSpot;
		
		let move = new MoveForward(player2_pawn_one, 1);

		expect(board.earnedBopBonus(move, landing_spot)).to.be.null;
    });

	it("should reward and move back pawn for bop of MoveEnter pawn landing on single pawn of other color on your entry spot", () => {
		let player1_pawn_one = new Pawn(0, player1.color);
		let player2_pawn_one = new Pawn(2, player2.color);

		tm.placePawnsAtOffsetFromYourEntry([player2_pawn_one, null], board, c.OFFSET_BETWEEN_ENTRIES);
		let landing_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as MainRingSpot;
		
		let move = new MoveEnter(player1_pawn_one);

		expect(board.earnedBopBonus(move, landing_spot)).to.equal(c.BOP_BONUS);
		expect(board.getPawnsOfColorInBase(player2.color).length).to.equal(c.NUM_PLAYER_PAWNS);
    });

	it("should give no reward for no bop from MoveEnter pawn landing on single pawn of other color on safe spot that is not your entry spot", () => {
		let player1_pawn_one = new Pawn(0, player1.color);
		let player2_pawn_one = new Pawn(2, player2.color);

		tm.placePawnsAtOffsetFromYourEntry([player1_pawn_one, null], board, 0);
		let landing_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as MainRingSpot;
		
		let move = new MoveEnter(player2_pawn_one);

		expect(board.earnedBopBonus(move, landing_spot)).to.be.null;
    });

	it("should give no reward for no bop from MoveEnter pawn landing on blockade of other color on your entry spot", () => {
		let player1_pawn_one = new Pawn(0, player1.color);
		let player1_pawn_two = new Pawn(1, player1.color);

		let player2_pawn_one = new Pawn(2, player2.color);

		tm.placePawnsAtOffsetFromYourEntry([player2_pawn_one, player1_pawn_two], board, c.OFFSET_BETWEEN_ENTRIES);
		let landing_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as MainRingSpot;
		
		let move = new MoveEnter(player1_pawn_one);

		expect(board.earnedBopBonus(move, landing_spot)).to.be.null;
    });

	it("should give no reward for no bop from MoveForward pawn landing on single pawn of same color", () => {
		let player2_pawn_two = new Pawn(0, player2.color);
		let player2_pawn_one = new Pawn(2, player2.color);

		tm.placePawnsAtOffsetFromYourEntry([player2_pawn_one, null], board, 34);
		let landing_spot = board.getSpotAtOffsetFromEntry(34, player2.color) as MainRingSpot;
		
		let move = new MoveForward(player2_pawn_two, 1);

		expect(board.earnedBopBonus(move, landing_spot)).to.be.null;
    });
});

describe("handleSpecialLandings ", () => {
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

	it("should reward home bonus if given home spot", () => {
		let landing_spot = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_OFFSET, player1.color);
		let move = new MoveForward(new Pawn(0, Color.Blue), 1);
		if(landing_spot !== null)
			expect(board.handleSpecialLandings(move, landing_spot)).to.equal(c.HOME_SPOT_BONUS);
    });

	it("should not reward home bonus if given main ring spot", () => {
		let landing_spot = board.getSpotAtOffsetFromEntry(c.OFFSET_BETWEEN_ENTRIES, player1.color);
		let move = new MoveForward(new Pawn(0, Color.Blue), 1);
		if(landing_spot !== null)
			expect(board.handleSpecialLandings(move, landing_spot)).to.be.null;
    });

	it("should not reward home bonus if given home row spot", () => {
		let landing_spot = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_ROW_START_OFFSET, player1.color);
		let move = new MoveForward(new Pawn(0, Color.Blue), 1);
		if(landing_spot !== null)
			expect(board.handleSpecialLandings(move, landing_spot)).to.be.null;
    });

	it("should not reward home bonus if given base spot", () => {
		let landing_spot = board.getBaseSpot(player1.color)
		let move = new MoveForward(new Pawn(0, Color.Blue), 1);
		if(landing_spot !== null)
			expect(board.handleSpecialLandings(move, landing_spot)).to.be.null;
    });

	it("should reward and move back pawn for bop of MoveForward pawn landing on single pawn of other color on non safe spot", () => {
		let player1_pawn_one = new Pawn(0, player1.color);
		let player2_pawn_one = new Pawn(2, player2.color);

		tm.placePawnsAtOffsetFromYourEntry([player1_pawn_one, null], board, 1);
		let landing_spot = board.getSpotAtOffsetFromEntry(1, player1.color) as MainRingSpot;
		
		let move = new MoveForward(player2_pawn_one, 1);

		expect(board.handleSpecialLandings(move, landing_spot)).to.equal(c.BOP_BONUS);
		expect(board.getPawnsOfColorInBase(player1.color).length).to.equal(c.NUM_PLAYER_PAWNS);
    });

	it("should give no reward for no bop from MoveForward pawn landing on single pawn of other color on safe spot", () => {
		let player1_pawn_one 	= new Pawn(0, player1.color);
		let player2_pawn_one 	= new Pawn(2, player2.color);

		tm.placePawnsAtOffsetFromYourEntry([player1_pawn_one, null], board, 0);
		let landing_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as MainRingSpot;
		
		let move = new MoveForward(player2_pawn_one, 1);

		expect(board.handleSpecialLandings(move, landing_spot)).to.be.null;
    });

	it("should reward and move back pawn for bop of MoveEnter pawn landing on single pawn of other color on your entry spot", () => {
		let player1_pawn_one = new Pawn(0, player1.color);
		let player2_pawn_one = new Pawn(2, player2.color);

		tm.placePawnsAtOffsetFromYourEntry([player2_pawn_one, null], board, c.OFFSET_BETWEEN_ENTRIES);
		let landing_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as MainRingSpot;
		
		let move = new MoveEnter(player1_pawn_one);

		expect(board.handleSpecialLandings(move, landing_spot)).to.equal(c.BOP_BONUS);
		expect(board.getPawnsOfColorInBase(player2.color).length).to.equal(c.NUM_PLAYER_PAWNS);
    });

	it("should give no reward for no bop from MoveEnter pawn landing on single pawn of other color on safe spot that is not your entry spot", () => {
		let player1_pawn_one = new Pawn(0, player1.color);
		let player2_pawn_one = new Pawn(2, player2.color);

		tm.placePawnsAtOffsetFromYourEntry([player1_pawn_one, null], board, 0);
		let landing_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as MainRingSpot;
		
		let move = new MoveEnter(player2_pawn_one);

		expect(board.handleSpecialLandings(move, landing_spot)).to.be.null;
    });

	it("should give no reward for no bop from MoveEnter pawn landing on blockade of other color on your entry spot", () => {
		let player1_pawn_one = new Pawn(0, player1.color);
		let player1_pawn_two = new Pawn(1, player1.color);

		let player2_pawn_one = new Pawn(2, player2.color);

		tm.placePawnsAtOffsetFromYourEntry([player2_pawn_one, player1_pawn_two], board, c.OFFSET_BETWEEN_ENTRIES);
		let landing_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as MainRingSpot;
		
		let move = new MoveEnter(player1_pawn_one);

		expect(board.handleSpecialLandings(move, landing_spot)).to.be.null;
    });

	it("should give no reward for no bop from MoveForward pawn landing on single pawn of same color", () => {
		let player2_pawn_two = new Pawn(0, player2.color);
		let player2_pawn_one = new Pawn(2, player2.color);

		tm.placePawnsAtOffsetFromYourEntry([player2_pawn_one, null], board, 34);
		let landing_spot = board.getSpotAtOffsetFromEntry(34, player2.color) as MainRingSpot;
		
		let move = new MoveForward(player2_pawn_two, 1);

		expect(board.handleSpecialLandings(move, landing_spot)).to.be.null;
    });
});

describe("baseSpots ", () => {
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

	it("should always know they don't have a blockade", () => {
		let landing_spot = board.getBaseSpot(player1.color);
		
		expect(landing_spot.hasBlockade()).to.be.false;
    });
});

describe("areAllPawnsOut ", () => {
    let board: Board;
    let players: _Player[];
    let player1: PrettyDumbPlayer;

    beforeEach(() => {
        player1 = new PrettyDumbPlayer();
        player1.startGame(Color.Blue);
        players = [player1];
        
        board = new Board(players);
    });

	it("should return true if all pawns are out of the base", () => {
		let pawn_one 	= new Pawn(0, player1.color);
		let pawn_two 	= new Pawn(1, player1.color);
		let pawn_three 	= new Pawn(2, player1.color);
		let pawn_four 	= new Pawn(3, player1.color);

		tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 1);
		tm.placePawnsAtOffsetFromYourEntry([pawn_three, pawn_four], board, 0);
		
		expect(board.areAllPawnsOut(player1.color)).to.be.true;
    });

	it("should return false if any pawns are in the base", () => {
		let pawn_one 	= new Pawn(0, player1.color);
		let pawn_two 	= new Pawn(1, player1.color);
		
		tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 1);
		
		expect(board.areAllPawnsOut(player1.color)).to.be.false;
    });

	it("should return false if all pawns are in the base", () => {
		expect(board.areAllPawnsOut(player1.color)).to.be.false;
    });
});