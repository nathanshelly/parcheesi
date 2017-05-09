import { expect } from 'chai';
import 'mocha';

import { FirstPawnMover } from '../src/FirstPawnMover';
import { Board } from '../src/Board';
import { Color } from '../src/Color';
import { MoveEnter } from '../src/MoveEnter';
import { MoveForward } from '../src/MoveForward';
import * as tm from './TestMethods';
import * as c from '../src/Constants';

describe("First pawn movers", () => {
  let mover: FirstPawnMover;
  let dummy: FirstPawnMover;
  let board: Board;

  before(() => {
    mover = new FirstPawnMover();
    mover.startGame(Color.blue);

    dummy = new FirstPawnMover();
    dummy.startGame(Color.red);
  });

  beforeEach(() => {
    board = new Board();
  });

  it("should conclude on an enter move for a pawn in the base", () => {
    let pawns = board.getPawnsOfColor(mover.color).reverse();

    let dice = [c.VALUE_TO_ENTER_ON, 6];

    let move = mover.moveForPawn(dice, pawns[0], board);

    expect(move).to.not.be.null;
    expect(move).to.be.an.instanceOf(MoveEnter);
    expect((move as MoveEnter).pawn).to.deep.equal(pawns[0]);
  });

  it("should conclude on a forward move for a pawn outside", () => {
    let pawns = board.getPawnsOfColor(mover.color).reverse();
    
    tm.placePawnsAtOffsetFromYourEntry([pawns[0], null], board, 6);

    let dice = [c.VALUE_TO_ENTER_ON, 6];

    let move = mover.moveForPawn(dice, pawns[0], board);

    expect(move).to.not.be.null;
    expect(move).to.be.an.instanceOf(MoveForward);
    expect((move as MoveForward).distance).to.equal(c.VALUE_TO_ENTER_ON);
    expect((move as MoveForward).pawn).to.deep.equal(pawns[0]);
  });

  it("should conclude on an enter move and a forward move in order when all pawns are inside", () => {
    let pawns = board.getPawnsOfColor(mover.color).reverse();

    let dice = [c.VALUE_TO_ENTER_ON, 6];

    let moves = mover.doMove(board, dice)

    expect(moves.length).to.equal(2);
    expect(moves[0]).to.be.an.instanceOf(MoveEnter);
    expect(moves[1]).to.be.an.instanceOf(MoveForward);
    
    let move1 = moves[0];
    let move2 = moves[1];

    expect((move2 as MoveForward).distance).to.equal(6);

    expect((move1 as MoveEnter).pawn).to.deep.equal(pawns[0]);
    expect((move2 as MoveForward).pawn).to.deep.equal(pawns[0]);
  });

  it("should conclude on two forward moves with one pawn outside, both moving that pawn", () => {
    let pawns = board.getPawnsOfColor(mover.color).reverse();

    tm.placePawnsAtOffsetFromYourEntry([pawns[0], null], board, 6);

    let dice = [c.VALUE_TO_ENTER_ON, 6];

    let moves = mover.doMove(board, dice)

    expect(moves.length).to.equal(2);
    moves.forEach(m => { expect(m).to.be.an.instanceOf(MoveForward) });
    
    let move1 = moves[0];
    let move2 = moves[1];

    expect((move1 as MoveForward).distance).to.equal(c.VALUE_TO_ENTER_ON);
    expect((move2 as MoveForward).distance).to.equal(6);

    expect((move1 as MoveForward).pawn).to.deep.equal(pawns[0]);
    expect((move2 as MoveForward).pawn).to.deep.equal(pawns[0]);
  });

  it("should conclude on two forward moves with two twwo pawns outside, both moving the same pawn", () => {
    let pawns = board.getPawnsOfColor(mover.color).reverse();

    tm.placePawnsAtOffsetFromYourEntry([pawns[0], null], board, 6);
    tm.placePawnsOnGivenColorEntrySpot([pawns[1], null], board, mover.color);

    let dice = [c.VALUE_TO_ENTER_ON, 6];

    let moves = mover.doMove(board, dice)

    expect(moves.length).to.equal(2);
    moves.forEach(m => { expect(m).to.be.an.instanceOf(MoveForward) });
    
    let move1 = moves[0];
    let move2 = moves[1];

    expect((move1 as MoveForward).distance).to.equal(c.VALUE_TO_ENTER_ON);
    expect((move2 as MoveForward).distance).to.equal(6);

    expect((move1 as MoveForward).pawn).to.deep.equal(pawns[0]);
    expect((move2 as MoveForward).pawn).to.deep.equal(pawns[0]);
  });

  it("should conclude on no moves when all pawns are in the base and no enter numbers are rolled", () => {
    let pawns = board.getPawnsOfColor(mover.color).reverse();

    let dice = [1, 1];

    let moves = mover.doMove(board, dice);

    expect(moves.length).to.equal(0);
  });

  it("should conclude on no moves when all pawns are in the base and the entry is blockaded", () => {
    let pawns = board.getPawnsOfColor(mover.color).reverse();
    let dummies = board.getPawnsOfColor(dummy.color);

    tm.placePawnsOnGivenColorEntrySpot([dummies[0], dummies[1]], board, mover.color);

    let dice = [c.VALUE_TO_ENTER_ON, 6];

    let moves = mover.doMove(board, dice);

    expect(moves.length).to.equal(0);
  });

  it("should return three moves when advancing the furthest pawn results in a home spot bonus and all dice + bonus can be used", () => {
    let pawns = board.getPawnsOfColor(mover.color).reverse();

    tm.placePawnsAtOffsetFromYourEntry([pawns[0], null], board, c.ENTRY_TO_HOME_ROW_START_OFFSET + c.HOME_ROW_SIZE - 2);
    tm.placePawnsOnGivenColorEntrySpot([pawns[1], null], board, mover.color);

    let dice = [2, 6];

    let moves = mover.doMove(board, dice);

    expect(moves.length).to.equal(3);
    moves.forEach(m => { expect(m).to.be.an.instanceOf(MoveForward); });
    expect((moves[0] as MoveForward).distance).to.equal(2);
    expect((moves[1] as MoveForward).distance).to.equal(6);
    expect((moves[2] as MoveForward).distance).to.equal(c.HOME_SPOT_BONUS);

    expect((moves[0] as MoveForward).pawn).to.deep.equal(pawns[0]);
    expect((moves[1] as MoveForward).pawn).to.deep.equal(pawns[1]);
    expect((moves[2] as MoveForward).pawn).to.deep.equal(pawns[1]);
  });

  it("should return three moves when the furthest pawn is outside and advancing it results in a bop bonus and all dice + bonus can be used", () => {
    let pawns = board.getPawnsOfColor(mover.color).reverse();
    let dummies = board.getPawnsOfColor(dummy.color);

    tm.placePawnsAtOffsetFromYourEntry([pawns[0], null], board, c.VALUE_TO_ENTER_ON);
    tm.placePawnsAtOffsetFromYourEntry([dummies[0], null], board, c.OFFSET_BETWEEN_ENTRIES + 10);

    let dice = [c.VALUE_TO_ENTER_ON, 6];

    let moves = mover.doMove(board, dice);

    expect(moves.length).to.equal(3);
    moves.forEach(m => { expect(m).to.be.an.instanceOf(MoveForward); });
    
    expect((moves[0] as MoveForward).distance).to.equal(c.VALUE_TO_ENTER_ON);
    expect((moves[1] as MoveForward).distance).to.equal(6);
    expect((moves[2] as MoveForward).distance).to.equal(c.BOP_BONUS);

    expect((moves[0] as MoveForward).pawn).to.deep.equal(pawns[0]);
    expect((moves[1] as MoveForward).pawn).to.deep.equal(pawns[0]);
    expect((moves[2] as MoveForward).pawn).to.deep.equal(pawns[0]);
  });

  it("should return three moves when all pawns are in the base and entering it results in a bop bonus and all dice + bonus can be used", () => {
    let pawns = board.getPawnsOfColor(mover.color).reverse();
    let dummies = board.getPawnsOfColor(dummy.color);

    tm.placePawnsOnGivenColorEntrySpot([dummies[0], null], board, mover.color);

    let dice = [c.VALUE_TO_ENTER_ON, 6];

    let moves = mover.doMove(board, dice);

    expect(moves.length).to.equal(3);

    expect(moves[0]).to.be.an.instanceOf(MoveEnter);
    expect(moves[1]).to.be.an.instanceOf(MoveForward);
    expect(moves[2]).to.be.an.instanceOf(MoveForward);
    
    expect((moves[1] as MoveForward).distance).to.equal(6);
    expect((moves[2] as MoveForward).distance).to.equal(c.BOP_BONUS);

    expect((moves[0] as MoveEnter).pawn).to.deep.equal(pawns[0]);
    expect((moves[1] as MoveForward).pawn).to.deep.equal(pawns[0]);
    expect((moves[2] as MoveForward).pawn).to.deep.equal(pawns[0]);
  })
})
