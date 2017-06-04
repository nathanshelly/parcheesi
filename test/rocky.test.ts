

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
	let rocky: Rocky, board: Board;
	
	beforeEach(() => {
		board = new Board();
		rocky = new Rocky((brd: Board, col: Color, moves: _Move[]) => { return 1; });
		rocky.startGame(Color.blue);
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
		// move_sets.forEach(move_set => {
		// 	expect(move_set.length).to.equal(1);
		// 	expect(move_set[0]).to.deep.equal(new MoveEnter(new Pawn(id++, rocky.color)));
		// });
	});
});