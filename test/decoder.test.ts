import * as _ from 'lodash'
import * as e from '../src/Encoder'
import * as d from '../src/Decoder'
import * as c from '../src/Constants'

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

describe('Filename: encoder.test.ts\n\nstartGameXMLToColor tests', () => {
	it('should return the correct color when given color XML', () => {
		let red_text = '<start-game>red</start-game>';
		let blue_text = '<start-game>blue</start-game>';
		let green_text = '<start-game>green</start-game>';
		let yellow_text = '<start-game>yellow</start-game>';

		expect(d.startGameXMLToColor(red_text)).to.equal(Color.red);
		expect(d.startGameXMLToColor(blue_text)).to.equal(Color.blue);
		expect(d.startGameXMLToColor(green_text)).to.equal(Color.green);
		expect(d.startGameXMLToColor(yellow_text)).to.equal(Color.yellow);
	});
});

describe('doMoveXMLToBoardDice test', () => { 
	it('should return a tuple of a board and array of dice', () => {
		// placeholder
	});
});
