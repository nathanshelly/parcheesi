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

// name - request and response translation
export function nameResponseXML(name: string): string {
	return '<name>' + name + '</name>';
}

// only response is void
export function doublesPenaltyResponse() {
	return '<void></void>';
}

// response translation
export function movesToMovesXML(moves: _Move[]): string {
	return 'damn good moves';
}

export function moveToMoveXML(move: _Move): string {
	return 'one pretty good move';
}

export function idToIdXML(id: number): string {
	return '<id>' + id.toString() + '</id>';
}