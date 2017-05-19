import * as x2js from 'x2js'
import * as c from './Constants'

import { Pawn } from './Pawn'
import { Board } from './Board'
import { Color } from './Color'
import { PawnSetter } from './_PawnHandler'
import { PrettyDumbPlayer } from './BasicPlayer'

import { _Move } from './_Move'
import { MoveEnter } from './MoveEnter'
import { MoveForward } from './MoveForward'

var parser = new x2js();

export function startGameXMLToColor(start_game: string): Color {
	let color: object = parser.xml2js(start_game);
	return Color[color['start-game'] as string];
}

export function nameFromXML(xml: string): string {
	let name: object = parser.xml2js(xml);
	return name["name"];
}

export function distanceXMLToDistance(distance: string): number {
	return parseInt(parser.xml2js(distance)["distance"]);
}

export function idXMLToId(id: string): number {
	return parseInt(parser.xml2js(id)["id"]);
}

// Dice
export function diceJSONToDice(dice: object): number[] {
	return dice['die'].map(die => { return parseInt(die); });
}

export function getPawnPositionFromPieceLocJSON(piece_loc: object): [Pawn, number] {
	let pawn: Pawn = pawnJSONToPawn(piece_loc["pawn"]);
	let loc: number = piece_loc["loc"];
	return [pawn, loc];
}

export function pawnJSONToPawn(json: object): Pawn {
	let id: number = parseInt(json["id"]);
	let color: Color = parseInt(Color[json["color"]]);
	
	return new Pawn(id, color);
}

export function movesFromXML(xml: string): _Move[] {
	return [];
}

export function doMoveXMLToBoardDice(board_and_dice: string): [Board, number[]] {
	let body: object = parser.xml2js(board_and_dice);

	return [boardJSONToBoard(body['board']), diceJSONToDice(body['dice'])];
}

// Board construction
export function boardJSONToBoard(board_json: object): Board {
	let board = new Board();

	// pawns in start automatically added by board constructor
	addPawnsInMainJSON(board_json['main'], board);
	addPawnsInHomeRowsJSON(board_json['home-rows'], board);
	addPawnsInHomesJSON(board_json['home'], board);

	return board;
}

// addPawnsInBase unneeded because board constructor does that for us

export function addPawnsInMainJSON(main_ring: object, board: Board): void {
	main_ring = arrayIfJSONIsNotArray(main_ring['piece-loc']);

	let pawn_locs: [Pawn, number][] = [];
	let pawn_setter = new PawnSetter(pawn_locs, board, true);
	board.spotRunner(board.mainRing[0], c.MAIN_RING_SIZE, c.COLOR_TO_RUN_MAIN_RING, pawn_setter);
}

export function addPawnsInHomeRowsJSON(home_rows: object, board: Board): void {
	home_rows = arrayIfJSONIsNotArray(home_rows['piece-loc']);
}

export function addPawnsInHomesJSON(homes: object, board: Board): void {
	homes = arrayIfJSONIsNotArray(homes['pawn']);
}

function arrayIfJSONIsNotArray(json: object | object[]): object[] {
	return Array.isArray(json) ? json : [json];
}
