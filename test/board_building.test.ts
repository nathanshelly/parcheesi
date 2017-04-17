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

    it('should have no bases', () => {
        expect(Object.keys(board.bases).length).to.equal(0);
    });

    it('should have the right length main ring', () => {
        expect(board.mainRing.length).to.equal(c.MAIN_RING_SIZE);
    });

    it('should have have as many main ring spots with home rows as colors', () => {
        expect(board.mainRing.filter(s => { return s.home_row != null }).length).to.equal(c.N_COLORS);
    })

    it('should not have any pawns in the main ring', () => {
        board.mainRing.forEach(mrs => {
            expect(mrs.pawns.filter(p => { return p != null }).length).to.equal(0);
        });
    })

    it('should not have any pawns in the home rows', () => {
        Object.keys(c.HOME_ROW_COLORS).forEach(pos => {
            let hr = board.mainRing[parseInt(pos)].home_row as HomeRow;
            hr.row.forEach(hrs => {
                expect(hrs.pawns.filter(p => { return p != null }).length).to.equal(0);
            })
            expect(hr.spot.pawns.filter(p => { return p != null }).length).to.equal(0);
        });
    });
});

describe('A board with one player', () => {
    class ReallyDumbPlayer extends BasicPlayer {
        doMove(brd: Board, dice: [number, number]): [_Move, _Move] {
            throw new Error('Method not implemented - not needed in testing board instantiaton.');
        }
    }
    let players: ReallyDumbPlayer[];
    let board: Board;

    before(() => {
        let player1 = new ReallyDumbPlayer();
        player1.startGame(Color.Green);
        
        players = [player1];
    });

    beforeEach(() => {
        board = new Board(players);
    });

    it('should have one base', () => {
        expect(Object.keys(board.bases).length).to.equal(1);
    });

    it('should have a main ring of the right length', () => {
        expect(board.mainRing.length).to.equal(c.MAIN_RING_SIZE);
    });

    it('should have the same number of home rows as colors', () => {
        expect(board.mainRing.filter(s => { return s.home_row != null }).length).to.equal(c.N_COLORS);
    })

    it('should have no pawns in the home rows', () => {
        Object.keys(c.HOME_ROW_COLORS).forEach(pos => {
            let hr = board.mainRing[parseInt(pos)].home_row as HomeRow;
            hr.row.forEach(hrs => {
                expect(hrs.pawns.filter(p => { return p != null }).length).to.equal(0);
            })
            expect(hr.spot.pawns.filter(p => { return p != null }).length).to.equal(0);
        });
    });

    it('should have no pawns in the main ring', () => {
        board.mainRing.forEach(mrs => {
            expect(mrs.pawns.filter(p => { return p != null }).length).to.equal(0);
        });
    });

    it('should have a base with the same color as the player', () => {
        for (let i = 0; i < Object.keys(board.bases).length; i++) {
            let base_color = board.bases[players[0].color].color
            expect(base_color).to.equal(players[i].color);
        }
    });

    it('should have four pawns in the base', () => {
        let base_keys = Object.keys(board.bases)
        for (let i = 0; i < base_keys.length; i++) {
            let pawns = board.bases[base_keys[i]].pawns
            expect(pawns.filter(p => { return p != null }).length).to.equal(c.MAX_N_PAWNS_BASE);
        }
    });

    it('should have bases with color-appropriate entry points', () => {
        let base_keys = Object.keys(board.bases)
        for (let i = 0; i < base_keys.length; i++) {
            let base = board.bases[base_keys[i]];
            expect(base.entryPoint).to.equal(c.ENTRY_POINTS[base.color])
        }
    });
});

describe('A board with four players', () => {
    class ReallyDumbPlayer extends BasicPlayer {
        doMove(brd: Board, dice: [number, number]): [_Move, _Move] {
            throw new Error('Method not implemented - not needed in testing board instantiaton.');
        }
    }
    let players: ReallyDumbPlayer[];
    let board: Board;

    before(() => {
        let player1 = new ReallyDumbPlayer();
        player1.startGame(Color.Green);

        let player2 = new ReallyDumbPlayer();
        player1.startGame(Color.Blue);

        let player3 = new ReallyDumbPlayer();
        player1.startGame(Color.Red);

        let player4 = new ReallyDumbPlayer();
        player1.startGame(Color.Yellow);
        
        players = [player1, player2, player3, player4];
    });

    beforeEach(() => {
        board = new Board(players);
    });

    it('should have 4 bases', () => {
        expect(Object.keys(board.bases).length).to.equal(4);
    });

    it('should have a main ring of the right length', () => {
        expect(board.mainRing.length).to.equal(c.MAIN_RING_SIZE);
    });

    it('should have the same number of home rows as colors', () => {
        expect(board.mainRing.filter(s => { return s.home_row != null }).length).to.equal(c.N_COLORS);
    })

    it('should have no pawns in the home rows', () => {
        Object.keys(c.HOME_ROW_COLORS).forEach(pos => {
            let hr = board.mainRing[parseInt(pos)].home_row as HomeRow;
            hr.row.forEach(hrs => {
                expect(hrs.pawns.filter(p => { return p != null }).length).to.equal(0);
            })
            expect(hr.spot.pawns.filter(p => { return p != null }).length).to.equal(0);
        });
    });

    it('should have no pawns in the main ring', () => {
        board.mainRing.forEach(mrs => {
            expect(mrs.pawns.filter(p => { return p != null }).length).to.equal(0);
        });
    });

    it('should have a base with the same color as each player', () => {
        for (let i = 0; i < Object.keys(board.bases).length; i++) {
            let base_color = board.bases[players[0].color].color;
            expect(base_color).to.equal(players[0].color);
        }
    });

    it('should have four pawns in each base', () => {
        let base_keys = Object.keys(board.bases)
        for (let i = 0; i < base_keys.length; i++) {
            let pawns = board.bases[base_keys[i]].pawns
            expect(pawns.filter(p => { return p != null }).length).to.equal(c.MAX_N_PAWNS_BASE);
        }
    });

    it('should have bases with color-appropriate entry points', () => {
        let base_keys = Object.keys(board.bases)
        for (let i = 0; i < base_keys.length; i++) {
            let base = board.bases[base_keys[i]];
            expect(base.entryPoint).to.equal(c.ENTRY_POINTS[base.color])
        }
    });
});