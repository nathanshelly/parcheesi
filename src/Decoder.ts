import * as x2js from 'x2js'
import * as _ from 'lodash'

import * as c from './Constants'

import { Pawn } from './Pawn'
import { Board } from './Board'
import { HomeRowSpot } from './HomeRowSpot'
import { HomeSpot } from './HomeSpot'
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

export function pieceLocJSONToPawnAndLoc(piece_loc: object): [Pawn, number] {
	let pawn: Pawn = pawnJSONToPawn(piece_loc["pawn"]);
	let loc: number = parseInt(piece_loc["loc"]);
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
	let body: object = parser.xml2js(board_and_dice)['do-move'];

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

export function addPawnsInMainJSON(main_ring: object | string, board: Board): void {
	if (typeof main_ring === 'string')
		return

	let wrapped = validateBoardSectionJSON(main_ring['piece-loc']);
	let pawn_locs: [Pawn, number][] = wrapped.map(pieceLocJSONToPawnAndLoc);

	let pawn_setter = new PawnSetter(pawn_locs, board, true);
	board.spotRunner(board.mainRing[0], c.MAIN_RING_SIZE, c.COLOR_TO_RUN_MAIN_RING, pawn_setter);
}

export function addPawnsInHomeRowsJSON(home_rows: object | string, board: Board): void {
	if (typeof home_rows === 'string')
		return

	let wrapped = validateBoardSectionJSON(home_rows['piece-loc']);
	let pawn_locs: [Pawn, number][] = wrapped.map(pl => {return pieceLocJSONToPawnAndLoc(pl) });
	let hr_starts = board.getHomeRowStarts();

	_.range(c.N_COLORS).forEach(i => {
		let pls_of_color = pawn_locs.filter(pl => { return pl[0].color == i });
		let pawn_setter = new PawnSetter(pls_of_color, board, true);

		let hrs: HomeRowSpot = hr_starts[i];

		board.spotRunner(hrs, c.HOME_ROW_SIZE, i, pawn_setter);
	});
}

export function addPawnsInHomesJSON(homes: object | string, board: Board): void {
	if (typeof homes === 'string')
		return

	let wrapped = validateBoardSectionJSON(homes["pawn"]);
	let home_pawns: Pawn[] = wrapped.map(pawnJSONToPawn);

	let home_spots = board.getHomeSpots();
	_.range(c.N_COLORS).forEach(i => {
		let hps_of_color = home_pawns.filter(hp => { return hp.color == i });

		hps_of_color.forEach(hp => { board.findSpotOfPawn(hp).removePawn(hp); });
		hps_of_color.forEach(hp => { home_spots[i].addPawn(hp) });
	});
}

function validateBoardSectionJSON(json: string | object | object[]): object[] {
	return typeof json === "string" ? [] : Array.isArray(json) ? json : [json];
}
