import * as c from '../Constants'

import { Color } from '../Color'
import { Board } from '../Board'
import { _Move } from '../_Move'

import { _Spot } from '../_Spot'
import { HomeRowSpot } from '../HomeRowSpot'
import { MainRingSpot } from '../MainRingSpot'

import { GeneralLocGetterForColor } from '../_SpotHandler'

/* Types for working with Heuristics */
export type Heuristic = (brd: Board, col: Color) => number;
export type HeuristicComponent = {
	heuristic: Heuristic,
	weight: number,
	multiplier: number,
	description: string
}

export function pawnsInBase(brd: Board, col: Color): number {
	return brd.getBaseSpot(col).nPawns();
}

export function pawnsInHome(brd: Board, col: Color): number {
	return brd.getHomeSpot(col).nPawns();
}

 export function pawnsInHomeRow(brd: Board, col: Color): number[] {
	let spot_manipulator = (spot: _Spot, loc: number): void => {
		spot.getLivePawns().forEach(pawn => {
			if(spot.colorOfPawnsOnSpot() === col)
				this.locs.push(loc);
		});
	};
	
	let home_row_start: HomeRowSpot = brd.getHomeRowStart(col);
	let ggfc = new GeneralLocGetterForColor(col, spot_manipulator);
	brd.spotRunner(home_row_start, c.HOME_ROW_SIZE, col, ggfc);

	return ggfc.locs;
}

export function pawnsInMainRing(brd: Board, col: Color): number[] {
	let spot_manipulator = (spot: _Spot, loc: number): void => {
		spot.getLivePawns().forEach(pawn => {
			if(spot.colorOfPawnsOnSpot() === col)
				this.locs.push(loc);
		});
	};
	
	let entry_spot: MainRingSpot = brd.getMainRingEntry(col);
	let ggfc = new GeneralLocGetterForColor(col, spot_manipulator);
	brd.spotRunner(entry_spot, c.ENTRY_TO_HOME_OFFSET, col, ggfc);

	return ggfc.locs;
}

export function pawnsOnSafety(brd: Board, col: Color): number[] {
	let spot_manipulator = (spot: _Spot, loc: number): void => {
		spot.getLivePawns().forEach(pawn => {
			if(spot.colorOfPawnsOnSpot() === col && spot instanceof MainRingSpot && spot.sanctuary)
				this.locs.push(loc);
		});
	};

	let entry_spot: MainRingSpot = brd.getMainRingEntry(col);
	let ggfc = new GeneralLocGetterForColor(col, spot_manipulator);
	brd.spotRunner(entry_spot, c.ENTRY_TO_HOME_OFFSET, col, ggfc);

	return ggfc.locs;
}

export function blockadesInMainRing(brd: Board, col: Color): number[] {
	let spot_manipulator = (spot: _Spot, loc: number): void => {
		if(spot.colorOfPawnsOnSpot() === col && spot instanceof MainRingSpot && spot.hasBlockade())
				this.locs.push(loc);
	};

	let entry_spot: MainRingSpot = brd.getMainRingEntry(col);
	let ggfc = new GeneralLocGetterForColor(col, spot_manipulator);
	brd.spotRunner(entry_spot, c.ENTRY_TO_HOME_OFFSET, col, ggfc);

	return ggfc.locs;
}
