import { RulesChecker } from '../src/RulesChecker'
import { BasicPlayer } from '../src/BasicPlayer'
import { Board } from '../src/Board'
import { _Move } from '../src/_Move'
import { MoveMain } from '../src/MoveMain'
import { MoveEnter } from '../src/MoveEnter'
import { Pawn } from '../src/Pawn'
import { Color } from '../src/Color'
import * as c from '../src/Constants'

import { expect } from 'chai';
import 'mocha';
import * as _ from 'lodash';

describe('Non-move-specific cheating:', () => {
    let rc: RulesChecker = new RulesChecker();
    let board: Board;

    it('moving a pawn of the wrong color should fail', () => {
        class WrongMoveCheater extends BasicPlayer {
            doMove(brd: Board, dice: number[]): _Move[] {
                let move1 = new MoveMain(new Pawn(0, Color.Blue), 0, 10);
                return [move1];
            }
        }

        let player = new WrongMoveCheater()
        player.startGame(Color.Green);
        let board = new Board([player]);

        
    })
})