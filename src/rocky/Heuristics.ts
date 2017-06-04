import * as c from '../Constants'

import { Color } from '../Color'
import { Board } from '../Board'
import { _Spot } from '../_Spot'
import { MainRingSpot } from '../MainRingSpot'
import { PawnLocGetterForColor, GeneralGetterTester } from '../_SpotHandler'

export function pawnsInHome(brd: Board, col: Color): number {
	return brd.getHomeSpots().filter(hs => {
		return hs.color === col;
	})[0].nPawns();
}

export function pawnsInHomeRow(brd: Board, col: Color): number[] {
	let home_row_start = brd.getHomeRowStarts().filter(hrs => {
		return hrs.color === col;
	})[0];

	let plgc = new PawnLocGetterForColor(col);
	brd.spotRunner(home_row_start, c.HOME_ROW_SIZE, col, plgc);

	return plgc.locs;
}

export function pawnsInMainRing(brd: Board, col: Color): number[] {
	let entry_spot: _Spot = brd.getMainRingEntry(col);

	let plgc = new PawnLocGetterForColor(col);
	brd.spotRunner(entry_spot, c.ENTRY_TO_HOME_OFFSET, col, plgc);

	return plgc.locs;
}

export function pawnsInBase(brd: Board, col: Color): number {
	return brd.bases[col].nPawns();
}

// export function pawnsOnSafety(brd: Board, col: Color): [number[], number[]] {
// 	let spot_manipulator = (spot: _Spot, loc: number): void => {
// 		if(spot instanceof MainRingSpot && spot.sanctuary)
// 			this.spot_locs.push(spot, loc);
// 	};

// 	let ggt = new GeneralGetterTester(col, spot_manipulator);
// 	brd.spotRunner()
// }