import * as _ from 'lodash'
import * as d from '../src/Distances'
import * as c from '../src/Constants'
import * as t from '../src/Translator'

import { Pawn } from '../src/Pawn'
import { Color } from '../src/Color'
import { Board } from '../src/Board'
import { _Player } from '../src/_Player'
import { NPlayer } from '../src/NPlayer'
import { PrettyDumbPlayer } from '../src/BasicPlayer'
import { MoveEnter } from '../src/MoveEnter'
import { MoveForward } from '../src/MoveForward'

import { expect } from 'chai';
import 'mocha';

describe('Filename: translator.test.ts\n\nstartGameXMLToColor tests', () => {
	it('should return the correct color when given color XML', () => {
		let red_text = '<start-game>red</start-game>';
		let blue_text = '<start-game>blue</start-game>';
		let green_text = '<start-game>green</start-game>';
		let yellow_text = '<start-game>yellow</start-game>';

		expect(t.startGameXMLToColor(red_text)).to.equal(Color.Red);
		expect(t.startGameXMLToColor(blue_text)).to.equal(Color.Blue);
		expect(t.startGameXMLToColor(green_text)).to.equal(Color.Green);
		expect(t.startGameXMLToColor(yellow_text)).to.equal(Color.Yellow);
	});
});

describe('nameToNameXML tests', () => { });
