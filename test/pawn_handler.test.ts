import * as _ from 'lodash'
import * as tm from './TestMethods'
import * as c from '../src/Constants'

import { Pawn } from '../src/Pawn'
import { Color } from '../src/Color'
import { Board } from '../src/Board'
import { _Spot } from '../src/_Spot'
import { _Player } from '../src/_Player'

import { PawnGetter, PawnSetter } from '../src/_PawnHandler'

import { expect } from 'chai';
import 'mocha';

describe('Filename: pawn_handler.test.ts\n\nPawnGetter main ring tests', () => {
	let board: Board;
	let pg: PawnGetter;
	let starting_spot: _Spot;

	beforeEach(() => {
		pg = new PawnGetter(true);
		board = new Board();
		starting_spot = board.mainRing[0];
	});

	it('should correctly get no pawns in main ring if all pawns are in start', () => {
		board.spotRunner(starting_spot, c.MAIN_RING_SIZE, c.COLOR_TO_RUN_MAIN_RING, pg);
		expect(pg.pawn_locs).to.be.empty;
	});

	it('should correctly get no pawns in main ring if there are pawns in homes and bases', () => {
		let reds = [new Pawn(0, Color.red), new Pawn(2, Color.red), new Pawn(3, Color.red)];
		let greens = [new Pawn(2, Color.green)];
		let yellows = [new Pawn(1, Color.yellow), new Pawn(0, Color.yellow)];
		
		tm.placePawnsAtOffsetFromYourEntry([reds[0], reds[1]], board, c.ENTRY_TO_HOME_OFFSET);
		tm.placePawnsAtOffsetFromYourEntry([reds[2], null], board, c.ENTRY_TO_HOME_OFFSET);		
		tm.placePawnsAtOffsetFromYourEntry([greens[0], null], board, c.ENTRY_TO_HOME_OFFSET);
		tm.placePawnsAtOffsetFromYourEntry([yellows[0], yellows[1]], board, c.ENTRY_TO_HOME_OFFSET);

		let num_pawns = board.getHomeSpots().reduce((num_pawns, spot) => {
			return num_pawns + spot.getLivePawns().length;
		}, 0);
		expect(num_pawns).to.equal(6);

		board.spotRunner(starting_spot, c.MAIN_RING_SIZE, c.COLOR_TO_RUN_MAIN_RING, pg);
		expect(pg.pawn_locs).to.be.empty;
	});
	
	it('should correctly get 1 pawn in main ring if there is one pawn in main ring', () => {
		let greens = [new Pawn(2, Color.green)];
		
		tm.placePawnsAtOffsetFromYourEntry([greens[0], null], board, 2);

		board.spotRunner(starting_spot, c.MAIN_RING_SIZE, c.COLOR_TO_RUN_MAIN_RING, pg);
		expect(pg.pawn_locs).to.deep.equal([[greens[0], tm.convertMainRingLocToServerLoc(c.COLOR_HOME_AND_ENTRY[Color.green]["ENTRY_FROM_BASE"] + 2)]]);
	});

	it('should correctly get various pawns in various main ring locations', () => {
		let reds = [new Pawn(0, Color.red), new Pawn(2, Color.red), new Pawn(3, Color.red)];
		let greens = [new Pawn(2, Color.green)];
		let yellows = [new Pawn(1, Color.yellow), new Pawn(0, Color.yellow)];
		
		tm.placePawnsAtOffsetFromYourEntry([reds[0], reds[1]], board, 2);
		tm.placePawnsAtOffsetFromYourEntry([reds[2], null], board, 41);		
		tm.placePawnsAtOffsetFromYourEntry([greens[0], null], board, 23);
		tm.placePawnsAtOffsetFromYourEntry([yellows[0], yellows[1]], board, 11);

		let exp_piece_locs: [Pawn, number][];
		exp_piece_locs = [[reds[0], tm.convertMainRingLocToServerLoc(c.COLOR_HOME_AND_ENTRY[Color.red]["ENTRY_FROM_BASE"] + 2)],
											[reds[1], tm.convertMainRingLocToServerLoc(c.COLOR_HOME_AND_ENTRY[Color.red]["ENTRY_FROM_BASE"] + 2)],
											[reds[2], tm.convertMainRingLocToServerLoc(c.COLOR_HOME_AND_ENTRY[Color.red]["ENTRY_FROM_BASE"] + 41)],
											[greens[0], tm.convertMainRingLocToServerLoc(c.COLOR_HOME_AND_ENTRY[Color.green]["ENTRY_FROM_BASE"] + 23)],
											[yellows[0], tm.convertMainRingLocToServerLoc(c.COLOR_HOME_AND_ENTRY[Color.yellow]["ENTRY_FROM_BASE"] + 11)],
											[yellows[1], tm.convertMainRingLocToServerLoc(c.COLOR_HOME_AND_ENTRY[Color.yellow]["ENTRY_FROM_BASE"] + 11)]]
		
		exp_piece_locs = exp_piece_locs.sort((tuple_one, tuple_two) => tuple_one[1] - tuple_two[1]);
		
		board.spotRunner(starting_spot, c.MAIN_RING_SIZE, c.COLOR_TO_RUN_MAIN_RING, pg);
		expect(pg.pawn_locs).to.deep.equal(exp_piece_locs);
	});
});

describe('PawnGetter home row tests', () => {
	let board: Board;
	let pg: PawnGetter;
	let starting_spot: _Spot;

	beforeEach(() => {
		pg = new PawnGetter(false);
		board = new Board();
		starting_spot = board.mainRing[0];
	});

	it('should correctly get no pawns in any home row if all pawns are in start', () => {
		board.getHomeRowStarts().forEach(spot => {
			board.spotRunner(spot, c.HOME_ROW_SIZE, spot.color, pg);
		});
		expect(pg.pawn_locs).to.be.empty;
	});

	it('should correctly get no pawns in home rows if there are pawns only in homes and bases', () => {
		let reds = [new Pawn(0, Color.red), new Pawn(2, Color.red), new Pawn(3, Color.red)];
		let greens = [new Pawn(2, Color.green)];
		let yellows = [new Pawn(1, Color.yellow), new Pawn(0, Color.yellow)];
		
		tm.placePawnsAtOffsetFromYourEntry([reds[0], reds[1]], board, c.ENTRY_TO_HOME_OFFSET);
		tm.placePawnsAtOffsetFromYourEntry([reds[2], null], board, c.ENTRY_TO_HOME_OFFSET);		
		tm.placePawnsAtOffsetFromYourEntry([greens[0], null], board, c.ENTRY_TO_HOME_OFFSET);
		tm.placePawnsAtOffsetFromYourEntry([yellows[0], yellows[1]], board, c.ENTRY_TO_HOME_OFFSET);

		let num_pawns = board.getHomeSpots().reduce((num_pawns, spot) => {
			return num_pawns + spot.getLivePawns().length;
		}, 0);
		expect(num_pawns).to.equal(6);

		board.getHomeRowStarts().forEach(spot => {
			board.spotRunner(spot, c.HOME_ROW_SIZE, spot.color, pg);
		});
		expect(pg.pawn_locs).to.be.empty;
	});
	
	it('should correctly get no pawns in home rows if there are pawns only in various main ring locations', () => {
		let reds = [new Pawn(0, Color.red), new Pawn(2, Color.red), new Pawn(3, Color.red)];
		let greens = [new Pawn(2, Color.green)];
		let yellows = [new Pawn(1, Color.yellow), new Pawn(0, Color.yellow)];
		
		tm.placePawnsAtOffsetFromYourEntry([reds[0], reds[1]], board, 2);
		tm.placePawnsAtOffsetFromYourEntry([reds[2], null], board, 41);		
		tm.placePawnsAtOffsetFromYourEntry([greens[0], null], board, 23);
		tm.placePawnsAtOffsetFromYourEntry([yellows[0], yellows[1]], board, 11);

		board.getHomeRowStarts().forEach(spot => {
			board.spotRunner(spot, c.HOME_ROW_SIZE, spot.color, pg);
		});
		expect(pg.pawn_locs).to.be.empty;
	});

	it('should correctly get one pawn in one home row', () => {
		let green = new Pawn(2, Color.green);
		tm.placePawnsAtOffsetFromYourEntry([green, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
		let exp_piece_locs: [Pawn, number][] = [[green, 0]];
		
		board.getHomeRowStarts().forEach(spot => {
			board.spotRunner(spot, c.HOME_ROW_SIZE, spot.color, pg);
		});
		expect(pg.pawn_locs).to.deep.equal(exp_piece_locs);
	});

	it('should correctly get one pawn in each home row', () => {
		let red = new Pawn(0, Color.red);
		let blue = new Pawn(2, Color.blue);
		let green = new Pawn(1, Color.green);
		let yellow = new Pawn(3, Color.yellow);

		tm.placePawnsAtOffsetFromYourEntry([red, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
		tm.placePawnsAtOffsetFromYourEntry([blue, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
		tm.placePawnsAtOffsetFromYourEntry([green, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
		tm.placePawnsAtOffsetFromYourEntry([yellow, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);

		let exp_piece_locs: [Pawn, number][] = [[green, 0], [red, 0], [blue, 0], [yellow, 0]];
		exp_piece_locs = exp_piece_locs.sort((tuple_one, tuple_two) => tuple_one[0].color - tuple_two[0].color);

		board.getHomeRowStarts().forEach(spot => {
			board.spotRunner(spot, c.HOME_ROW_SIZE, spot.color, pg);
		});
		expect(pg.pawn_locs).to.deep.equal(exp_piece_locs);
	});

	it('should correctly get various pawns in various home rows at various locations', () => {
		let greens = [new Pawn(2, Color.green)];
		let yellows = [new Pawn(1, Color.yellow), new Pawn(0, Color.yellow)];
		let reds = [new Pawn(0, Color.red), new Pawn(2, Color.red), new Pawn(3, Color.red)];
		let blues = [new Pawn(0, Color.blue), new Pawn(1, Color.blue), new Pawn(2, Color.blue), new Pawn(3, Color.blue)];

		tm.placePawnsAtOffsetFromYourEntry([greens[0], null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + c.HOME_ROW_SIZE - 2);
		
		tm.placePawnsAtOffsetFromYourEntry([yellows[0], null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + 2);
		tm.placePawnsAtOffsetFromYourEntry([yellows[1], null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + 3);

		tm.placePawnsAtOffsetFromYourEntry([reds[0], reds[1]], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
		tm.placePawnsAtOffsetFromYourEntry([reds[2], null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + 4);
		
		tm.placePawnsAtOffsetFromYourEntry([blues[0], blues[1]], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + c.HOME_ROW_SIZE - 3);
		tm.placePawnsAtOffsetFromYourEntry([blues[2], null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + 1);
		tm.placePawnsAtOffsetFromYourEntry([blues[3], null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + 2);
		
		let exp_piece_locs: [Pawn, number][] = [
			[greens[0], c.HOME_ROW_SIZE - 2],
			[yellows[0], 2], [yellows[1], 3],
			[reds[0], 0], [reds[1], 0], [reds[2], 4],
			[blues[2], 1], [blues[3], 2], [blues[0], c.HOME_ROW_SIZE - 3], [blues[1], c.HOME_ROW_SIZE - 3]
		];
		exp_piece_locs = exp_piece_locs.sort((tuple_one, tuple_two) => tuple_one[0].color - tuple_two[0].color);

		board.getHomeRowStarts().forEach(spot => {
			board.spotRunner(spot, c.HOME_ROW_SIZE, spot.color, pg);
		});
		expect(pg.pawn_locs).to.deep.equal(exp_piece_locs);
	});
});

describe('PawnSetter main ring tests', () => {
	let board: Board;
	let starting_spot: _Spot;

	beforeEach(() => {
		board = new Board();
		starting_spot = board.mainRing[0];
	});

	it('should correctly set no pawns in main ring if it has no pawns', () => {
		let ps = new PawnSetter([], board, true);
		let temp = Color.green;

		board.spotRunner(starting_spot, c.MAIN_RING_SIZE, c.COLOR_TO_RUN_MAIN_RING, ps);
		
		let res = board.mainRing.every(spot => {
			return spot.nPawns() === 0;
		});

		expect(res).to.be.true;
	});
	
	it('should correctly set one pawn in main ring', () => {
		let green = new Pawn(2, Color.green);
		let green_pl: [Pawn, number][] = [[green, 6]];
		
		let ps = new PawnSetter(green_pl, board, true);
		board.spotRunner(starting_spot, c.MAIN_RING_SIZE, c.COLOR_TO_RUN_MAIN_RING, ps);

		expect(board.findSpotOfPawn(green).index).to.equal(tm.convertServerLocToMainRingLoc(6));
	});
	
	// it('should correctly get no pawns in home rows if there are pawns only in various main ring locations', () => {
	// 	let reds = [new Pawn(0, Color.red), new Pawn(2, Color.red), new Pawn(3, Color.red)];
	// 	let greens = [new Pawn(2, Color.green)];
	// 	let yellows = [new Pawn(1, Color.yellow), new Pawn(0, Color.yellow)];
		
	// 	tm.placePawnsAtOffsetFromYourEntry([reds[0], reds[1]], board, 2);
	// 	tm.placePawnsAtOffsetFromYourEntry([reds[2], null], board, 41);		
	// 	tm.placePawnsAtOffsetFromYourEntry([greens[0], null], board, 23);
	// 	tm.placePawnsAtOffsetFromYourEntry([yellows[0], yellows[1]], board, 11);

	// 	board.getHomeRowStarts().forEach(spot => {
	// 		board.spotRunner(spot, c.HOME_ROW_SIZE, spot.color, ps);
	// 	});
	// 	expect(ps.pawn_locs).to.be.empty;
	// });

	// it('should correctly get one pawn in one home row', () => {
	// 	let green = new Pawn(2, Color.green);
	// 	tm.placePawnsAtOffsetFromYourEntry([green, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
	// 	let exp_piece_locs: [Pawn, number][] = [[green, 0]];
		
	// 	board.getHomeRowStarts().forEach(spot => {
	// 		board.spotRunner(spot, c.HOME_ROW_SIZE, spot.color, ps);
	// 	});
	// 	expect(ps.pawn_locs).to.deep.equal(exp_piece_locs);
	// });

	// it('should correctly get one pawn in each home row', () => {
	// 	let red = new Pawn(0, Color.red);
	// 	let blue = new Pawn(2, Color.blue);
	// 	let green = new Pawn(1, Color.green);
	// 	let yellow = new Pawn(3, Color.yellow);

	// 	tm.placePawnsAtOffsetFromYourEntry([red, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
	// 	tm.placePawnsAtOffsetFromYourEntry([blue, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
	// 	tm.placePawnsAtOffsetFromYourEntry([green, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
	// 	tm.placePawnsAtOffsetFromYourEntry([yellow, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);

	// 	let exp_piece_locs: [Pawn, number][] = [[green, 0], [red, 0], [blue, 0], [yellow, 0]];
	// 	exp_piece_locs = exp_piece_locs.sort((tuple_one, tuple_two) => tuple_one[0].color - tuple_two[0].color);

	// 	board.getHomeRowStarts().forEach(spot => {
	// 		board.spotRunner(spot, c.HOME_ROW_SIZE, spot.color, ps);
	// 	});
	// 	expect(ps.pawn_locs).to.deep.equal(exp_piece_locs);
	// });

	// it('should correctly get various pawns in various home rows at various locations', () => {
	// 	let greens = [new Pawn(2, Color.green)];
	// 	let yellows = [new Pawn(1, Color.yellow), new Pawn(0, Color.yellow)];
	// 	let reds = [new Pawn(0, Color.red), new Pawn(2, Color.red), new Pawn(3, Color.red)];
	// 	let blues = [new Pawn(0, Color.blue), new Pawn(1, Color.blue), new Pawn(2, Color.blue), new Pawn(3, Color.blue)];

	// 	tm.placePawnsAtOffsetFromYourEntry([greens[0], null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + c.HOME_ROW_SIZE - 2);
		
	// 	tm.placePawnsAtOffsetFromYourEntry([yellows[0], null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + 2);
	// 	tm.placePawnsAtOffsetFromYourEntry([yellows[1], null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + 3);

	// 	tm.placePawnsAtOffsetFromYourEntry([reds[0], reds[1]], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
	// 	tm.placePawnsAtOffsetFromYourEntry([reds[2], null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + 4);
		
	// 	tm.placePawnsAtOffsetFromYourEntry([blues[0], blues[1]], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + c.HOME_ROW_SIZE - 3);
	// 	tm.placePawnsAtOffsetFromYourEntry([blues[2], null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + 1);
	// 	tm.placePawnsAtOffsetFromYourEntry([blues[3], null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + 2);
		
	// 	let exp_piece_locs: [Pawn, number][] = [
	// 		[greens[0], c.HOME_ROW_SIZE - 2],
	// 		[yellows[0], 2], [yellows[1], 3],
	// 		[reds[0], 0], [reds[1], 0], [reds[2], 4],
	// 		[blues[2], 1], [blues[3], 2], [blues[0], c.HOME_ROW_SIZE - 3], [blues[1], c.HOME_ROW_SIZE - 3]
	// 	];
	// 	exp_piece_locs = exp_piece_locs.sort((tuple_one, tuple_two) => tuple_one[0].color - tuple_two[0].color);

	// 	board.getHomeRowStarts().forEach(spot => {
	// 		board.spotRunner(spot, c.HOME_ROW_SIZE, spot.color, ps);
	// 	});
	// 	expect(ps.pawn_locs).to.deep.equal(exp_piece_locs);
	// });
});
