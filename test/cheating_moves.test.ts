import * as _ from 'lodash'
import * as tm from './testMethods'
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

describe('Filename: cheating_moves.test.ts\n\nNon-move-specific cheating:', () => {
    let game: Parcheesi;
    let board: Board;
    let checker: RulesChecker = new RulesChecker();

    class WrongMoveCheater extends BasicPlayer {
        doMove(brd: Board, dice: number[]): _Move[] {
            let move1 = new MoveForward(new Pawn(0, Color.Blue), 10);
            return [move1];
        }
    }

    beforeEach(() => {
        game = new Parcheesi();
        let player1 = new WrongMoveCheater();
        player1.startGame(Color.Green);
        game.register(player1)
        game.start();
    });

    it('moving a pawn of the wrong color should fail', () => {
        let pawn = new Pawn(1, Color.Blue);
        expect(checker.pawnIsWrongColor(pawn, Color.Red)).to.equal(true);
    })

    it('moving a pawn of the right color should succeed', () => {
        let pawn = new Pawn(1, Color.Blue);
        expect(checker.pawnIsWrongColor(pawn, Color.Blue)).to.equal(false);
    })

    it('moving a pawn of legal id should succeed', () => {
        let pawn = new Pawn(3, Color.Blue);
        expect(checker.pawnIdOutsideLegalRange(pawn)).to.equal(false);
    })

    it('moving a pawn of illegal id should fail', () => {
        let pawn = new Pawn(4, Color.Blue);
        expect(checker.pawnIdOutsideLegalRange(pawn)).to.equal(true);
    })

    // come back to this when makeAllLegalMoves is implemented
    // it('leaving valid moves unused should fail', () => {
    // })

    // it('leaving no valid moves unused should succeed', () => {
    // })
})

describe("Enter move cheats", () => {
    let rc: RulesChecker;
    let board: Board;
    let players: _Player[];
    let player1: PrettyDumbPlayer, player2: PrettyDumbPlayer;

    class PrettyDumbPlayer extends BasicPlayer {
        doMove(brd: Board, dice: [number, number]): [_Move, _Move] {
            throw new Error('Method not implemented - not needed when manually building moves.');
        }
    }

    before(() => {
        rc = new RulesChecker();
    });

    beforeEach(() => {
        player1 = new PrettyDumbPlayer();
        player1.startGame(Color.Blue);

        player2 = new PrettyDumbPlayer();
        player2.startGame(Color.Red);

        players = [player1, player2];
        
        board = new Board(players);
    });

    it("should not allow entrance of a pawn of illegal ID", () => {
        let pawn = new Pawn(-1, player1.color);
        let move = new MoveEnter(pawn);

        let dice = [5, 6];
        
        let res = rc.legalMove(move, dice, player1, board, board.findBlockadesOfColor(player1.color));
        expect(res).to.be.false;

        pawn = new Pawn(4, player1.color);
        move = new MoveEnter(pawn);

        dice = [5, 6];
        
        res = rc.legalMove(move, dice, player1, board, board.findBlockadesOfColor(player1.color));
        expect(res).to.be.false;
    });

    it("should not allow entrance of a pawn of the wrong color", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);

        let dice = [5, 6];
        
        let res = rc.legalMove(move, dice, player2, board, board.findBlockadesOfColor(player2.color));
        expect(res).to.be.false;
    });

    it("should allow an enter move of a pawn in the base, with no blockade, with a five", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);

        let dice = [5, 6];
        
        let res = rc.legalMove(move, dice, player1, board, board.findBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });

    it("should not allow an enter move for a pawn outside the base", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);
        board.makeMove(move);

        let res = rc.legalMove(move, [5, 6], player1, board, board.findBlockadesOfColor(player1.color));
        expect(res).to.be.false;
    });

    it("should not allow an enter move without a five, or numbers summing to five", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);
        
        let dice = [1, 2];
        let res = rc.legalMove(move, dice, player1, board, board.findBlockadesOfColor(player1.color));

        expect(res).to.be.false;
    });

    it("should not allow an enter move if a blockade of our own exists on the entry spot", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);
        board.makeMove(move);

        pawn = new Pawn(1, player1.color);
        move = new MoveEnter(pawn);
        board.makeMove(move);

        let dice = [5, 6];
        
        let res = rc.legalMove(move, dice, player1, board, board.findBlockadesOfColor(player1.color));
        expect(res).to.be.false;
    });

    it("should not allow an enter move if a blockade of another player's exists on the entry spot", () => {
        let pawns: [Pawn, Pawn] = [new Pawn(0, player2.color), new Pawn(1, player2.color)];
        tm.placePawnsOnEntrySpot(pawns, board, player1.color);

        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);

        let dice = [5, 6];

        let res = rc.legalMove(move, dice, player1, board, board.findBlockadesOfColor(player1.color));
        expect(res).to.be.false;
    });
});

describe("Legal enter moves:", () => {
    let rc: RulesChecker;
    let board: Board;
    let players: _Player[];
    let player1: PrettyDumbPlayer, player2: PrettyDumbPlayer;

    class PrettyDumbPlayer extends BasicPlayer {
        doMove(brd: Board, dice: [number, number]): [_Move, _Move] {
            throw new Error('Method not implemented - not needed when manually building moves.');
        }
    }

    before(() => {
        rc = new RulesChecker();
    });

    beforeEach(() => {
        player1 = new PrettyDumbPlayer();
        player1.startGame(Color.Blue);

        player2 = new PrettyDumbPlayer();
        player2.startGame(Color.Red);

        players = [player1, player2];
        
        board = new Board(players);
    });

    it("should allow an enter move of a pawn in the base, with no blockade, with a five", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);

        let dice = [5, 6];
        
        let res = rc.legalMove(move, dice, player1, board, board.findBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });

    it("should allow an enter move of a pawn in the base, with no blockade, with a combination of 1 and 4", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);

        let dice = [1, 4];

        let res = rc.legalMove(move, dice, player1, board, board.findBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });

    it("should allow an enter move of a pawn in the base, with no blockade, with a combination of 2 and 3", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);

        let dice = [2, 3];

        let res = rc.legalMove(move, dice, player1, board, board.findBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });

    it("should allow an enter move of a pawn in the base resulting in a bop of another player", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);

        let dice = [5, 6];

        let other_pawn = new Pawn(0, player2.color);
        tm.placePawnsAtOffsetFromEntry([other_pawn, null], board, player2.color, c.ENTRY_OFFSET);

        let res = rc.legalMove(move, dice, player1, board, board.findBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });

    it("should allow an enter move of a pawn in the base with one of the player's pawns on their entrance", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);
        board.makeMove(move);

        let dice = [5, 6];

        pawn = new Pawn(1, player1.color);
        move = new MoveEnter(pawn);

        let res = rc.legalMove(move, dice, player1, board, board.findBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });
})

describe("Forward move cheats:", () => {
    let rc: RulesChecker;
    let board: Board;
    let players: _Player[];
    let player1: PrettyDumbPlayer, player2: PrettyDumbPlayer;

    class PrettyDumbPlayer extends BasicPlayer {
        doMove(brd: Board, dice: [number, number]): [_Move, _Move] {
            throw new Error('Method not implemented - not needed when manually building moves.');
        }
    }

    before(() => {
        rc = new RulesChecker();
    });

    beforeEach(() => {
        player1 = new PrettyDumbPlayer();
        player1.startGame(Color.Blue);

        player2 = new PrettyDumbPlayer();
        player2.startGame(Color.Red);

        players = [player1, player2];
        
        board = new Board(players);
    });

    it("should not allow movement of a pawn of illegal ID", () => {
        let pawn = new Pawn(-1, player1.color);
        let move = new MoveForward(pawn, 10);

        let dice = [5, 10];
        
        let res = rc.legalMove(move, dice, player1, board, board.findBlockadesOfColor(player1.color));
        expect(res).to.be.false;

        pawn = new Pawn(4, player1.color);
        move = new MoveForward(pawn, 5);

        dice = [5, 6];
        
        res = rc.legalMove(move, dice, player1, board, board.findBlockadesOfColor(player1.color));
        expect(res).to.be.false;
    });

    it("should not allow movement of a pawn of other than the player's color", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveForward(pawn, 5);

        let dice = [5, 6];
        
        let res = rc.legalMove(move, dice, player2, board, board.findBlockadesOfColor(player2.color));
        expect(res).to.be.false;
    });

    it("should not allow movement of a pawn zero or a negative distance", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveForward(pawn, 0);

        let dice = [5, 6];
        
        tm.placePawnsOnEntrySpot([pawn, null], board, player1.color);
        let res = rc.legalMove(move, dice, player2, board, board.findBlockadesOfColor(player2.color));
        expect(res).to.be.false;

        move = new MoveForward(pawn, -5);
        res = rc.legalMove(move, dice, player2, board, board.findBlockadesOfColor(player2.color));
        expect(res).to.be.false;
    });
    
    it("should not allow movement of a pawn a distance greater than 20", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveForward(pawn, 21);

        let dice = [21, 6];
        tm.placePawnsOnEntrySpot([pawn, null], board, player1.color);
        let res = rc.legalMove(move, dice, player2, board, board.findBlockadesOfColor(player2.color));
        expect(res).to.be.false;
    });

    it("should not allow movement of a pawn past the end of the home row", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveForward(pawn, 20);

        let dice = [20, 6];
        
        tm.placePawnsAtOffsetFromEntry([pawn, null], board, player1.color, 67);
        
        let res = rc.legalMove(move, dice, player2, board, board.findBlockadesOfColor(player2.color));
        expect(res).to.be.false;
    });

    it("should not allow movement of a pawn through a blockade of our own color", () => {
        expect(0).to.equal(1);
    });

    it("should not allow movement of a pawn onto a spot blockaded by our own color", () => {
        expect(0).to.equal(1);
    });

    it("should not allow movement of a pawn through a blockade of another player's", () => {
        expect(0).to.equal(1);
    });

    it("should not allow movement of a pawn onto a spot blockaded by another player", () => {
        expect(0).to.equal(1);
    });

    it("should not allow movement of a blockade together in the same roll", () => {
        expect(0).to.equal(1);
    });

    it("should not allow landing on an occupied safety spot", () => {
        expect(0).to.equal(1);
    });

    it("should not allow movement of a distance other than those on the dice, with no bonuses", () => {
        expect(0).to.equal(1);
    });
});

describe("Legal forward moves:", () => {
    let rc: RulesChecker;
    let board: Board;
    let players: _Player[];
    let player1: PrettyDumbPlayer, player2: PrettyDumbPlayer;

    class PrettyDumbPlayer extends BasicPlayer {
        doMove(brd: Board, dice: [number, number]): [_Move, _Move] {
            throw new Error('Method not implemented - not needed when manually building moves.');
        }
    }

    before(() => {
        rc = new RulesChecker();
    });

    beforeEach(() => {
        player1 = new PrettyDumbPlayer();
        player1.startGame(Color.Blue);

        player2 = new PrettyDumbPlayer();
        player2.startGame(Color.Red);

        players = [player1, player2];
        
        board = new Board(players);
    });
    
    it("should allow movement from a main ring spot with one pawn to a valid main ring spot", () => {
        expect(0).to.equal(1);
    });

    it("should allow movement from a spot on the main ring to a valid spot in the player's home row", () => {
        expect(0).to.equal(1);
    });

    it("should allow movement from a spot on a player's home row to another valid spot on their home row", () => {
        expect(0).to.equal(1);
    });

    it("should allow movement onto the home spot, with exactly the right distance, from the home row", () => {
        expect(0).to.equal(1);
    });

    it("should allow movement onto the home spot, with exactly the right distance, from the main ring", () => {
        expect(0).to.equal(1);
    });

    it("should allow a valid bop", () => {
        expect(0).to.equal(1);
    });

    it("should allow a pawn in a blockade to form a blockade with a different pawn, in the same roll", () => {
        expect(0).to.equal(1);
    });

    it("should allow a pawn in a blockade to move out of the blockade", () => {
        expect(0).to.equal(1);
    });

    it("should allow both pawns in a blockade to move, if not creating a new blockade", () => {
        expect(0).to.equal(1);
    });
});
