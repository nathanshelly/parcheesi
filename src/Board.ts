import * as c from './Constants'
import { MainRingSpot } from './MainRingSpot'
import { BaseSpot } from './BaseSpot'
import { _Player } from './_Player'
import { Pawn } from './Pawn'
import { Color, colorForIndex } from './Color'
import { EnterMove } from './EnterMove'
import { MoveMain } from './MoveMain'
import { MoveHome } from './MoveHome'
import { HomeRow } from './HomeRow'
import * as _ from 'lodash'

export class Board {
	mainRing: MainRingSpot[];
	bases: BaseSpot[];

	constructor(players: _Player[]) {
		this.mainRing = (new Array(c.MAIN_RING_SIZE)).map((_, i) => {
			if (Object.keys(c.HOME_ROW_COLORS).indexOf(i.toString()) != -1) {
				return new MainRingSpot(i, true, c.HOME_ROW_COLORS[i]);
			}
			else if (c.SAFE_SPOT_INDICES.indexOf(i) != -1) {
				return new MainRingSpot(i, true, null);
			}
			else {
				return new MainRingSpot(i, false, null);
			}
		});
		this.bases = players.map((p, i) => {
			return new BaseSpot(-1, this.mainRing[c.ENTRY_POINTS[p.color]], p.color);
		});
	}

	winner(): Color | null {
		for (let position in Object.keys(c.HOME_ROW_COLORS)) {
			let home_row = this.mainRing[parseInt(position)].home_row as HomeRow
			if (home_row.home_spot.pawns.indexOf(null) != -1)
				return home_row.color;
		};
		return null;
	}
 }