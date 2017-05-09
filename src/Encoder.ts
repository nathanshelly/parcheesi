import * as x2js from 'x2js'
import _ = require('lodash');

import * as c from './Constants'

import { Pawn } from './Pawn'
import { Board } from './Board'
import { Color } from './Color'
import { PrettyDumbPlayer } from './BasicPlayer'
import { PawnGetter } from './_PawnHandler';

import { _Move } from './_Move'
import { MoveEnter } from './MoveEnter'
import { MoveForward } from './MoveForward'
import { HomeRowSpot } from './HomeRowSpot';

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

/* Dice */
export function diceToXML(dice: number[]): string {
	return "<dice>" + _.join(dice.map(dieToXML), "") + "</dice>";
}

export function dieToXML(die: number): string {
	return "<die>" + die.toString() + "</die>";
}

/* Start and home spots */
export function startSpotsToXML(board: Board): string {
	return "<start>" + _.range(c.N_COLORS).map(i => pawnsToXML(board.getPawnsOfColorInBase(i))).join("") + "</start>";
}

export function homeSpotsToXML(board: Board): string {
	return "<home>" + board.getHomeSpots().map(home_spot => { return pawnsToXML(home_spot.getLivePawns()); }).join("") + "</home>";
}

/* Main ring and home spots */
export function mainRingToXML(board: Board): string {
	let zero = board.mainRing[0];
	let dist = c.MAIN_RING_SIZE;

	let pg = new PawnGetter();
	board.spotRunner(zero, dist, Color.green, pg);

	return "<main>" + pawnLocsToXML(pg.pawn_locs) + "</main>";
}

export function homeRowsToXML(board: Board): string {
	let hrs = board.getHomeRowStarts();
	return "<home-rows>" + hrs.map(h => {return homeRowToXML(board, h)}).join("") + "</home-rows>";
}

export function homeRowToXML(board: Board, hrStart: HomeRowSpot): string {
	let pg = new PawnGetter();
	board.spotRunner(hrStart, c.HOME_ROW_SIZE, hrStart.color, pg);

	return pawnLocsToXML(pg.pawn_locs);
}

export function pawnLocsToXML(pawnLocs: [Pawn, number][]): string {
	return pawnLocs.map(pawnLocToXML).join("");
}

export function pawnLocToXML(pawnLoc: [Pawn, number]): string {
	return "<piece-loc>" + pawnToXML(pawnLoc[0]) + "<loc>" + pawnLoc[1].toString() + "</loc></piece-loc>";
}

/* Pawns */
export function pawnsToXML(pawns: Pawn[]): string {
	return pawns.map(pawnToXML).join("");
}

export function pawnToXML(pawn: Pawn): string {
	return "<pawn><color>" + Color[pawn.color] + "</color>" + pawn.id.toString() + "</pawn>";
}

