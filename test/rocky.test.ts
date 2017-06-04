import * as tm from '../test/TestMethods'

import { Pawn }  from '../src/Pawn'
import { Board } from '../src/Board'
import { Color } from '../src/Color'

import { _Move } from '../src/_Move'
import { MoveEnter } from '../src/MoveEnter'
import { MoveForward } from '../src/MoveForward'

import { Rocky } from '../src/rocky/Rocky'

import 'mocha';
import { expect } from 'chai';

describe('Filename: rocky.test.ts\n\nAll legal moves', () => {
	let rocky: Rocky, board: Board, pawns: Pawn[];
	
	beforeEach(() => {
		board = new Board();
		rocky = new Rocky((brd: Board, col: Color) => { return 1; });
		rocky.startGame(Color.blue);

		pawns = [new Pawn(0, rocky.color), new Pawn(1, rocky.color),
						 new Pawn(2, rocky.color), new Pawn(3, rocky.color)];
	});
	
	it('should correctly find zero legal moves if dice are empty', () => {
		rocky.allMoves(board, []).forEach(move_set => {
			expect(move_set).to.be.empty;
		});
	});

	it('should correctly find zero legal moves if all pawns in base and no 5s in dice', () => {
		expect(rocky.allMoves(board, [1, 3])).to.be.empty;
	});

	it('should correctly find one enter move when given 2 dice making a 5', () => {
		let move_sets: _Move[][] = rocky.allMoves(board, [2, 3]);
		
		expect(move_sets.length).to.equal(4);

		let id = 0;
		move_sets.forEach(move_set => {
			expect(move_set.length).to.equal(1);
			expect(move_set[0]).to.deep.equal(new MoveEnter(new Pawn(id++, rocky.color)));
		});
	});

	it('should correctly find one enter move when given one 5', () => {
		let move_sets: _Move[][] = rocky.allMoves(board, [5]);

		expect(move_sets.length).to.equal(4);

		let id = 0;
		move_sets.forEach(move_set => {
			expect(move_set.length).to.equal(1);
			expect(move_set[0]).to.deep.equal(new MoveEnter(new Pawn(id++, rocky.color)));
		});
	});

	it('should correctly find one enter move and one moveForward when given one 5', () => {
		let move_sets: _Move[][] = rocky.allMoves(board, [5, 1]);
		
		expect(move_sets.length).to.equal(4);

		let id = 0;
		move_sets.forEach(move_set => {
			expect(move_set.length).to.equal(2);
			expect(move_set[0]).to.deep.equal(new MoveEnter(new Pawn(id, rocky.color)));
			expect(move_set[1]).to.deep.equal(new MoveForward(new Pawn(id++, rocky.color), 1));
		});
	});

	it('should correctly find two MoveForwards', () => {
		let pawn = new Pawn(0, rocky.color);
		tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, 2);
		
		let move_sets: _Move[][] = rocky.allMoves(board, [3, 4]);
		expect(move_sets.length).to.equal(2);

		let expected_move_sets = [
			[new MoveForward(pawn, 3), new MoveForward(pawn, 4)],
			[new MoveForward(pawn, 4), new MoveForward(pawn, 3)]
		];

		expect(move_sets).to.deep.equal(expected_move_sets);
	});

	it('should correctly find two MoveForwards', () => {
		let pawn = pawns[0];
		tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, 2);
		
		let move_sets: _Move[][] = rocky.allMoves(board, [3, 10]);
		expect(move_sets.length).to.equal(2);

		let expected_move_sets = [
			[new MoveForward(pawn, 3), new MoveForward(pawn, 10)],
			[new MoveForward(pawn, 10), new MoveForward(pawn, 3)]
		];

		expect(move_sets).to.deep.equal(expected_move_sets);
	});

	it('should correctly find one MoveEnter and one MoveForward', () => {
		let move_sets: _Move[][] = rocky.allMoves(board, [3, 5]);
		expect(move_sets.length).to.equal(4);

		let expected_move_sets = [
			[new MoveEnter(pawns[0]), new MoveForward(pawns[0], 3)],
			[new MoveEnter(pawns[1]), new MoveForward(pawns[1], 3)],
			[new MoveEnter(pawns[2]), new MoveForward(pawns[2], 3)],
			[new MoveEnter(pawns[3]), new MoveForward(pawns[3], 3)]
		];

		expect(move_sets).to.deep.equal(expected_move_sets);
	});

	it('should correctly find one MoveEnter and one MoveForward', () => {
		let move_sets: _Move[][] = rocky.allMoves(board, [3, 5]);
		expect(move_sets.length).to.equal(4);

		let expected_move_sets = [
			[new MoveEnter(pawns[0]), new MoveForward(pawns[0], 3)],
			[new MoveEnter(pawns[1]), new MoveForward(pawns[1], 3)],
			[new MoveEnter(pawns[2]), new MoveForward(pawns[2], 3)],
			[new MoveEnter(pawns[3]), new MoveForward(pawns[3], 3)]
		];

		expect(move_sets).to.deep.equal(expected_move_sets);
	});

	it('should correctly find one MoveEnter and two MoveForwards', () => {
		let move_sets: _Move[][] = rocky.allMoves(board, [3, 4, 5]);
		expect(move_sets.length).to.equal(8);

		let expected_move_sets = [
			[new MoveEnter(pawns[0]), new MoveForward(pawns[0], 3), new MoveForward(pawns[0], 4)],
			[new MoveEnter(pawns[0]), new MoveForward(pawns[0], 4), new MoveForward(pawns[0], 3)],
			[new MoveEnter(pawns[1]), new MoveForward(pawns[1], 3), new MoveForward(pawns[1], 4)],
			[new MoveEnter(pawns[1]), new MoveForward(pawns[1], 4), new MoveForward(pawns[1], 3)],
			[new MoveEnter(pawns[2]), new MoveForward(pawns[2], 3), new MoveForward(pawns[2], 4)],
			[new MoveEnter(pawns[2]), new MoveForward(pawns[2], 4), new MoveForward(pawns[2], 3)],
			[new MoveEnter(pawns[3]), new MoveForward(pawns[3], 3), new MoveForward(pawns[3], 4)],
			[new MoveEnter(pawns[3]), new MoveForward(pawns[3], 4), new MoveForward(pawns[3], 3)]
		];

		expect(move_sets).to.deep.equal(expected_move_sets);
	});
});