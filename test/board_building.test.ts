import * as _ from 'lodash'
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

function checkHomeRows(hr_starts: HomeRowSpot[]) {2
    hr_starts.forEach(hrs => {
        expect(hrs.nPawns()).to.equal(0);
        while (hrs !instanceof HomeSpot)
            hrs = hrs.next(hrs.color) as HomeRowSpot;
    });
}

// TODO - no longer such a thing as building a board with variable numbers of players
describe('Filename: board_building.test.ts\n\nA board with no players', () => {
    let board = new Board();
    
    it('should have c.NUM_PLAYERS base spots', () => {
        _.range(c.NUM_PLAYERS).forEach(i => {
            expect(board.getBaseSpot(i)).to.be.instanceof(BaseSpot);
        });
    });

    it('should have the right length main ring', () => {
        expect(board.mainRing.length).to.equal(c.MAIN_RING_SIZE);
    });

    it('should have have as many home spots at the end of home rows as colors', () => {
        expect(board.getHomeSpots().length).to.equal(c.N_COLORS);
    })

    it('should not have any pawns in the main ring', () => {
        board.mainRing.forEach(mrs => {
            expect(mrs.pawns.filter(p => { return p != null }).length).to.equal(0);
        });
    })

    it('should not have any pawns in the home rows', () => {
        let hr_starts = board.getHomeRowStarts();
        checkHomeRows(hr_starts);
    });
});

describe('A board with one player', () => {    
    let players: PrettyDumbPlayer[];
    let board: Board;

    before(() => {
        let player1 = new PrettyDumbPlayer();
        player1.startGame(Color.green);
        
        players = [player1];
    });

    beforeEach(() => {
        board = new Board();
    });

    it('should have c.NUM_PLAYERS base spots', () => {
        _.range(c.NUM_PLAYERS).forEach(i => {
            expect(board.getBaseSpot(i)).to.be.instanceof(BaseSpot);
        });
    });

    it('should have a main ring of the right length', () => {
        expect(board.mainRing.length).to.equal(c.MAIN_RING_SIZE);
    });

    it('should have the same number of home rows as colors', () => {
        expect(board.getHomeSpots().length).to.equal(c.N_COLORS);
    })

    it('should not have any pawns in the home rows', () => {
        let hr_starts = board.getHomeRowStarts();
        checkHomeRows(hr_starts);
    });

    it('should have no pawns in the main ring', () => {
        board.mainRing.forEach(mrs => {
            expect(mrs.pawns.filter(p => { return p != null }).length).to.equal(0);
        });
    });

    it('should have a base with the same color as the player', () => {
        players.forEach(p => {
            expect(() => {board.getBaseSpot(p.color)}).to.not.throw(Error);
        });
    });

    it('should have the max number of pawns in the base', () => {
        let base_keys = Object.keys(board.bases)
        for (let i = 0; i < base_keys.length; i++) {
            let pawns = board.bases[base_keys[i]].pawns
            expect(pawns.filter(p => { return p != null }).length).to.equal(c.MAX_N_PAWNS_BASE);
        }
    });

    it('should have bases with color-appropriate entry points', () => {
        let base_keys = Object.keys(board.bases)
        for (let i = 0; i < base_keys.length; i++) {
            let base: BaseSpot = board.bases[base_keys[i]];
            let entry_ind = c.COLOR_HOME_AND_ENTRY[base.color]["ENTRY_FROM_BASE"];
            let entry_spot = board.mainRing[entry_ind];

            expect(base.next(base.color)).to.deep.equal(entry_spot);
        }
    });
});

describe('A board with four players', () => {
    let players: PrettyDumbPlayer[];
    let board: Board;

    before(() => {
        let player1 = new PrettyDumbPlayer();
        player1.startGame(Color.green);

        let player2 = new PrettyDumbPlayer();
        player2.startGame(Color.blue);

        let player3 = new PrettyDumbPlayer();
        player3.startGame(Color.red);

        let player4 = new PrettyDumbPlayer();
        player4.startGame(Color.yellow);
        
        players = [player1, player2, player3, player4];
    });

    beforeEach(() => {
        board = new Board();
    });

    it('should have c.NUM_PLAYERS base spots', () => {
        _.range(c.NUM_PLAYERS).forEach(i => {
            expect(board.getBaseSpot(i)).to.be.instanceof(BaseSpot);
        });
    });

    it('should have a main ring of the right length', () => {
        expect(board.mainRing.length).to.equal(c.MAIN_RING_SIZE);
    });

    it('should have the same number of home rows as colors', () => {
        expect(board.getHomeSpots().length).to.equal(c.N_COLORS);
    })

    it('should not have any pawns in the home rows', () => {
        let hr_starts = board.getHomeRowStarts();
        checkHomeRows(hr_starts);
    });

    it('should have no pawns in the main ring', () => {
        board.mainRing.forEach(mrs => {
            expect(mrs.pawns.filter(p => { return p != null }).length).to.equal(0);
        });
    });

    it('should have a base with the same color as each player', () => {
        players.forEach(p => {
            expect(() => {board.getBaseSpot(p.color)}).to.not.throw(Error);
        });
    });

    it('should have the max number of pawns in each base', () => {
        let base_keys = Object.keys(board.bases)
        for (let i = 0; i < base_keys.length; i++) {
            let pawns = board.bases[base_keys[i]].pawns
            expect(pawns.filter(p => { return p != null }).length).to.equal(c.MAX_N_PAWNS_BASE);
        }
    });

    it('should have bases with color-appropriate entry points', () => {
        let base_keys = Object.keys(board.bases)
        for (let i = 0; i < base_keys.length; i++) {
            let base: BaseSpot = board.bases[base_keys[i]];
            let entry_ind = c.COLOR_HOME_AND_ENTRY[base.color]["ENTRY_FROM_BASE"];
            let entry_spot = board.mainRing[entry_ind];

            expect(base.next(base.color)).to.deep.equal(entry_spot);
        }
    });
});
