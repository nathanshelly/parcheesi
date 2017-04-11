import { Parcheesi } from '../src/Parcheesi'
import { BasicPlayer } from '../src/BasicPlayer'
import { ParcheesiBoard } from '../src/ParcheesiBoard'
import { _Move } from '../src/_Move'
import { EnterMove } from '../src/EnterMove'
import { Pawn } from '../src/Pawn'
import { expect } from 'chai';
import 'mocha';

describe('Parcheesi should catch cheats', () => {
  let game: Parcheesi;

  beforeEach(() => {
    game = new Parcheesi();
  });

  it('shouldnt allow entering without a five', () => {
    class CheatingEnterPlayer extends BasicPlayer {
      doMove(brd: ParcheesiBoard, dice: [number, number]): [_Move, _Move] {
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
});