import * as c from './Constants'
import * as d from './Distances'

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

  isLegal(board: Board, player: _Player, possible_distances: number[]): boolean {
    if  (!d.distanceInDistances(this.distance, possible_distances)
			   || board.pawnInBase(this.pawn)
         || !this.pawn.verify(player.color))
				return false;
    
    // getSpotAtOffsetFromSpot implicitly checks that distance is not off board 
    // (which itself implicitly checks that they enter home on exact value)
    // passed in blockadeOnSpotChecker will cause getSpotAtOffsetFromSpot to return null
    // if move attempts to move onto or through blockade
    let blockadeOnSpotChecker = (spot: _Spot) => { return spot.hasBlockade(); };
    let final_spot: _Spot | null = board.spotRunner(board.findSpotOfPawn(this.pawn),
                                                    this.distance,
                                                    player.color,
                                                    undefined,
                                                    blockadeOnSpotChecker);
    if(final_spot === null)
      return false;
    
    // reached HomeRow, no further ways to cheat
    if(!(final_spot instanceof MainRingSpot))
      return true;
      
    // last way to cheat:
    // bopping pawn on safety spot
    if(final_spot instanceof MainRingSpot)
      if(!final_spot.isEmpty() && final_spot.colorOfPawnsOnSpot() !== player.color)
        return board.landingWillBop(this, final_spot);

    // no cheat found, we have a legal MoveForward
    return true;
  }
}
