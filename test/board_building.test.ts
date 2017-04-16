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
import * as c from '../src/Constants'

import { expect } from 'chai';
import 'mocha';
import * as _ from 'lodash';

describe('A board with no players', () => {
    let board = new Board([]);

    it('should have the right length main ring', () => {
        expect(board.mainRing.length).to.equal(c.MAIN_RING_SIZE);
    });

    it('should have have as many main ring spots with home rows as colors', () => {
        expect(board.mainRing.filter(s => {return s.home_row != null}).length).to.equal(c.N_COLORS);
    })

    it('should not have any pawns in the main ring', () => {
        board.mainRing.forEach(mrs => {
            expect(mrs.pawns.filter(p => { return p != null }).length).to.equal(0);
        });
    })

    it('should not have any pawns in the home rows', () => {
        Object.keys(c.HOME_ROW_COLORS).forEach(pos => {
            let hr = board.mainRing[parseInt(pos)].home_row as HomeRow;
            hr.home_row.forEach(hrs => {
                expect(hrs.pawns.filter(p => { return p != null }).length).to.equal(0);
            })
            expect(hr.home_spot.pawns.filter(p => { return p != null }).length).to.equal(0);
        });
    });
});

describe('A board with players', () => {
    class ReallyDumbPlayer extends BasicPlayer {
        doMove(brd: Board, dice: [number, number]): [_Move, _Move] {
            throw new Error('Method not implemented - not needed in testing board instantiaton.');
        }
    }

    let player1 = new ReallyDumbPlayer();
    player1.startGame(Color.Green);

    let player2 = new ReallyDumbPlayer();
    player2.startGame(Color.Red);

    let player3 = new ReallyDumbPlayer();
    player3.startGame(Color.Blue);

    let player4 = new ReallyDumbPlayer();
    player4.startGame(Color.Yellow);

    let players = [player1, player2, player3, player4];

    it('should instantiate correctly with one player.', () => {
        let board = new Board(players.slice(0, 1));
        validateBoardInstantiaton(board, 1);
    });

    it('should instantiate correctly with two players.', () => {
        let board = new Board(players.slice(0, 2));
        validateBoardInstantiaton(board, 2);
    });

    it('should instantiate correctly with three players.', () => {
        let board = new Board(players.slice(0, 3));
        validateBoardInstantiaton(board, 3);
    });

    it('should instantiate correctly with four players.', () => {
        let board = new Board(players.slice(0, 4));
        validateBoardInstantiaton(board, 4);
    });     

    function validateBoardInstantiaton(board: Board, n_players: number) {
        expect(board.bases.length).to.equal(n_players);

        // No pawns on the board ANYWHERE...
        expect(board.mainRing.length).to.equal(c.MAIN_RING_SIZE);
        expect(board.mainRing.filter(s => { return s.home_row != null }).length).to.equal(c.N_COLORS);
        Object.keys(c.HOME_ROW_COLORS).forEach(pos => {
            let hr = board.mainRing[parseInt(pos)].home_row as HomeRow;
            hr.home_row.forEach(hrs => {
                expect(hrs.pawns.filter(p => { return p != null }).length).to.equal(0);
            })
            expect(hr.home_spot.pawns.filter(p => { return p != null }).length).to.equal(0);
        });
        board.mainRing.forEach(mrs => {
            expect(mrs.pawns.filter(p => { return p != null }).length).to.equal(0);
        });

        // ...except in the bases.
        for (let i = 0; i < board.bases.length; i++) {
            expect(board.bases[i].color).to.equal(players[i].color);
            expect(board.bases[i].pawns.filter(p => { return p != null }).length).to.equal(c.MAX_N_PAWNS_BASE);
            expect(board.bases[i].entryPoint).to.equal(c.ENTRY_POINTS[board.bases[i].color])
        }
    }
});