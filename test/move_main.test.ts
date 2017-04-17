import { Parcheesi } from '../src/Parcheesi'
import { BasicPlayer } from '../src/BasicPlayer'
import { Board } from '../src/Board'
import { BaseSpot } from '../src/BaseSpot'
import { HomeRow } from '../src/HomeRow'
import { _Move } from '../src/_Move'
import { MoveEnter } from '../src/MoveEnter'
import { MoveMain } from '../src/MoveMain'
import { Pawn } from '../src/Pawn'
import { Color } from '../src/Color'
import { RulesChecker } from '../src/RulesChecker'
import * as c from '../src/Constants'
import * as _test from './testMethods'

import { expect } from 'chai';
import 'mocha';
import * as _ from 'lodash';

describe('Unit tests for main moves:', () => {
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

    it('should correctly identify pawn moved from invalid location', () => {
        let possible_moves: number[] = [3, 4, 3, 4];
        expect(checker.hasFive(possible_moves)).to.equal(false);
    });

		it('should correctly identify pawn moved from valid location', () => {
        let possible_moves: number[] = [3, 4, 3, 4];
        expect(checker.hasFive(possible_moves)).to.equal(false);
    });
});