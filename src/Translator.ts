import * as xml_to_json from 'xml2json'

import { Pawn } from './Pawn'
import { Board } from './Board'
import { Color } from './Color'
import { _Move } from './_Move'
import { MoveForward } from './MoveForward'
import { PrettyDumbPlayer } from './BasicPlayer'

export function startGameXMLToColor(start_game: string): Color {
	console.log(xml_to_json.toJson(start_game));

	// placeholder values
	return Color.Blue;
}

export function nameToNameXML(name: string): string {
	return '<name>' + name + '</name>';
}

export function doMoveXMLToBoardDice(board: string): [Board, number[]] {
	console.log(xml_to_json.toJson(board));

	// placeholder values
	return [new Board([new PrettyDumbPlayer()]), [1]];
}

export function movesToMovesXML(moves: _Move[]): string {
	console.log(xml_to_json.toXml(moves));

	// placeholder return
	return 'damn good moves';
}

// currently no doubles penalty translation, handled solely by server paths
// also no void translation - it's void

// export function boardXMLToBoard(board: string): Board {
	
// }