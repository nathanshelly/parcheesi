import * as c from './Constants'
import * as checker from './RulesChecker'

import { Pawn } from './Pawn'
import { Board } from './Board'
import { _Move } from './_Move'
import { _Player } from './_Player'

import { _Spot } from './_Spot'
import { HomeSpot } from './HomeSpot'
import { HomeRowSpot } from './HomeRowSpot'
import { MainRingSpot } from './MainRingSpot'

// represents a move that starts on the main ring
// (but does not have to end up there)
export class MoveForward implements _Move {
  pawn: Pawn;
  distance: number;

	constructor(pawn: Pawn, distance: number) {
    this.pawn = pawn;
    this.distance = distance;
  }

  isLegal(board: Board, player: _Player, possible_distances: number[], starting_blockades: Pawn[][]): boolean {
    if  (this.distance < 1
			|| this.distance > c.LARGEST_POSSIBLE_MOVE
			|| possible_distances.indexOf(this.distance) === -1
			|| board.pawnInBase(this.pawn)
      || !checker.verifyPawn(this.pawn, player.color))
				return false;
    
    let blockade_on_spot_checker = (spot: _Spot) => { return spot.hasBlockade(); };

    // getSpotAtOffsetFromSpot implicitly checks that distance is not off board 
    // (which itself implicitly checks that they enter home on exact value)
    // passed in blockade_on_spot_checker will cause getSpotAtOffsetFromSpot to return null
    // if move attempts to move onto or through blockade
    let final_spot: _Spot | null = board.getSpotAtOffsetFromSpot(board.findPawn(this.pawn),
                                                    this.distance,
                                                    player.color,
                                                    blockade_on_spot_checker);
    
    // overshot home
    if(final_spot === null)
      return false;
    
    // reached home, no further ways to cheat
    if(final_spot instanceof HomeSpot)
      return true;

    // can't reform blockade on same roll
    if(checker.reformedBlockade(this.pawn, final_spot, starting_blockades))
      return false;

    // reached homeRowSpot and didn't reform blockade, no further ways to cheat
    if(final_spot instanceof HomeRowSpot)
      return true;
    
    // last way to cheat:
    // bopping pawn on safety spot
    if(final_spot instanceof MainRingSpot)
      if(!checker.isSpotEmpty(final_spot) && final_spot.colorOfPawns() !== player.color)
        return board.landingWillBop(this, final_spot);

    // no cheat found, we have a legal MoveForward
    return true;
  }
}
