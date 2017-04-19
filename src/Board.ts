import * as _ from 'lodash'
import * as c from './Constants'

import { Pawn } from './Pawn'
import { Color } from './Color'
import { _Player } from './_Player'

import { _Move } from './_Move'
import { MoveEnter } from './MoveEnter'
import { MoveForward } from './MoveForward'

import { _Spot } from './_Spot'
import { BaseSpot } from './BaseSpot'
import { HomeSpot } from './HomeSpot'
import { HomeRowSpot } from './HomeRowSpot'
import { MainRingSpot } from './MainRingSpot'

export class Board {
	mainRing: MainRingSpot[];
	bases: { [index: number]: BaseSpot } = {};

	private buildMainRingSpot(ind: number): MainRingSpot {
		let is_sanctuary = false;
		if (c.SAFE_SPOT_INDICES.indexOf(ind) != -1)
			is_sanctuary = true;

		let color: Color | null = null;
		if (c.HOME_ROW_BY_INDEX[ind])
			color = c.HOME_ROW_BY_INDEX[ind];

		return new MainRingSpot(is_sanctuary, color);
	}

	constructor(players: _Player[]) {
		this.mainRing = _.fill(new Array(c.MAIN_RING_SIZE), null).map((_, i) => {
			return this.buildMainRingSpot(i);
		});

		this.mainRing.forEach((sp, i, a) => {
			sp.setNextMain(a[(i + 1) % a.length]);
		});

		for (let i = 0; i < players.length; i++) {
			let player_color = players[i].color;
			this.bases[player_color] = new BaseSpot(this.mainRing[c.ENTRY_POINTS[player_color]], player_color);
		}
	}

	getHomeRowStarts(): HomeRowSpot[] {
		return Object.keys(c.HOME_ROW_BY_INDEX).map(pos => {
			let home_color = c.HOME_ROW_BY_INDEX[pos] as Color;
			return this.mainRing[parseInt(pos)].next(home_color) as HomeRowSpot;
		});
	}

	getHomeSpots(): HomeSpot[] {
		return this.getHomeRowStarts().map(hrs => {
			while (hrs.next()! instanceof HomeSpot)
				hrs = hrs.next() as HomeRowSpot;

			return hrs.next() as HomeSpot;
		});
	}

	winner(): Color | null {
		let homes = this.getHomeSpots();
		for (let i = 0; i < homes.length; ++i) {
			if (homes[i].pawns.indexOf(null) != -1)
				return homes[i].color;
		}
		return null;
	}

	makeMove(move: _Move): void {
		let start_spot: _Spot = this.spotForPosition(move.start, move.pawn.color);
		let end_position: Position = this.calculateNewPosition(move.start, move.distance, move.pawn.color);
		let end_spot: _Spot = this.spotForPosition(end_position, move.pawn.color);

		// could do object check with simpler indexOf, do we trust Javascript's object comparison?
		let pawn_ids: (number | null)[] = start_spot.pawns.map(pawn => {
			return pawn ? pawn.id : null;
		});

		let old_pawn_index = pawn_ids.indexOf(move.pawn.id);
		start_spot.pawns[old_pawn_index] = null;
		let new_pawn_index: number = end_spot.pawns.indexOf(null);
		end_spot.pawns[new_pawn_index] = move.pawn;
	}

	findPawnsOfColorOnBoard(color: Color): Pawn[] {
		return this.findPawnsOfColorInMainRing(color).concat(this.findPawnsOfColorInHomeRow(color), this.findPawnsOfColorInBases(color));
	}

	findPawnsOfColorInHomeRow(color: Color) {
		let pawns: Pawn[] = [];
		let home_rows: HomeRow[] = Object.keys(c.HOME_ROW_BY_INDEX).map(home_row_entry_position => {
			return this.mainRing[home_row_entry_position].home_row;
		});

		home_rows.forEach(home_row => {
			home_row.row.forEach(home_row_spot => {
				home_row_spot.pawns.forEach(home_row_spot_pawn => {
					if (home_row_spot_pawn && home_row_spot_pawn.color === color)
						pawns.push(home_row_spot_pawn);
				});
			});

			home_row.spot.pawns.forEach(home_spot_pawn => {
				if (home_spot_pawn && home_spot_pawn.color === color)
					pawns.push(home_spot_pawn);
			});
		});

		return pawns;
	}

	findPawnsOfColorInBases(color: Color) {
		let pawns: Pawn[] = [];

		Object.keys(this.bases).forEach(base_position => {
			this.bases[base_position].pawns.forEach(pawn => {
				if (pawn && pawn.color === color)
					pawns.push(pawn);
			});
		});

		return pawns;
	}

	findPawnsOfColorInMainRing(color: Color) {
		let pawns: Pawn[] = [];
		this.mainRing.forEach(main_spot => {
			main_spot.pawns.forEach(pawn => {
				if (pawn && pawn.color === color)
					pawns.push(pawn);
			});
		});
		return pawns;
	}

	calculateNewPosition(pos: Position, distance: number, color: Color): Position {
		let moving_position: Position = pos;
		for (let i = 0; i < distance; i++) {
			if (moving_position.main_ring_location === c.HOME_ROW_BY_COLOR[color])
				moving_position.home_row_location++;
			else
				moving_position.main_ring_location++;
		}

		return moving_position;
	};

	spotForPosition(pos: Position, color: Color): _Spot {
		if (pos.main_ring_location === -1) {
			return this.bases[color];
		}
		else if (pos.home_row_location === -1) {
			return this.mainRing[pos.main_ring_location];
		}
		else {
			let home_row = this.mainRing[pos.main_ring_location].home_row as HomeRow
			if (pos.home_row_location === c.HOME_ROW_SIZE)
				return home_row.spot;
			else
				return home_row.row[pos.home_row_location];
		}

	};
}