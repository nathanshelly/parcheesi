import * as _ from 'lodash'
import * as enc from '../src/Encoder'
import * as dec from '../src/Decoder'
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
			return '<name>' + name + '</name>' === enc.nameResponseXML(name);
		});

		expect(res).to.equal(true);
	});
});

describe('voidXML test', () => { 
	it('should return <void></void>', () => {
		expect(enc.voidXML()).to.equal('<void></void>');
	});
});

describe('Dice encoding', () => {
	it('should encode a die correctly', () => {
		expect(enc.dieToXML(1)).to.equal("<die>1</die>");
	});

	it('should encode two dice correctly', () => {
		expect(enc.diceToXML([1, 2])).to.equal("<dice><die>1</die><die>2</die></dice>");
	});
});

describe("Pawn encoding", () => {
	it("should correctly encode a single pawn", () => {
		expect(enc.pawnToXML(new Pawn(0, Color.blue))).to.equal("<pawn><color>blue</color>0</pawn>");
	});

	it("should correctly encode two pawns", () => {
		let pawns = [new Pawn(0, Color.blue), new Pawn(3, Color.red)];
		let exp = "<pawn><color>blue</color>0</pawn><pawn><color>red</color>3</pawn>";

		expect(enc.pawnsToXML(pawns)).to.equal(exp);
	});
});

describe('Base spot encoding', () => {
	it('should encode a board with no pawns in base spots correctly', () => {
		// Implement this
		// let board = new Board(); 
	});
});
