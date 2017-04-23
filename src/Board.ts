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
		if (c.HOME_ROW_BY_INDEX[ind] !== undefined) // FUCK YOU ZERO
			color = c.HOME_ROW_BY_INDEX[ind];

		return new MainRingSpot(is_sanctuary, color);
	}

	constructor(players: _Player[]) {
		this.mainRing = _.fill(new Array(c.MAIN_RING_SIZE), null).map((_, i) => {
			return this.buildMainRingSpot(i);
		});

		this.mainRing.forEach((sp, i, a) => {
			sp.setNextMain(a[(i + 1) % a.length]);
			// sp.index = i; // for debugging purposes
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

	// invariant at this point move is legal
	makeMove(move: _Move): void {
		let spot: _Spot = this.findPawn(move.pawn);
		
		if(move instanceof MoveEnter)
			(this.getNextSpot(spot, move.pawn.color) as MainRingSpot).add_pawn(move.pawn);
		// move is MoveForward
		else if (move instanceof MoveForward)
			(this.advanceToNewSpot(spot, move.distance, move.pawn.color) as _Spot).add_pawn(move.pawn);

		spot.remove_pawn(move.pawn);
	}

	findPawn(pawn: Pawn): _Spot {
		let base_spot: BaseSpot = this.getBaseSpot(pawn.color);
		if(base_spot.pawn_exists(pawn))
			return base_spot

		let spot: _Spot = this.getEntrySpot(pawn.color);
		// spot cannot be null here as we have verified that pawn is
		// valid and must exist on board, write into contract?
		while(!spot.pawn_exists(pawn))
			spot = this.getNextSpot(spot, pawn.color) as _Spot;

		return spot;
	}

	findBlockadesOfColor(color: Color): Pawn[][] {
		let pawn_spots: _Spot[] = this.getSpotsOfColor(color);
		
		// filter to unique spots (keeps first of duplicate items)
		let unique_spots = pawn_spots.filter((spot, index, self) => {return index === self.indexOf(spot)});
		// filter spots to only spots with blockades
		let unique_blockaded_spots = unique_spots.filter(spot => {return spot.has_blockade()});
		
		// get tuples of pawns from spots that have blockades
		let currently_blockaded_pawns: Pawn[][] = unique_blockaded_spots.map(spot => spot.get_live_pawns())
		return currently_blockaded_pawns;
	}

	advanceToNewSpot(spot: _Spot, distance: number, color: Color): _Spot | null {
		// no predicate, just to find distances
		return this.spotRunner(spot, distance, color);
	};

	spotRunner(spot: _Spot, distance: number, color: Color, ...predicates: ((spot: _Spot) => boolean)[]): _Spot | null {
		let next_spot: _Spot | null = null;
		
		while(distance > 0) {
			next_spot = this.getNextSpot(spot, color);
			// trigger that they've cheated instead?
			if(next_spot === null || predicates.some(predicate => { return predicate(next_spot as _Spot); }))
				return null;
			distance--;
		}

		return next_spot;
	};

	getNextSpot(spot: _Spot, color: Color): _Spot | null {
		if(spot instanceof MainRingSpot)
			return spot.next(color);
		else if(spot instanceof HomeRowSpot || spot instanceof BaseSpot)
			return spot.next();
		// spot is HomeSpot, has no next
		// trigger that they've cheated instead?
		else
			return null;
	}

	getEntrySpot(color: Color): MainRingSpot {
		// no need to check if entry spot exists as it will exist even
		// if passed in color isn't actually playing
		return this.mainRing[c.ENTRY_POINTS[color]];
	}

	getBaseSpot(color: Color): BaseSpot {
		let base: BaseSpot | undefined = this.bases[color];
		
		if(!base)
			throw new Error("That color isn't playing and has no base spot.");

		return base;
	}

	// assumes pawns color and id are correct
	// must be checked previously
	// does not assume pawn's spot is correct
	pawnInBase(pawn: Pawn): boolean {
		return this.getBaseSpot(pawn.color).pawn_exists(pawn);
	};


	getSpotsOfColor(color: Color): _Spot[] {
		return this.getPawnsOfColorOnBoard(color).map(pawn => { return this.findPawn(pawn); });
	}

	// functions for getting a pawn based on color
	// may be less useful now that pawns don't have spots
	// check back with functions to see if they are being used later
	getPawnsOfColor(color: Color): Pawn[] {
		return this.getPawnsOfColorInBase(color).concat(this.getPawnsOfColorOnBoard(color));
	}

	getPawnsOfColorOnBoard(color: Color): Pawn[] {
		let entry_spot: MainRingSpot = this.getEntrySpot(color);
		return this.getPawnsOfColorOnBoardHelper(color, entry_spot);
	}

	private getPawnsOfColorOnBoardHelper(color: Color, spot: _Spot): Pawn[] {
		let live_pawns: Pawn[] = spot.get_live_pawns();
		let append_pawns: Pawn[] = (live_pawns.length > 0 && live_pawns[0].color === color) ? live_pawns : [];
		
		let next_spot: _Spot | null = this.getNextSpot(spot, color);

		if(next_spot === null)
			return append_pawns
		
		return append_pawns.concat(this.getPawnsOfColorOnBoardHelper(color, next_spot));
	}
	
	getPawnsOfColorInBase(color: Color): Pawn[] {
		return this.bases[color].get_live_pawns();
	}
}