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

describe('Filename: moves.test.ts\n\nNon-move-specific cheating:', () => {
    let game: Parcheesi;
    let board: Board;
    let checker: RulesChecker = new RulesChecker();

    class WrongMoveCheater extends BasicPlayer {
        doMove(brd: Board, distances: number[]): _Move[] {
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
        doMove(brd: Board, distances: number[]): _Move[] {
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

        let distances = [5, 6];
        
        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.false;

        pawn = new Pawn(4, player1.color);
        move = new MoveEnter(pawn);

        distances = [5, 6];
        
        res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.false;
    });

    it("should not allow entrance of a pawn of the wrong color", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);

        let distances = [5, 6];
        
        let res = rc.legalMove(move, distances, player2, board, board.getBlockadesOfColor(player2.color));
        expect(res).to.be.false;
    });

    it("should allow an enter move of a pawn in the base, with no blockade, with a five", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);

        let distances = [5, 6];
        
        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });

    it("should not allow an enter move for a pawn outside the base", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);
        board.makeMove(move);

        let res = rc.legalMove(move, [5, 6], player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.false;
    });

    it("should not allow an enter move without a five, or numbers summing to five", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);
        
        let distances = [1, 2];
        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));

        expect(res).to.be.false;
    });

    it("should not allow an enter move if a blockade of our own exists on the entry spot", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);
        board.makeMove(move);

        pawn = new Pawn(1, player1.color);
        move = new MoveEnter(pawn);
        board.makeMove(move);

        let distances = [5, 6];
        
        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.false;
    });

    it("should not allow an enter move if a blockade of another player's exists on the entry spot", () => {
        let pawns: [Pawn, Pawn] = [new Pawn(0, player2.color), new Pawn(1, player2.color)];
        tm.placePawnsOnGivenColorEntrySpot(pawns, board, player1.color);

        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);

        let distances = [5, 6];

        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.false;
    });
});

describe("Legal enter moves:", () => {
    let rc: RulesChecker;
    let board: Board;
    let players: _Player[];
    let player1: PrettyDumbPlayer, player2: PrettyDumbPlayer;

    class PrettyDumbPlayer extends BasicPlayer {
        doMove(brd: Board, distances: number[]): _Move[] {
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

        let distances = [5, 6];
        
        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });

    it("should allow an enter move of a pawn in the base, with no blockade, with a combination of 1 and 4", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);

        let distances = [1, 4];

        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });

    it("should allow an enter move of a pawn in the base, with no blockade, with a combination of 2 and 3", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);

        let distances = [2, 3];

        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });

    it("should allow an enter move of a pawn in the base resulting in a bop of another player", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);

        let distances = [5, 6];

        let other_pawn = new Pawn(0, player2.color);
        tm.placePawnsAtOffsetFromYourEntry([other_pawn, null], board, c.ENTRY_OFFSET);

        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });

    it("should allow an enter move of a pawn in the base with one of the player's pawns on their entrance", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveEnter(pawn);
        board.makeMove(move);

        let distances = [5, 6];

        pawn = new Pawn(1, player1.color);
        move = new MoveEnter(pawn);

        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });
})

describe("Forward move cheats:", () => {
    let rc: RulesChecker;
    let board: Board;
    let players: _Player[];
    let player1: PrettyDumbPlayer, player2: PrettyDumbPlayer;

    class PrettyDumbPlayer extends BasicPlayer {
        doMove(brd: Board, distances: number[]): _Move[] {
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

        let distances = [5, 10];
        
        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.false;

        pawn = new Pawn(4, player1.color);
        move = new MoveForward(pawn, 5);

        distances = [5, 6];
        
        res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.false;
    });

    it("should not allow movement of a pawn of other than the player's color", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveForward(pawn, 5);

        let distances = [5, 6];
        
        let res = rc.legalMove(move, distances, player2, board, board.getBlockadesOfColor(player2.color));
        expect(res).to.be.false;
    });

    it("should not allow movement of a pawn zero or a negative distance", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveForward(pawn, 0);

        let distances = [5, 6];
        
        tm.placePawnsOnGivenColorEntrySpot([pawn, null], board, player1.color);
        let res = rc.legalMove(move, distances, player2, board, board.getBlockadesOfColor(player2.color));
        expect(res).to.be.false;

        move = new MoveForward(pawn, -5);
        res = rc.legalMove(move, distances, player2, board, board.getBlockadesOfColor(player2.color));
        expect(res).to.be.false;
    });
    
    it("should not allow movement of a pawn a distance greater than 20", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveForward(pawn, 21);

        let distances = [21, 6];
        tm.placePawnsOnGivenColorEntrySpot([pawn, null], board, player1.color);
        let res = rc.legalMove(move, distances, player2, board, board.getBlockadesOfColor(player2.color));
        expect(res).to.be.false;
    });

    it("should not allow movement of a pawn past the end of the home row", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveForward(pawn, 20);

        let distances = [20, 6];
        
        tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, 67);
        
        let res = rc.legalMove(move, distances, player2, board, board.getBlockadesOfColor(player2.color));
        expect(res).to.be.false;
    });

    it("should not allow movement of a pawn through a blockade of our own color", () => {
        let pawn = new Pawn(0, player1.color);
        
        let b_pawn0 = new Pawn(1, player1.color);
        let b_pawn1 = new Pawn(2, player1.color);
        tm.placePawnsAtOffsetFromYourEntry([b_pawn0, b_pawn1], board, 6);

        tm.placePawnsOnGivenColorEntrySpot([pawn, null], board, player1.color);

        let distances = [4, 6];
        let move = new MoveForward(pawn, 10);

        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.false;
    });

    it("should not allow movement of a pawn onto a spot blockaded by our own color", () => {
        let pawn = new Pawn(0, player1.color);
        
        let b_pawn0 = new Pawn(1, player1.color);
        let b_pawn1 = new Pawn(2, player1.color);
        tm.placePawnsAtOffsetFromYourEntry([b_pawn0, b_pawn1], board, 10);

        tm.placePawnsOnGivenColorEntrySpot([pawn, null], board, player1.color);

        let distances = [4, 6];
        let move = new MoveForward(pawn, 10);

        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.false;
    });

    it("should not allow movement of a pawn through a blockade of another player's", () => {
        let pawn = new Pawn(0, player1.color);
        
        let b_pawn0 = new Pawn(1, player2.color);
        let b_pawn1 = new Pawn(2, player2.color);
        tm.placePawnsAtOffsetFromYourEntry([b_pawn0, b_pawn1], board, 6);

        tm.placePawnsOnGivenColorEntrySpot([pawn, null], board, player1.color);

        let distances = [4, 6];
        let move = new MoveForward(pawn, 10);

        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.false;
    });

    it("should not allow movement of a pawn onto a spot blockaded by another player", () => {
        let pawn = new Pawn(0, player1.color);
        
        let b_pawn0 = new Pawn(1, player2.color);
        let b_pawn1 = new Pawn(2, player2.color);
        tm.placePawnsAtOffsetFromYourEntry([b_pawn0, b_pawn1], board, 10);

        tm.placePawnsOnGivenColorEntrySpot([pawn, null], board, player1.color);

        let distances = [4, 6];
        let move = new MoveForward(pawn, 10);

        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.false;
    });

    it("should not allow landing on a safety spot occupied by another player", () => {
        let pawn = new Pawn(0, player1.color);
        tm.placePawnsOnGivenColorEntrySpot([pawn, null], board, player1.color);

        let other_pawn = new Pawn(0, player2.color);
        tm.placePawnsAtOffsetFromYourEntry([other_pawn, null], board, 24);

        let distances = [1, 6];
        let move = new MoveForward(pawn, 7);

        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.false;
    });

    it("should not allow movement of a distance other than those possible with the distances", () => {
        let pawn = new Pawn(0, player1.color);
        tm.placePawnsOnGivenColorEntrySpot([pawn, null], board, player1.color);

        let distances = [3, 4];
        let move = new MoveForward(pawn, 1);

        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.false;

        move = new MoveForward(pawn, 6);

        res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.false;

        distances = [3, 4, 10]
        
        move = new MoveForward(pawn, 6);

        res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.false;

        move = new MoveForward(pawn, 12);

        res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.false;
    });
});

describe("Legal forward moves:", () => {
    let rc: RulesChecker;
    let board: Board;
    let players: _Player[];
    let player1: PrettyDumbPlayer, player2: PrettyDumbPlayer;

    class PrettyDumbPlayer extends BasicPlayer {
        doMove(brd: Board, distances: number[]): _Move[] {
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
    
    it("should allow movement from entry spot to a valid main ring spot", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveForward(pawn, 6);

        let distances = [5, 6];

        tm.placePawnsOnGivenColorEntrySpot([pawn, null], board, player1.color);
        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });

    it("should allow movement from a main ring spot with one pawn to a valid main ring spot", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveForward(pawn, 4);

        let distances = [4, 6];

        tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, 4);
        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });

    it("should allow movement from a spot on the main ring to a valid spot in the player's home row", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveForward(pawn, 6);

        let distances = [5, 6];

        tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, 65);
        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });

    it("should allow movement from a spot on a player's home row to another valid spot on their home row", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveForward(pawn, 2);

        let distances = [5, 2];

        tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, 71);
        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });

    it("should allow movement onto the home spot, with exactly the right distance, from the home row", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveForward(pawn, 4);

        let distances = [5, 4];

        tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, 67);
        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });

    it("should allow movement onto the home spot, with exactly the right distance, from the main ring", () => {
        let pawn = new Pawn(0, player1.color);
        let move = new MoveForward(pawn, 10);

        let distances = [5, 10];

        tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, 62);
        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });

    it("should allow a valid bop", () => {
        let pawn = new Pawn(0, player1.color);
        let opposing_pawn = new Pawn(0, player2.color);
        let move = new MoveForward(pawn, 3);

        let distances = [5, 3];

        tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, 5);
        tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, 8);

        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });

    it("should allow a pawn to form a blockade", () => {
        let pawn = new Pawn(0, player1.color);
        let pawn_on_same_team = new Pawn(1, player1.color);
        let move = new MoveForward(pawn, 3);

        let distances = [5, 3];

        tm.placePawnsAtOffsetFromYourEntry([pawn, null], board, 5);
        tm.placePawnsAtOffsetFromYourEntry([pawn_on_same_team, null], board, 8);

        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });

    it("should allow a pawn in a blockade to move out of the blockade", () => {
        let pawn = new Pawn(0, player1.color);
        let pawn_in_blockade = new Pawn(1, player1.color);
        let move = new MoveForward(pawn, 3);

        let distances = [5, 3];

        tm.placePawnsAtOffsetFromYourEntry([pawn, pawn_in_blockade], board, 5);

        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });

    it("should allow a pawn in a blockade to form a blockade with a different pawn, in the same roll", () => {
        let pawn = new Pawn(0, player1.color);
        let pawn_in_old_blockade = new Pawn(1, player1.color);
        let pawn_in_new_blockade = new Pawn(2, player1.color);
        let move = new MoveForward(pawn, 3);

        let distances = [5, 3];

        tm.placePawnsAtOffsetFromYourEntry([pawn, pawn_in_old_blockade], board, 5);
        tm.placePawnsAtOffsetFromYourEntry([pawn_in_new_blockade, null], board, 8);

        let res = rc.legalMove(move, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });

    it("should allow both pawns in a blockade to move, if not creating a new blockade", () => {
        let pawn_one = new Pawn(0, player1.color);
        let pawn_two = new Pawn(1, player1.color);
        let move_one = new MoveForward(pawn_one, 3);
        let move_two = new MoveForward(pawn_two, 5);

        let distances = [5, 3];

        tm.placePawnsAtOffsetFromYourEntry([pawn_one, pawn_two], board, 5);

        let res = rc.legalMove(move_one, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.true;

        res = rc.legalMove(move_two, distances, player1, board, board.getBlockadesOfColor(player1.color));
        expect(res).to.be.true;
    });
});
