import * as _ from 'lodash'
import * as c from '../src/Constants'

import { Pawn } from '../src/Pawn'
import { Color } from '../src/Color'
import { Board } from '../src/Board'
import { _Player } from '../src/_Player'
import { Parcheesi } from '../src/Parcheesi'
import { BasicPlayer } from '../src/BasicPlayer'
import { RulesChecker } from '../src/RulesChecker'

import { _Move } from '../src/_Move'
import { MoveEnter } from '../src/MoveEnter'
import { MoveForward } from '../src/MoveForward'

import { _Spot } from '../src/_Spot'
import { BaseSpot } from '../src/BaseSpot'
import { HomeSpot } from '../src/HomeSpot'
import { HomeRowSpot } from '../src/HomeRowSpot'
import { MainRingSpot } from '../src/MainRingSpot'

import { expect } from 'chai';
import 'mocha';



describe('Filename: move_foward_unit.test.ts\n\nUnit tests for main moves:', () => {
    let game: Parcheesi;
    let checker: RulesChecker = new RulesChecker();

    class PrettyDumbPlayer extends BasicPlayer {
        doMove(brd: Board, dice: [number, number]): [_Move, _Move] {
            throw new Error('Method not implemented - not needed in testing board instantiaton.');
        }
    }

		beforeEach(() => {
			game = new Parcheesi();
			let player1 = new PrettyDumbPlayer();
			player1.startGame(Color.Green);
			game.register(player1)
			game.start();
    });

    // it('should correctly identify pawn moved from invalid location', () => {
    //     let possible_moves: number[] = [3, 4, 3, 4];
    //     expect(checker.hasFive(possible_moves)).to.equal(false);
    // });

	// 	it('should correctly identify pawn moved from valid location', () => {
    //     let possible_moves: number[] = [3, 4, 3, 4];
    //     expect(checker.hasFive(possible_moves)).to.equal(false);
    // });
});