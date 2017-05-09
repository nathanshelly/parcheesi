import * as x2js from 'x2js'
import _ = require('lodash');

import * as c from './Constants'

import { Pawn } from './Pawn'
import { Board } from './Board'
import { Color } from './Color'
import { PrettyDumbPlayer } from './BasicPlayer'

import { _Move } from './_Move'
import { MoveEnter } from './MoveEnter'
import { MoveForward } from './MoveForward'

var parser = new x2js();

/* Wrap a color to send a start-game */
export function colorToStartGameXML(color: Color): string {
	return "<start-game>" + Color[color] + "</start-game>";
}

/* Doubles penalty */
export function doublesPenaltyXML(): string {
	return "<doubles-penalty></doubles-penalty>";
}

export function voidXML(): string {
	return '<void></void>';
}

/* Names */
export function nameResponseXML(name: string): string {
	return '<name>' + name + '</name>';
}

export function movesToMovesXML(moves: _Move[]): string {
	return 'damn good moves';
}

export function moveToMoveXML(move: _Move): string {
	return 'one pretty good move';
}

export function idToIdXML(id: number): string {
	return '<id>' + id.toString() + '</id>';
}

/* Boards r hard */
export function doMoveToXML(board: Board, distances: number/* 1-6 */[]): string {


	return "what a lovely board"
}

export function diceToXML(dice: number[]): string {
	let str_dice = dice.map(d => {
		return dieToXML(d);
	});

	return "<dice>" + _.join(str_dice, "") + "</dice>";
}

export function dieToXML(die: number): string {
	return "<die>" + die.toString() + "</die>";
}

export function startSpotsToXML(board: Board): string {
	return "<start>" + _.range(c.N_COLORS).map(i => pawnsToXML(board.getPawnsOfColorInBase(i))).join("") + "</start>";
}

export function pawnsToXML(pawns: Pawn[]): string {
	return pawns.map(pawnToXML).join("");
}

export function pawnToXML(pawn: Pawn): string {
	return "<pawn><color>" + Color[pawn.color] + "</color>" + pawn.id.toString() + "</pawn>";
}

