import { expect } from 'chai';
import 'mocha';

import { LastPawnMover } from '../src/LastPawnMover';
import { Board } from '../src/Board';
import { Color } from '../src/Color';
import { MoveEnter } from '../src/MoveEnter';
import { MoveForward } from '../src/MoveForward';
import * as tm from './TestMethods';
import * as c from '../src/Constants';

describe("Last pawn movers", () => {
  let mover: LastPawnMover;
  let dummy: LastPawnMover;
  let board: Board;

  before(() => {
    mover = new LastPawnMover();
    mover.startGame(Color.blue);

    dummy = new LastPawnMover();
    dummy.startGame(Color.red);
  });

  beforeEach(() => {
    board = new Board();
  });

  it("should conclude on an enter move for a pawn in the base", () => {
    let pawns = board.getPawnsOfColor(mover.color);

    let dice = [c.VALUE_TO_ENTER_ON, 6];

    let move = mover.moveForPawn(dice, pawns[0], board);

    expect(move).to.not.be.null;
    expect(move).to.be.an.instanceOf(MoveEnter);
    expect((move as MoveEnter).pawn).to.deep.equal(pawns[0]);
  });

  it("should conclude on a forward move for a pawn outside", () => {
    let pawns = board.getPawnsOfColor(mover.color);
    
    tm.placePawnsAtOffsetFromYourEntry([pawns[0], null], board, 6);

    let dice = [c.VALUE_TO_ENTER_ON, 6];

    let move = mover.moveForPawn(dice, pawns[0], board);

    expect(move).to.not.be.null;
    expect(move).to.be.an.instanceOf(MoveForward);
    expect((move as MoveForward).distance).to.equal(c.VALUE_TO_ENTER_ON);
    expect((move as MoveForward).pawn).to.deep.equal(pawns[0]);
  });

  it("should conclude on two enter moves when all pawns are inside", () => {
    let pawns = board.getPawnsOfColor(mover.color);

    let dice = [c.VALUE_TO_ENTER_ON, c.VALUE_TO_ENTER_ON];

    let moves = mover.doMove(board, dice)

    expect(moves.length).to.equal(2);
    moves.forEach(m => { expect(m).to.be.an.instanceOf(MoveEnter) })
    
    let move1 = moves[0];
    let move2 = moves[1];

    expect((move1 as MoveEnter).pawn).to.deep.equal(pawns[0]);
    expect((move2 as MoveEnter).pawn).to.deep.equal(pawns[1]);
  });

  it("should conclude on an enter move and a forward move when all pawns are inside but only one enter is permitted", () => {
    let pawns = board.getPawnsOfColor(mover.color);

    let dice = [c.VALUE_TO_ENTER_ON, 6];

    let moves = mover.doMove(board, dice)

    expect(moves.length).to.equal(2);
    
    let move1 = moves[0];
    let move2 = moves[1];

    expect(move1).to.be.an.instanceOf(MoveEnter);
    expect(move2).to.be.an.instanceOf(MoveForward);

    expect((move2 as MoveForward).distance).to.equal(6);

    expect((move1 as MoveEnter).pawn).to.deep.equal(pawns[0]);
    expect((move2 as MoveForward).pawn).to.deep.equal(pawns[0]);
  });

  it("should conclude on an enter move and a move forward when one pawn is already on the enter spot", () => {
    let pawns = board.getPawnsOfColor(mover.color);

    let dice = [c.VALUE_TO_ENTER_ON, c.VALUE_TO_ENTER_ON];

    tm.placePawnsOnGivenColorEntrySpot([pawns[0], null], board, mover.color);

    let moves = mover.doMove(board, dice);

    expect(moves.length).to.equal(2);
    
    let move1 = moves[0];
    let move2 = moves[1];

    expect(move1).to.be.an.instanceOf(MoveEnter);
    expect(move2).to.be.an.instanceOf(MoveForward);

    expect((move2 as MoveForward).distance).to.equal(c.VALUE_TO_ENTER_ON);

    expect((move1 as MoveEnter).pawn).to.deep.equal(pawns[1]);
    expect((move2 as MoveForward).pawn).to.deep.equal(pawns[0]);
  });

  it("should conclude on two forward moves with one pawn outside, both moving that pawn, when no enters would be permitted", () => {
    let pawns = board.getPawnsOfColor(mover.color);

    tm.placePawnsAtOffsetFromYourEntry([pawns[0], null], board, 6);

    let dice = [4, 6];

    let moves = mover.doMove(board, dice)

    expect(moves.length).to.equal(2);
    moves.forEach(m => { expect(m).to.be.an.instanceOf(MoveForward) });
    
    let move1 = moves[0];
    let move2 = moves[1];

    expect((move1 as MoveForward).distance).to.equal(4);
    expect((move2 as MoveForward).distance).to.equal(6);

    expect((move1 as MoveForward).pawn).to.deep.equal(pawns[0]);
    expect((move2 as MoveForward).pawn).to.deep.equal(pawns[0]);
	});

	it("should conclude on an enter and a forward move with one pawn outside, both moving a pawn from the base, when one enter is permitted", () => {
		let pawns = board.getPawnsOfColor(mover.color);

    tm.placePawnsAtOffsetFromYourEntry([pawns[0], null], board, 10);

    let dice = [c.VALUE_TO_ENTER_ON, 6];

    let moves = mover.doMove(board, dice);

    expect(moves.length).to.equal(2);

    let move1 = moves[0];
    let move2 = moves[1];

    expect(move1).to.be.an.instanceOf(MoveEnter);
    expect(move2).to.be.an.instanceOf(MoveForward);

    expect((move2 as MoveForward).distance).to.equal(6);

    expect((move1 as MoveEnter).pawn).to.deep.equal(pawns[1]);
    expect((move2 as MoveForward).pawn).to.deep.equal(pawns[1]);
	});

  it("should conclude on two forward moves with two two pawns outside, both moving the same pawn", () => {
    let pawns = board.getPawnsOfColor(mover.color);

    tm.placePawnsAtOffsetFromYourEntry([pawns[0], null], board, 30);
    tm.placePawnsOnGivenColorEntrySpot([pawns[1], null], board, mover.color);

    let dice = [4, 6];

    let moves = mover.doMove(board, dice)

    expect(moves.length).to.equal(2);
    moves.forEach(m => { expect(m).to.be.an.instanceOf(MoveForward) });
    
    let move1 = moves[0];
    let move2 = moves[1];

    expect((move1 as MoveForward).distance).to.equal(4);
    expect((move2 as MoveForward).distance).to.equal(6);

    expect((move1 as MoveForward).pawn).to.deep.equal(pawns[1]);
    expect((move2 as MoveForward).pawn).to.deep.equal(pawns[1]);
  });

  it("should conclude on no moves when all pawns are in the base and no enter numbers are rolled", () => {
    let pawns = board.getPawnsOfColor(mover.color);

    let dice = [1, 1];

    let moves = mover.doMove(board, dice);

    expect(moves.length).to.equal(0);
  });

  it("should conclude on no moves when all pawns are in the base and the entry is blockaded", () => {
    let pawns = board.getPawnsOfColor(mover.color);
    let dummies = board.getPawnsOfColor(dummy.color);

    tm.placePawnsOnGivenColorEntrySpot([dummies[0], dummies[1]], board, mover.color);

    let dice = [c.VALUE_TO_ENTER_ON, 6];

    let moves = mover.doMove(board, dice);

    expect(moves.length).to.equal(0);
	});

	it("should switch the pawn to be moved if the first move makes it no longer the last", () => {
		let pawns = board.getPawnsOfColor(mover.color);

		tm.placePawnsAtOffsetFromYourEntry([pawns[0], null], board, 6);
		tm.placePawnsAtOffsetFromYourEntry([pawns[1], null], board, 3);

		let dice = [4, 6];

		let moves = mover.doMove(board, dice);

		expect(moves.length).to.equal(2);

		moves.forEach(m => { expect(m).to.be.an.instanceof(MoveForward); });

		let move1 = moves[0];
		let move2 = moves[1];

		expect((move1 as MoveForward).distance).to.equal(4);
		expect((move2 as MoveForward).distance).to.equal(6);

		expect((move1 as MoveForward).pawn).to.deep.equal(pawns[1]);
		expect((move2 as MoveForward).pawn).to.deep.equal(pawns[0]);
	});
})
