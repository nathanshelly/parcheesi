import * as _ from 'lodash'
import * as e from '../src/Encoder'
import * as dec from '../src/Decoder'
import * as c from '../src/Constants'

import { Pawn } from '../src/Pawn'
import { Color } from '../src/Color'
import { Board } from '../src/Board'
import { _Player } from '../src/_Player'
import { Ethernet } from '../src/Ethernet'
import { PrettyDumbPlayer } from '../src/BasicPlayer'
import { MoveEnter } from '../src/MoveEnter'
import { MoveForward } from '../src/MoveForward'

import { expect } from 'chai';
import 'mocha';

describe('Filename: decoder.test.ts\n\nstartGameXMLToColor tests', () => {
	it('should return the correct color when given color XML', () => {
		let red_text = '<start-game>red</start-game>';
		let blue_text = '<start-game>blue</start-game>';
		let green_text = '<start-game>green</start-game>';
		let yellow_text = '<start-game>yellow</start-game>';

		expect(dec.startGameXMLToColor(red_text)).to.equal(Color.red);
		expect(dec.startGameXMLToColor(blue_text)).to.equal(Color.blue);
		expect(dec.startGameXMLToColor(green_text)).to.equal(Color.green);
		expect(dec.startGameXMLToColor(yellow_text)).to.equal(Color.yellow);
	});
});

describe('nameFromXML', () => {
	it('should extract a name correctly', () => {
		let xml = "<name>sasha</name>";
		expect(dec.nameFromXML(xml)).to.equal("sasha");
	});
});

describe('doMoveXMLToBoardDice test', () => { 
	it('should return a tuple of a board and array of dice', () => {
		let xml = `<board>`
						+ `<start>`
						+ `<pawn><color>yellow</color><id>3</id></pawn>`
						+ `<pawn><color>yellow</color><id>2</id></pawn>`
						+ `<pawn><color>yellow</color><id>1</id></pawn>`
						+ `<pawn><color>yellow</color><id>0</id></pawn>`
						+ `</start>`
						+ `<main>`
						+ `<piece-loc><pawn><color>red</color><id>3</id></pawn><loc>67</loc></piece-loc>`
						+ `<piece-loc><pawn><color>red</color><id>2</id></pawn><loc>67</loc></piece-loc>`
						+ `<piece-loc><pawn><color>green</color><id>1</id></pawn><loc>62</loc></piece-loc>`
						+ `<piece-loc><pawn><color>red</color><id>1</id></pawn><loc>16</loc></piece-loc>`
						+ `<piece-loc><pawn><color>blue</color><id>2</id></pawn><loc>8</loc></piece-loc>`
						+ `<piece-loc><pawn><color>green</color><id>0</id></pawn><loc>5</loc></piece-loc>`
						+ `<piece-loc><pawn><color>blue</color><id>1</id></pawn><loc>2</loc></piece-loc>`
						+ `<piece-loc><pawn><color>red</color><id>0</id></pawn><loc>1</loc></piece-loc>`
						+ `<piece-loc><pawn><color>blue</color><id>0</id></pawn><loc>0</loc></piece-loc>`
						+ `</main>`
						+ `<home-rows>`
						+ `<piece-loc><pawn><color>green</color><id>2</id></pawn><loc>0</loc></piece-loc>`
						+ `<piece-loc><pawn><color>blue</color><id>3</id></pawn><loc>2</loc></piece-loc>`
						+ `</home-rows>`
						+ `<home>`
						+ `<pawn><color>green</color><id>3</id></pawn>`
						+ `</home>`
						+ `</board>`
						+ `<dice>`
						+	`<die>2</die>`
						+ `<die>2</die>`
						+ `<die>5</die>`
						+ `<die>5</die>`
						+ `</dice>`;
		dec.doMoveXMLToBoardDice(xml);
	});
});

describe("Distance parsing", () => {
	it("should pull out a variety of distances", () => {
		function wrap(n: number): string { return `<distance>${n}</distance>` }

		expect(dec.distanceXMLToDistance(wrap(0))).to.equal(0);
		expect(dec.distanceXMLToDistance(wrap(1))).to.equal(1);
		expect(dec.distanceXMLToDistance(wrap(c.BOP_BONUS))).to.equal(c.BOP_BONUS);
	});
})

describe("ID parsing", () => {
	it("should pull out a variety of IDs", () => {
		function wrap(n: number): string { return `<id>${n}</id>` }

		expect(dec.idXMLToId(wrap(0))).to.equal(0);
		expect(dec.idXMLToId(wrap(1))).to.equal(1);
		expect(dec.idXMLToId(wrap(2))).to.equal(2);
		expect(dec.idXMLToId(wrap(3))).to.equal(3);
	});
});

describe("Pawn loc decoding", () => {
	it("should build a pawn from a pawn object correctly", () => {
		let pawnObj = {
			"color": "blue",
			"id": 0
		};
		expect(dec.pawnJSONToPawn(pawnObj)).to.deep.equal(new Pawn(0, Color.blue));

		pawnObj = {
			"color": "yellow",
			"id": 3
		};
		expect(dec.pawnJSONToPawn(pawnObj)).to.deep.equal(new Pawn(3, Color.yellow));
	});

	it("should build a pawn and location from a pawn_loc object correctly", () => {
		let piece_loc = {
			"pawn": {
				"color": "blue",
				"id": 0
			},
			"loc": 40
		};

		expect(dec.pieceLocJSONToPawnAndLoc(piece_loc)).to.deep.equal([
			new Pawn(0, Color.blue),
			40
		]);
	});
})

describe("Main ring decoding", () => {
	it("should add a single pawn in a main ring JSON to a board correctly", () => {
		let main_ring = {
			"piece-loc": {
				"pawn": {
					"color": "blue",
					"id": 0
				},
				"loc": 40
			}
		};

		let board = new Board();

		dec.addPawnsInMainJSON(main_ring, board);

		expect(board.getPawnsOfColorInBase(Color.blue).length).to.equal(3);
		expect(board.getPawnsOfColorOnBoard(Color.blue).length).to.equal(1);
		expect(board.getPawnsOfColorOnBoard(Color.blue)).to.deep.equal([
			new Pawn(0, Color.blue)
		]);
	});

	it("should add a multiple pawns in a main ring JSON to a board correctly", () => {
		let main_ring = {
			"piece-loc": [
				{
					"pawn": {
						"color": "blue",
						"id": 0
					},
					"loc": 40
				},
				{
					"pawn": {
						"color": "green",
						"id": 3
					},
					"loc": 35
				}
			]};

		let board = new Board();

		dec.addPawnsInMainJSON(main_ring, board);

		expect(board.getPawnsOfColorInBase(Color.blue).length).to.equal(3);
		expect(board.getPawnsOfColorInBase(Color.green).length).to.equal(3);
		expect(board.getPawnsOfColorOnBoard(Color.blue).length).to.equal(1);
		expect(board.getPawnsOfColorOnBoard(Color.green).length).to.equal(1);
		expect(board.getPawnsOfColorOnBoard(Color.blue)).to.deep.equal([
			new Pawn(0, Color.blue)
		]);
		expect(board.getPawnsOfColorOnBoard(Color.green)).to.deep.equal([
			new Pawn(3, Color.green)
		]);
	});
});

describe("Home row decoding", () => {
	it("should add a single pawn in a home row JSON to a board correctly", () => {
		let home_row = {
			"piece-loc": {
				"pawn": {
					"color": "blue",
					"id": 0
				},
				"loc": 40
			}
		};

		let board = new Board();

		dec.addPawnsInHomeRowsJSON(home_row, board);

		expect(board.getPawnsOfColorInBase(Color.blue).length).to.equal(3);
		expect(board.getPawnsOfColorOnBoard(Color.blue).length).to.equal(1);
		expect(board.getPawnsOfColorOnBoard(Color.blue)).to.deep.equal([
			new Pawn(0, Color.blue)
		]);
	});

	it("should add a multiple pawns in a home row JSON to a board correctly", () => {
		let home_row = {
			"piece-loc": [
				{
					"pawn": {
						"color": "blue",
						"id": 0
					},
					"loc": 40
				},
				{
					"pawn": {
						"color": "green",
						"id": 3
					},
					"loc": 35
				}
			]};

		let board = new Board();

		dec.addPawnsInHomeRowsJSON(home_row, board);

		expect(board.getPawnsOfColorInBase(Color.blue).length).to.equal(3);
		expect(board.getPawnsOfColorInBase(Color.green).length).to.equal(3);
		expect(board.getPawnsOfColorOnBoard(Color.blue).length).to.equal(1);
		expect(board.getPawnsOfColorOnBoard(Color.green).length).to.equal(1);
		expect(board.getPawnsOfColorOnBoard(Color.blue)).to.deep.equal([
			new Pawn(0, Color.blue)
		]);
		expect(board.getPawnsOfColorOnBoard(Color.green)).to.deep.equal([
			new Pawn(3, Color.green)
		]);
	});
});

describe("Home spot decoding", () => {
	it("should add a single pawn in a home spot JSON to a board correctly", () => {
		let home_row = {
			"pawn": {
				"color": "blue",
				"id": 0
			},
		};

		let board = new Board();

		dec.addPawnsInHomesJSON(home_row, board);

		expect(board.getPawnsOfColorInBase(Color.blue).length).to.equal(3);
		expect(board.getPawnsOfColorOnBoard(Color.blue).length).to.equal(1);
		expect(board.getPawnsOfColorOnBoard(Color.blue)).to.deep.equal([
			new Pawn(0, Color.blue)
		]);
	});

	it("should add a multiple pawns in a home row JSON to a board correctly", () => {
		let home_row = [
			{
				"pawn": {
					"color": "blue",
					"id": 0
				},
			},
			{
				"pawn": {
					"color": "green",
					"id": 3
				}
			}
		];

		let board = new Board();

		dec.addPawnsInHomesJSON(home_row, board);

		expect(board.getPawnsOfColorInBase(Color.blue).length).to.equal(3);
		expect(board.getPawnsOfColorInBase(Color.green).length).to.equal(3);
		expect(board.getPawnsOfColorOnBoard(Color.blue).length).to.equal(1);
		expect(board.getPawnsOfColorOnBoard(Color.green).length).to.equal(1);
		expect(board.getPawnsOfColorOnBoard(Color.blue)).to.deep.equal([
			new Pawn(0, Color.blue)
		]);
		expect(board.getPawnsOfColorOnBoard(Color.green)).to.deep.equal([
			new Pawn(3, Color.green)
		]);
	});
});

