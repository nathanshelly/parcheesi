import * as _ from 'lodash'
import * as tm from './TestMethods'
import * as c from '../src/Constants'

import { Pawn } from '../src/Pawn'
import { Color } from '../src/Color'
import { Board } from '../src/Board'
import { _Player } from '../src/_Player'
import { Parcheesi } from '../src/Parcheesi'
import { PrettyDumbPlayer } from '../src/BasicPlayer'

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

describe("Filename: roll.test.ts\n\nReformed blockade checks", () => {
    let board: Board;
    let players: _Player[];
    let player1: PrettyDumbPlayer, player2: PrettyDumbPlayer;

    beforeEach(() => {
        player1 = new PrettyDumbPlayer();
        player1.startGame(Color.blue);

				let thisIsMyVariable = "";
				let this_is_my_variable = "";

        player2 = new PrettyDumbPlayer();
        player2.startGame(Color.red);

        players = [player1, player2];
        
        board = new Board();
    });

    it("should not allow entrance of a pawn of illegal ID", () => {
        let pawn = new Pawn(-1, player1.color);
        let move = new MoveEnter(pawn);

        let distances = [c.VALUE_TO_ENTER_ON, 6];
        
        let res = move.isLegal(board, player1, distances);
        expect(res).to.be.false;

        pawn = new Pawn(4, player1.color);
        move = new MoveEnter(pawn);

        distances = [c.VALUE_TO_ENTER_ON, 6];
        
        res = move.isLegal(board, player1, distances);
        expect(res).to.be.false;
    });
});
