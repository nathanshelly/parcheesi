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

	it('should correctly get no pawns in main ring if there are pawns in homes and bases', () => {
		let reds = [new Pawn(0, Color.red), new Pawn(2, Color.red), new Pawn(3, Color.red)];
		let greens = [new Pawn(2, Color.green)];
		let yellows = [new Pawn(1, Color.yellow), new Pawn(0, Color.yellow)];
		
		tm.placePawnsAtOffsetFromYourEntry([reds[0], reds[1]], board, c.ENTRY_TO_HOME_OFFSET);
		tm.placePawnsAtOffsetFromYourEntry([reds[2], null], board, c.ENTRY_TO_HOME_OFFSET);		
		tm.placePawnsAtOffsetFromYourEntry([greens[0], null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
		tm.placePawnsAtOffsetFromYourEntry([yellows[0], yellows[1]], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);

		let num_pawns = board.getHomeSpots().reduce((num_pawns, spot) => {
			return num_pawns + spot.getLivePawns().length;
		}, 0);
		expect(num_pawns).to.equal(3);

		board.spotRunner(starting_spot, c.MAIN_RING_SIZE, c.COLOR_TO_RUN_MAIN_RING, pg);
		expect(pg.pawn_locs).to.be.empty;
	});
});
