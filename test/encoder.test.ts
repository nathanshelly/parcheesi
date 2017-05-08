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

describe('nameResponseXML tests', () => { 
	it('should return a name XML when given a name', () => {
		let names = ['Sasha', 'Nathan', c.TEST_NAME];

		let res = names.every(name => {
			return '<name>' + name + '</name>' === e.nameResponseXML(name);
		});

		expect(res).to.equal(true);
	});
});

describe('doublesPenalty test', () => { 
	it('should return <void></void>', () => {
		expect(e.doublesPenaltyResponse()).to.equal('<void></void>');
	});
});
