import * as x2js from 'x2js'
import * as c from './Constants'

import { Pawn } from './Pawn'
import { Board } from './Board'
import { Color } from './Color'
import { PrettyDumbPlayer } from './BasicPlayer'

import { _Move } from './_Move'
import { MoveEnter } from './MoveEnter'
import { MoveForward } from './MoveForward'

var parser = new x2js();

// start-game - request and response translation

// request translation
export function startGameXMLToColor(start_game: string): Color {
	let color = parser.xml2js(start_game);
	return c.COLOR_STRING_TO_ENUM[color['start-game']];
}

// response translation
export function nameResponseXML(name: string): string {
	return '<name>' + name + '</name>';
}

// doubles-penalty - response translation
// request action implicit in server path
export function doublesPenaltyResponse() {
	return '<void></void>'
}

// do-move - request and response translation

// request translation
export function doMoveXMLToBoardDice(board: string): [Board, number[]] {

	// placeholder values
	return [new Board([new PrettyDumbPlayer()]), [1]];
}

// Board construction
export function boardJSONToBoard(board: object): Board {
	return new Board([new PrettyDumbPlayer()]);
}

export function addPawnsInStartJSON(bases: object): void {

}

export function addPawnsInMainJSON(main_ring: object): void {

}

export function addPawnsInHomeRowJSON(home_rows: object): void {

}

export function addPawnsInHomesJSON(homes: object): void {

}

export function getPawnPositionFromPieceLocJSON(piece_loc: object): [Pawn, number] {
	return [new Pawn(0, 0), 0];
}

// Dice
export function diceJSONToDice(dice: object): number[] {
	return [0];
}

export function dieJSONToDie(die: object): number {
	return 0;
}

// response translation
export function movesToMovesXML(moves: _Move[]): string {
	return 'damn good moves';
}


export function moveToMoveXML(move: _Move): string {
	return 'one pretty good move';
}

export function distanceXMLToDistance(distance: string): number {
	return 0;
}

export function pawnXMLToPawn(pawn: string): Pawn {
	return new Pawn(0, 0);
}

// used in multiple paths

export function idXMLToId(id: string): number {
	return 0;
}

export function idToIdXML(id: number): string {
	return '<id>' + id.toString() + '</id>';
}