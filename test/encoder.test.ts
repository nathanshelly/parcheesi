import * as _ from 'lodash'
import * as enc from '../src/Encoder'
import * as dec from '../src/Decoder'
import * as c from '../src/Constants'
import * as tm from './TestMethods';

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

describe('colorToStartGameXML test', () => { 
	it('should return a start game XML when given a color', () => {
		let exp = '<start-game>green</start-game>';
		expect(enc.colorToStartGameXML(Color.green)).to.equal(exp);
	});
});

describe('doublesPenaltyXML test', () => { 
	it('should return <doubles-penalty></doubles-penalty>', () => {
		expect(enc.doublesPenaltyXML()).to.equal('<doubles-penalty></doubles-penalty>');
	});
});

describe('voidXML test', () => { 
	it('should return <void></void>', () => {
		expect(enc.voidXML()).to.equal('<void></void>');
	});
});

describe('nameResponseXML tests', () => { 
	it('should return a name XML when given a name', () => {
		let names = ['Sasha', 'Nathan', c.TEST_NAME];

		let res = names.every(name => {
			return `<name>${name}</name>` === enc.nameResponseXML(name);
		});

		expect(res).to.equal(true);
	});
});

describe('idToIDXML test', () => { 
	it('should return id XML when given an ID', () => {
		let id = 2;
		expect(enc.idToIdXML(id)).to.equal(`<id>${id}</id>`);
	});
});

describe("moveToMoveXML test", () => {
	let board: Board;
	let player_one: _Player;
	let pawn: Pawn;

	beforeEach(() => {
		board = new Board();
		player_one = new PrettyDumbPlayer();
		player_one.startGame(Color.green);
		pawn = new Pawn(1, player_one.color)
	});

	it("should correctly encode a single MoveEnter", () => {
		let move = new MoveEnter(pawn);
		let exp = `<enter-piece>${enc.pawnToXML(move.pawn)}</enter-piece>`

		expect(enc.moveToMoveXML(move, board)).to.equal(exp);
	});

	it("should correctly encode a single MoveForward whose pawn starts in the main ring", () => {
		tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, 1);
		let move = new MoveForward(pawn, 12);
		let adjusted_loc = tm.adjustMainRingLoc(board.findSpotOfPawn(move.pawn).index);
		let exp = `<move-piece-main>${enc.pawnToXML(move.pawn)}${enc.startToStartXML(adjusted_loc)}${enc.distanceToDistanceXML(move.distance)}</move-piece-main>`;

		expect(enc.moveToMoveXML(move, board)).to.equal(exp);
	});

	it("should correctly encode a single MoveForward whose pawn starts in the last main ring spot", () => {
		tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET - 1);
		let move = new MoveForward(pawn, 43);
		let adjusted_loc = tm.adjustMainRingLoc(board.findSpotOfPawn(move.pawn).index);
		let exp = `<move-piece-main>${enc.pawnToXML(move.pawn)}${enc.startToStartXML(adjusted_loc)}${enc.distanceToDistanceXML(move.distance)}</move-piece-main>`;

		expect(enc.moveToMoveXML(move, board)).to.equal(exp);
	});

	it("should correctly encode a single MoveForward whose pawn starts on a home row", () => {
		tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);
		let move = new MoveForward(pawn, 3);
		let exp = `<move-piece-home>${enc.pawnToXML(move.pawn)}${enc.startToStartXML(board.findSpotOfPawn(move.pawn).index)}${enc.distanceToDistanceXML(move.distance)}</move-piece-home>`;

		expect(enc.moveToMoveXML(move, board)).to.equal(exp);
	});

	it("should correctly encode several moves", () => {
		let player_two = new PrettyDumbPlayer();
		player_two.startGame(Color.blue);

		let pawn_two = new Pawn(0, player_two.color)
		let pawn_three = new Pawn(2, player_one.color)
		let pawn_four = new Pawn(3, player_two.color)

		tm.placePawnsAtOffsetFromYourEntry([pawn_two, null], board, 1);
		tm.placePawnsAtOffsetFromYourEntry([pawn_three, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET - 1);
		tm.placePawnsAtOffsetFromYourEntry([pawn_four, null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET);

		let move = new MoveEnter(pawn);
		let move_two = new MoveForward(pawn_two, 20);
		let move_three = new MoveForward(pawn_three, 3);
		let move_four = new MoveForward(pawn_four, 7);

		let adjusted_loc_move_two = tm.adjustMainRingLoc(board.findSpotOfPawn(move_two.pawn).index);
		let adjusted_loc_move_three = tm.adjustMainRingLoc(board.findSpotOfPawn(move_three.pawn).index);

		let exp = `<moves>`
						+ `<enter-piece>${enc.pawnToXML(move.pawn)}</enter-piece>`
						+ `<move-piece-main>${enc.pawnToXML(move_two.pawn)}${enc.startToStartXML(adjusted_loc_move_two)}${enc.distanceToDistanceXML(move_two.distance)}</move-piece-main>`
						+ `<move-piece-main>${enc.pawnToXML(move_three.pawn)}${enc.startToStartXML(adjusted_loc_move_three)}${enc.distanceToDistanceXML(move_three.distance)}</move-piece-main>`
						+ `<move-piece-home>${enc.pawnToXML(move_four.pawn)}${enc.startToStartXML(board.findSpotOfPawn(move_four.pawn).index)}${enc.distanceToDistanceXML(move_four.distance)}</move-piece-home>`
						+ `</moves>`;

		let moves = [move, move_two, move_three, move_four];
		expect(enc.movesToMovesXML(moves, board)).to.equal(exp);
	});
});

describe('startToStartXML test', () => { 
	it('should return a start XML when given a starting index', () => {
		let start = 12;
		expect(enc.startToStartXML(start)).to.equal(`<start>${start}</start>`);
	});
});

describe('distanceToDistanceXML test', () => { 
	it('should return a distance XML when given a distance', () => {
		let dist = c.OFFSET_BETWEEN_ENTRIES;
		let exp = `<distance>${dist}</distance>`;
		expect(enc.distanceToDistanceXML(dist)).to.equal(exp);
	});
});

describe('Dice encoding', () => {
	it('should encode a die correctly', () => {
		let die = 1;
		expect(enc.dieToXML(die)).to.equal(`<die>${die}</die>`);
	});

	it('should encode two dice correctly', () => {
		expect(enc.diceToXML([1, 2])).to.equal('<dice><die>1</die><die>2</die></dice>');
	});
});

describe('Base spot encoding', () => {
	it('should encode a board with no pawns in base spots correctly', () => {
		// Implement this
		// let board = new Board(); 
	});
});

describe('Base spot encoding', () => {
	it('should encode base spots with no pawns correctly', () => {
		let board = new Board();

		_.range(c.N_COLORS).forEach(i => {
			let pawns = board.getPawnsOfColor(i);
			tm.placePawnsOnGivenColorEntrySpot([pawns[0], pawns[1]], board, i);
			tm.placePawnsAtOffsetFromYourEntry([pawns[2], pawns[3]], board, 1);
		});

		_.range(c.N_COLORS).forEach(i => {
			expect(board.getPawnsOfColorInBase(i).length).to.equal(0);
		});

		expect(enc.startSpotsToXML(board)).to.equal("<start></start>");
	});

	it('should encode base spots with some pawns correctly', () => {
		let board = new Board();

		_.range(c.N_COLORS - 1).forEach(i => {
			let pawns = board.getPawnsOfColor(i);
			tm.placePawnsOnGivenColorEntrySpot([pawns[0], pawns[1]], board, i);
			tm.placePawnsAtOffsetFromYourEntry([pawns[2], pawns[3]], board, 1);
		});

		_.range(c.N_COLORS - 1).forEach(i => {
			expect(board.getPawnsOfColorInBase(i).length).to.equal(0);
		});

		// Only yellow should be in the base spots here
		expect(board.getPawnsOfColorInBase(Color.yellow).length).to.equal(c.MAX_N_PAWNS_BASE);

		let xml = enc.startSpotsToXML(board);
		let exp = `<start>`
						+ `<pawn><color>yellow</color><id>0</id></pawn>`
						+ `<pawn><color>yellow</color><id>1</id></pawn>`
						+ `<pawn><color>yellow</color><id>2</id></pawn>`
						+ `<pawn><color>yellow</color><id>3</id></pawn>`
						+ `</start>`;

		expect(xml).to.equal(exp);
	});
});

describe("Home spot encoding", () => {
	it('should encode home spots with no pawns correctly', () => {
		let board = new Board();
		expect(enc.homeSpotsToXML(board)).to.equal("<home></home>");
	});

	it('should encode one home spot with all pawns of a color correctly', () => {
		let board = new Board();
		let yellows = [new Pawn(0, Color.yellow), new Pawn(1, Color.yellow), new Pawn(2, Color.yellow), new Pawn(3, Color.yellow)];

		tm.placePawnsAtOffsetFromYourEntry([yellows[0], yellows[1]], board, c.ENTRY_TO_HOME_OFFSET);
		tm.placePawnsAtOffsetFromYourEntry([yellows[2], yellows[3]], board, c.ENTRY_TO_HOME_OFFSET);

		let exp = `<home>`
						+ `<pawn><color>yellow</color><id>0</id></pawn>`
						+ `<pawn><color>yellow</color><id>1</id></pawn>`
						+ `<pawn><color>yellow</color><id>2</id></pawn>`
						+ `<pawn><color>yellow</color><id>3</id></pawn>`
						+ `</home>`;

		expect(enc.homeSpotsToXML(board)).to.equal(exp);
	});
});

describe("Main ring encoding", () => {
	it("should encode a main ring with no pawns in it correctly", () => {
		let board = new Board();

		expect(enc.mainRingToXML(board)).to.equal("<main></main>");
	});

	it("should encode a main ring with some pawns in it correctly",  () => {
		let board = new Board();

		let pawn0 = new Pawn(0, Color.blue)
		let pawn1 = new Pawn(1, Color.blue)
		let pawn2 = new Pawn(0, Color.green)

		tm.placePawnsOnGivenColorEntrySpot([pawn0, pawn1], board, Color.blue);
		tm.placePawnsAtOffsetFromYourEntry([pawn2, null], board, 3);

		let exp = `<main>`
						+ `<piece-loc><pawn><color>green</color><id>0</id></pawn><loc>${ (c.ENTRY_ENCODING_INDICES[Color.green] + 3)}</loc></piece-loc>`
						+ `<piece-loc><pawn><color>blue</color><id>0</id></pawn><loc>${ c.ENTRY_ENCODING_INDICES[Color.blue] }</loc></piece-loc>`
						+ `<piece-loc><pawn><color>blue</color><id>1</id></pawn><loc>${ c.ENTRY_ENCODING_INDICES[Color.blue] }</loc></piece-loc>`
						+ `</main>`;

		expect(enc.mainRingToXML(board)).to.equal(exp);
	});
});

describe('Piece-loc encoding', () => {
	it('should correctly encode a single piece-loc', () => {
		let pawn_loc: [Pawn, number] = [new Pawn(2, Color.blue), 11];
		let exp = `<piece-loc>`
						+ `<pawn><color>${Color[pawn_loc[0].color]}</color><id>${pawn_loc[0].id}</id></pawn>`
						+ `<loc>${pawn_loc[1]}</loc>`
						+ `</piece-loc>`
		expect(enc.pawnLocToPieceLocXML(pawn_loc)).to.equal(exp);
	});

	it('should correctly encode several piece-locs', () => {
		let pawn_locs: [Pawn, number][] = [[new Pawn(2, Color.blue), 11], [new Pawn(2, Color.red), c.ENTRY_TO_HOME_OFFSET]];
		let exp = `<piece-loc>`
						+ `<pawn><color>${Color[pawn_locs[0][0].color]}</color><id>${pawn_locs[0][0].id}</id></pawn>`
						+ `<loc>${pawn_locs[0][1]}</loc>`
						+ `</piece-loc>`
						+ `<piece-loc>`
						+ `<pawn><color>${Color[pawn_locs[1][0].color]}</color><id>${pawn_locs[1][0].id}</id></pawn>`
						+ `<loc>${pawn_locs[1][1]}</loc>`
						+ `</piece-loc>`
		expect(enc.pawnLocsToPieceLocsXML(pawn_locs)).to.equal(exp);
	});

	it('should correctly encode empty piece-locs', () => {
		let pawn_locs = [];
		expect(enc.pawnLocsToPieceLocsXML(pawn_locs)).to.equal('');
	});
});

describe("Pawn encoding", () => {
	it("should correctly encode a single pawn", () => {
		let exp = '<pawn><color>blue</color><id>0</id></pawn>';
		expect(enc.pawnToXML(new Pawn(0, Color.blue))).to.equal(exp);
	});

	it("should correctly encode two pawns", () => {
		let pawns = [new Pawn(0, Color.blue), new Pawn(3, Color.red)];
		let exp = `<pawn><color>blue</color><id>0</id></pawn>`
						+ `<pawn><color>red</color><id>3</id></pawn>`;
		expect(enc.pawnsToXML(pawns)).to.equal(exp);
	});
});
