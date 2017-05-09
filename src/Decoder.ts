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

export function startGameXMLToColor(start_game: string): Color {
	let color: object = parser.xml2js(start_game);
	return Color[color['start-game'] as string];
}

export function doMoveXMLToBoardDice(board_and_dice: string): [Board, number[]] {
	let body: object = parser.xml2js(board_and_dice);

	return [boardJSONToBoard(body['board']), diceJSONToDice(body['dice'])];
}

// Board construction
export function boardJSONToBoard(board: object): Board {
	// let board = new Board()

	return new Board();
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

export function distanceXMLToDistance(distance: string): number {
	return 0;
}

export function pawnXMLToPawn(pawn: string): Pawn {
	return new Pawn(0, 0);
}

export function idXMLToId(id: string): number {
	return 0;
}