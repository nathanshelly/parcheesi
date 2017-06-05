import * as tm from '../test/TestMethods'

import { Pawn }  from '../src/Pawn'
import { Board } from '../src/Board'
import { Color } from '../src/Color'

import * as dec from '../src/Decoder'

import { _Move } from '../src/_Move'
import { MoveEnter } from '../src/MoveEnter'
import { MoveForward } from '../src/MoveForward'

import { Rocky } from '../src/rocky/Rocky'
import { Coach } from '../src/rocky/Coach'

import 'mocha';
import { expect } from 'chai';

describe('Filename: rocky.test.ts\n\nAll legal moves', () => {
	let rocky: Rocky, board: Board, pawns: Pawn[];
	
	beforeEach(() => {
		board = new Board();
		rocky = new Coach().build_rocky();
		rocky.startGame(Color.blue);

		pawns = [new Pawn(0, rocky.color), new Pawn(1, rocky.color),
						 new Pawn(2, rocky.color), new Pawn(3, rocky.color)];
	});
	
	it('should correctly find zero legal moves if dice are empty', () => {
		rocky.allMoves(board, []).forEach(move_set => { expect(move_set).to.be.empty; });
	});

	it('should correctly find zero legal moves if all pawns in base and no 5s in dice', () => {
		rocky.allMoves(board, [1, 3]).forEach(move_set => { expect(move_set).to.be.empty; });
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

	it('should find a MoveForward with distance 4 for each of two pawns in the home row in this instance we cheated on', () => {
		let xml = "<do-move><board><start><pawn><color>yellow</color><id>3</id></pawn><pawn><color>yellow</color><id>0</id></pawn><pawn><color>red</color><id>1</id></pawn><pawn><color>green</color><id>3</id></pawn><pawn><color>blue</color><id>2</id></pawn><pawn><color>blue</color><id>1</id></pawn></start><main><piece-loc><pawn><color>red</color><id>0</id></pawn><loc>52</loc></piece-loc><piece-loc><pawn><color>blue</color><id>3</id></pawn><loc>39</loc></piece-loc><piece-loc><pawn><color>red</color><id>2</id></pawn><loc>38</loc></piece-loc><piece-loc><pawn><color>yellow</color><id>1</id></pawn><loc>31</loc></piece-loc><piece-loc><pawn><color>yellow</color><id>2</id></pawn><loc>2</loc></piece-loc></main><home-rows><piece-loc><pawn><color>green</color><id>1</id></pawn><loc>1</loc></piece-loc><piece-loc><pawn><color>green</color><id>0</id></pawn><loc>1</loc></piece-loc><piece-loc><pawn><color>blue</color><id>0</id></pawn><loc>4</loc></piece-loc></home-rows><home><pawn><color>red</color><id>3</id></pawn><pawn><color>green</color><id>2</id></pawn></home></board><dice><die>4</die><die>4</die></dice></do-move>";

		let [board, dice] = dec.doMoveXMLToBoardDice(xml);

		let green_rocky = new Coach().build_rocky();
		green_rocky.startGame(Color.green);

		let move_sets = green_rocky.allMoves(board, dice);

		expect(move_sets.length).to.equal(4);

		let expected_move_sets = [
			[new MoveForward(new Pawn(1, Color.green), 4)],
			[new MoveForward(new Pawn(1, Color.green), 4)],
			[new MoveForward(new Pawn(0, Color.green), 4)],
			[new MoveForward(new Pawn(0, Color.green), 4)]
		];

		expect(move_sets).to.deep.equal(expected_move_sets);
	})
});
