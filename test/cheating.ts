import { Parcheesi } from '../src/Parcheesi'
import { BasicPlayer } from '../src/BasicPlayer'
import { Board } from '../src/Board'
import { _Move } from '../src/_Move'
import { EnterMove } from '../src/EnterMove'
import { MoveMain } from '../src/MoveMain'
import { Pawn } from '../src/Pawn'
import { BoardPawn } from '../src/BoardPawn'
import { expect } from 'chai';
import 'mocha';

describe('Parcheesi should catch cheats', () => {
  let game: Parcheesi;

  beforeEach(() => {
    game = new Parcheesi();
  });

  it('shouldnt allow entering without a five', () => {
    class CheatingEnterPlayer extends BasicPlayer {
      doMove(brd: Board, dice: [number, number]): [_Move, _Move] {
        return [new EnterMove(new Pawn(0, this.color)), new EnterMove(new Pawn(1, this.color))];
      };
    }

    let player = new CheatingEnterPlayer()
    game.register(player);
    game.buildBoard();

    let dice: [number, number] = [1, 1];
    let cheat = game.isCheat(player.doMove(game.board, dice), dice, player);

    expect(cheat).to.equal(true);
  });

  it('should allow entering with a five', () => {
    class LegalEnterPlayer extends BasicPlayer {
      doMove(brd: Board, dice: [number, number]): [_Move, _Move] {
        return [new EnterMove(new Pawn(0, this.color)), new EnterMove(new Pawn(1, this.color))];
      };
    }

    let player = new LegalEnterPlayer()
    game.register(player);
    game.buildBoard();

    let dice: [number, number] = [5, 5];
    let cheat = game.isCheat(player.doMove(game.board, dice), dice, player);

    expect(cheat).to.equal(false);
  });

  it('should not allow us to move an unentered pawn', () => {
    class CheatingUnenteredPawnPlayer extends BasicPlayer {
      doMove(brd: Board, dice: [number, number]): [_Move, _Move] {
        return [new MoveMain(new Pawn(0, this.color), 0, 4), new MoveMain(new Pawn(1, this.color), 0, 4)]
      };
    }

    let player = new CheatingUnenteredPawnPlayer()
    game.register(player);
    game.buildBoard();

    let dice: [number, number] = [4, 4];
    let cheat = game.isCheat(player.doMove(game.board, dice), dice, player);

    expect(cheat).to.equal(true);
  });

  it('should allow us to move an entered pawn', () => {
    class CheatingUnenteredPawnPlayer extends BasicPlayer {
      doMove(brd: Board, dice: [number, number]): [_Move, _Move] {
        return [new MoveMain(new Pawn(0, this.color), 0, 4), new MoveMain(new Pawn(1, this.color), 0, 4)]
      };
    }

    let player = new CheatingUnenteredPawnPlayer()
    game.register(player);
    game.buildBoard();
    game.board.pawns[player.color][0].position = 0;
    game.board.pawns[player.color][1].position = 0;

    let dice: [number, number] = [4, 4];
    let cheat = game.isCheat(player.doMove(game.board, dice), dice, player);

    expect(cheat).to.equal(false);
  });
});