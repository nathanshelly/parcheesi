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

    class PrettyDumbPlayer extends BasicPlayer {
        doMove(brd: Board, distances: number[]): _Move[] {
            throw new Error('Method not implemented - not needed when manually building moves.');
        }
    }

    beforeEach(() => {
        player1 = new PrettyDumbPlayer();
        player1.startGame(Color.Blue);

        players = [player1];
        board = new Board(players);
    });

    it("should correctly get main ring spot outside base", () => {
		let spot: _Spot = board.getSpotAtOffsetFromEntry(0, player1.color) as _Spot;
		let index = board.mainRing[c.COLOR_HOME_AND_ENTRY[player1.color]["ENTRY_FROM_BASE"]].index;
		
		expect(spot.index).to.equal(index);
    });

	it("should correctly get main ring spot 5 spots after base", () => {
		let spot: _Spot = board.getSpotAtOffsetFromEntry(5, player1.color) as _Spot;
		let index = (board.mainRing[c.COLOR_HOME_AND_ENTRY[player1.color]["ENTRY_FROM_BASE"]].index + 5) % c.MAIN_RING_SIZE
		
		expect(spot.index).to.equal(index);
    });

	it("should correctly get main ring spot at distance that wraps around end of board (40 spots after base)", () => {
		let spot: _Spot = board.getSpotAtOffsetFromEntry(40, player1.color) as _Spot;
		let index = (board.mainRing[c.COLOR_HOME_AND_ENTRY[player1.color]["ENTRY_FROM_BASE"]].index + 40) % c.MAIN_RING_SIZE;
		
		expect(spot.index).to.equal(index);
    });

	it("should correctly get last main ring spot at offset from entry spot", () => {
		let spot: _Spot = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_ROW_START_OFFSET, player1.color) as _Spot;
		let index = 0;
		
		expect(spot.index).to.equal(index);
    });

	it("should correctly get home row spot at offset from entry spot", () => {
		let spot: _Spot = board.getSpotAtOffsetFromEntry(c.MAIN_RING_SIZE, player1.color) as _Spot;
		let index = c.MAIN_RING_SIZE - c.ENTRY_TO_HOME_ROW_START_OFFSET;
		
		expect(spot.index).to.equal(index);
    });

	it("should correctly get home spot at offset from entry spot", () => {
		let spot: _Spot = board.getSpotAtOffsetFromEntry(c.ENTRY_TO_HOME_OFFSET, player1.color) as _Spot;
		let index = c.HOME_ROW_SIZE;
		
		expect(spot.index).to.equal(index);
    });
});

describe("getSpotAtOffsetFromSpot tests", () => {
    let board: Board;
    let players: _Player[];
    let player1: PrettyDumbPlayer;

    class PrettyDumbPlayer extends BasicPlayer {
        doMove(brd: Board, distances: number[]): _Move[] {
            throw new Error('Method not implemented - not needed when manually building moves.');
        }
    }

    beforeEach(() => {
        player1 = new PrettyDumbPlayer();
        player1.startGame(Color.Blue);

        players = [player1];
        
        board = new Board(players);
    });

	// it("should correctly get same spot if offset equals 0", () => {
	// 	let start_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as _Spot;
	// 	let spot = board.getSpotAtOffsetFromSpot(start_spot, 0, player1.color) as _Spot;
		
	// 	let index = c.HOME_ROW_SIZE;
		
	// 	expect(spot.index).to.equal(index);
    // });

    // it("should correctly get main ring spot after entry main ring spot", () => {
	// 	let start_spot = board.getSpotAtOffsetFromEntry(0, player1.color) as _Spot;
	// 	let spot = board.getSpotAtOffsetFromSpot(start_spot, 0, player1.color) as _Spot;
		
	// 	let index = c.HOME_ROW_SIZE;
		
	// 	expect(spot.index).to.equal(index);
    // });
});


describe("getPawnsOfColorInBase tests", () => {
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