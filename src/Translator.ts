import * as xml_to_json from 'xml2json'

import { Pawn } from './Pawn'
import { Board } from './Board'
import { Color } from './Color'
import { _Move } from './_Move'
import { MoveForward } from './MoveForward'
import { PrettyDumbPlayer } from './BasicPlayer'

export function translateXMLToBoard(board: string): [Board, number[]] {
	console.log(xml_to_json.toJson(board));

	// placeholder values
	return [new Board([new PrettyDumbPlayer()]), [1]];
}

export function translateMovesToXML(moves: _Move[]): _Move[] {
	console.log(xml_to_json.toXml(moves));

	// placeholder values
	return [new MoveForward(new Pawn(2, Color.Blue), 1)];
}

export function translateStartGameXMLToColor(start_game: string): Color {
	console.log(xml_to_json.toJson(start_game));

	// placeholder values
	return Color.Blue;
}