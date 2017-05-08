import * as _ from 'lodash'
import * as d from '../src/Distances'
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

describe('Filename: n_player.test.ts\n\ndoublesPenaltyToPlayer tests', () => {
	let player: _Player;
	let n_player: Ethernet;
	
	beforeEach(() => {
		player = new PrettyDumbPlayer();
		n_player = new Ethernet(player);
	});

	it('should return void on doublesPenalty', () => {
		expect(n_player.doublesPenaltyToPlayer()).to.equal('<void></void>');
	}); 
});

describe('startGameForPlayer tests', () => {
	let player: _Player;
	let n_player: Ethernet;
	
	beforeEach(() => {
		player = new PrettyDumbPlayer();
		n_player = new Ethernet(player);
	});

	// it('should return void on doublesPenalty', () => {
	// 	expect(n_player.startGameForPlayer(Color.blue)).to.equal(c.TEST_NAME);
	// }); 
});

describe('startGameForPlayer tests', () => {
	let player: _Player;
	let n_player: Ethernet;
	
	beforeEach(() => {
		player = new PrettyDumbPlayer();
		n_player = new Ethernet(player);
	});

	// it('should return void on doublesPenalty', () => {
	// 	expect(n_player.startGameForPlayer(Color.blue)).to.equal(c.TEST_NAME);
	// }); 
});
