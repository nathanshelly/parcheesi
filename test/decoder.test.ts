import * as _ from 'lodash'
import * as e from '../src/Encoder'
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

describe('Filename: encoder.test.ts\n\nstartGameXMLToColor tests', () => {
	it('should return the correct color when given color XML', () => {
		let red_text = '<start-game>red</start-game>';
		let blue_text = '<start-game>blue</start-game>';
		let green_text = '<start-game>green</start-game>';
		let yellow_text = '<start-game>yellow</start-game>';

		expect(dec.startGameXMLToColor(red_text)).to.equal(Color.red);
		expect(dec.startGameXMLToColor(blue_text)).to.equal(Color.blue);
		expect(dec.startGameXMLToColor(green_text)).to.equal(Color.green);
		expect(dec.startGameXMLToColor(yellow_text)).to.equal(Color.yellow);
	});
});

describe('doMoveXMLToBoardDice test', () => { 
	it('should return a tuple of a board and array of dice', () => {
		let xml = '<board><start><pawn><color>yellow</color><id>3</id></pawn><pawn><color>yellow</color><id>2</id></pawn><pawn><color>yellow</color><id>1</id></pawn><pawn><color>yellow</color><id>0</id></pawn></start><main><piece-loc><pawn><color>red</color><id>3</id></pawn><loc>67</loc></piece-loc><piece-loc><pawn><color>red</color><id>2</id></pawn><loc>67</loc></piece-loc><piece-loc><pawn><color>green</color><id>1</id></pawn><loc>62</loc></piece-loc><piece-loc><pawn><color>red</color><id>1</id></pawn><loc>16</loc></piece-loc><piece-loc><pawn><color>blue</color><id>2</id></pawn><loc>8</loc></piece-loc><piece-loc><pawn><color>green</color><id>0</id></pawn><loc>5</loc></piece-loc><piece-loc><pawn><color>blue</color><id>1</id></pawn><loc>2</loc></piece-loc><piece-loc><pawn><color>red</color><id>0</id></pawn><loc>1</loc></piece-loc><piece-loc><pawn><color>blue</color><id>0</id></pawn><loc>0</loc></piece-loc></main><home-rows><piece-loc><pawn><color>green</color><id>2</id></pawn><loc>0</loc></piece-loc><piece-loc><pawn><color>blue</color><id>3</id></pawn><loc>2</loc></piece-loc></home-rows><home><pawn><color>green</color><id>3</id></pawn></home></board><dice><die>2</die><die>2</die><die>5</die><die>5</die></dice>'
		dec.doMoveXMLToBoardDice(xml);
	});
});

describe('nameFromXML', () => {
	it('should extract a name correctly', () => {
		let xml = "<name>sasha</name>";
		expect(dec.nameFromXML(xml)).to.equal("sasha");
	});
});

