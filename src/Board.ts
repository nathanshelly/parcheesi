import * as _ from 'lodash'
import * as c from './Constants'
import * as checker from './RulesChecker'

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
		if (c.SAFE_SPOT_INDICES.indexOf(ind) !== -1)
			is_sanctuary = true;

		let color: Color | null = this.colorIfHomeEntrySpot(ind);

		return new MainRingSpot(is_sanctuary, color);
	}

	private colorIfHomeEntrySpot(ind): Color | null {
		// mapping to numbers not technically required but lets me sleep at night
		let color_keys: number[] = Object.keys(c.COLOR_HOME_AND_ENTRY).map(key => { return parseInt(key); });
		for (let key in color_keys)
			if (c.COLOR_HOME_AND_ENTRY[key]["HOME_ROW_ENTRY"] === ind)
				return parseInt(key) as Color;
		
		return null;
	}

	constructor(players: _Player[]) {
		this.mainRing = _.fill(new Array(c.MAIN_RING_SIZE), null).map((_, i) => {
			return this.buildMainRingSpot(i);
		});

		this.mainRing.forEach((sp, i, a) => {
			sp.setNextMain(a[(i + 1) % a.length]);
			sp.index = i; // for debugging purposes
		});

		for (let i = 0; i < players.length; i++) {
			let player_color = players[i].color;
			let entrance_index = this.mainRing[c.COLOR_HOME_AND_ENTRY[player_color]["ENTRY_FROM_BASE"]];
			this.bases[player_color] = new BaseSpot(entrance_index, player_color);
		}
	}

	// invariant at this point move is legal
	makeMove(move: _Move): number | null {
		let old_spot: _Spot = this.findPawn(move.pawn);
		let new_spot: _Spot;

		if(move instanceof MoveForward)
			new_spot = this.getSpotAtOffsetFromSpot(old_spot, move.distance, move.pawn.color) as _Spot;
		// move is MoveEnter
		else
			new_spot = this.getNextSpot(old_spot, move.pawn.color) as _Spot;
		
		old_spot.remove_pawn(move.pawn);
		let possible_bonus: number | null = this.handleSpecialLandings(move, new_spot);
		
		new_spot.add_pawn(move.pawn);
		
		return possible_bonus;
	}

	handleSpecialLandings(move: _Move, spot: _Spot): number | null {
		let maybe_home_bonus = this.earnedHomeBonus(spot);
		let maybe_bop_bonus = spot instanceof MainRingSpot 
													? this.earnedBopBonus(move, spot)
													: null;

		if(maybe_home_bonus !== null && maybe_bop_bonus !== null)
			throw new Error("Can't earn two bonuses in one move")
		else if(maybe_home_bonus === null && maybe_bop_bonus === null)
			return null;
		else
			return maybe_home_bonus === null ? maybe_bop_bonus : maybe_home_bonus;
	}

	earnedHomeBonus(spot: _Spot): number | null {
		return spot instanceof HomeSpot ? c.HOME_SPOT_BONUS : null;
	}

	earnedBopBonus(move: _Move, spot: MainRingSpot): number | null {
		if(this.landingWillBop(move, spot)) {
			this.moveOnePawnBackToBase(spot);
			return c.BOP_BONUS;
		}
		else
			return null;
	}

	landingWillBop(move: _Move, landing_spot: MainRingSpot): boolean {
		return (move instanceof MoveEnter ? _.isEqual(landing_spot, this.getEntrySpot(move.pawn.color)) : !landing_spot.sanctuary)
					 && landing_spot.n_pawns() === (c.NUM_PAWNS_IN_BLOCKADE - 1)
					 && landing_spot.get_live_pawns().some(pawn => { return pawn.color !== move.pawn.color; });
	}

	moveOnePawnBackToBase(spot: _Spot) {
		if(spot.n_pawns() === 0)
			throw new Error("tried to move back pawn from spot with no pawns");
		if(spot instanceof HomeSpot)
			throw new Error("tried to move back pawn from home spot");
		
		let moving_pawn: Pawn = spot.get_live_pawns()[0];
		spot.remove_pawn(moving_pawn)

		this.bases[moving_pawn.color].add_pawn(moving_pawn)
	}
	
	findPawn(pawn: Pawn): _Spot {
		// maybe check valid color?
		if(checker.pawnIdOutsideLegalRange(pawn))
			throw new Error("given a pawn with invalid ID")
		
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

	getSpotAtOffsetFromSpot(spot: _Spot, distance: number, color: Color, ...predicates: ((spot: _Spot) => boolean)[]): _Spot | null {
		// get spot at an offset, checking any passed in predicates at each spot along the way
		let next_spot: _Spot | null = spot;
		
		while(distance-- > 0) {
			next_spot = this.getNextSpot(next_spot, color);
			// trigger that they've cheated instead?
			if(next_spot === null || predicates.some(predicate => { return predicate(next_spot as _Spot); }))
				return null;
		}

		return next_spot;
	};

	getSpotAtOffsetFromEntry(distance: number, color: Color): _Spot | null {
		let spot = this.getEntrySpot(color);
		return this.getSpotAtOffsetFromSpot(spot, distance, color);
	}

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
		return this.mainRing[c.COLOR_HOME_AND_ENTRY[color]["ENTRY_FROM_BASE"]];
	}

	getBaseSpot(color: Color): BaseSpot {
		let base: BaseSpot | undefined = this.bases[color];
		
		if(base === undefined)
			throw new Error("That color isn't playing and has no base spot.");

		return base;
	}

	getBlockadesOfColor(color: Color): Pawn[][] {
		let pawn_spots: _Spot[] = this.getOccupiedSpotsOfColorOnBoard(color);
		
		// filter to unique spots (keeps first of duplicate items)
		let unique_spots = pawn_spots.filter((spot, index, self) => {return index === self.indexOf(spot)});
		// filter spots to only spots with blockades
		let unique_blockaded_spots = unique_spots.filter(spot => {return spot.has_blockade()});
		
		// get tuples of pawns (sorted for later equality) from spots that have blockades
		let currently_blockaded_pawns: Pawn[][] = unique_blockaded_spots.map(spot => { return spot.get_live_pawns().sort(); });
		return currently_blockaded_pawns;
	}

	// invariant: pawns color and id are correct
	pawnInBase(pawn: Pawn): boolean {
		return this.getBaseSpot(pawn.color).pawn_exists(pawn);
	};

	getOccupiedSpotsOfColorOnBoard(color: Color): _Spot[] {
		return this.getPawnsOfColorOnBoard(color).map(pawn => { return this.findPawn(pawn); });
	}

	getPawnsOfColor(color: Color): Pawn[] {
		let entry_spot: MainRingSpot = this.getEntrySpot(color);

		let base_pawns = this.getPawnsOfColorInBase(color)

		return base_pawns.concat(this.getPawnsOfColorOnBoardHelper(color, entry_spot));
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

	// any reason not to use getSpotAtOffsetFromSpot to advance forward length of home row?
	getHomeSpots(): HomeSpot[] {
		return this.getHomeRowStarts().map(hrs => {
			// TODO - test if one-liner below works, if so use it instead
			// return this.getSpotAtOffsetFromSpot(hrs, c.HOME_ROW_SIZE, hrs.color) as HomeSpot;
			while (!(hrs.next() instanceof HomeSpot))
				hrs = hrs.next() as HomeRowSpot;

			return hrs.next() as HomeSpot;
		});
	}

	getHomeRowStarts(): HomeRowSpot[] {
		return Object.keys(c.COLOR_HOME_AND_ENTRY).map(key => {
			let home_color: Color = parseInt(key) as Color;
			return this.mainRing[c.COLOR_HOME_AND_ENTRY[key]["HOME_ROW_ENTRY"]].next(home_color) as HomeRowSpot;
		})};
}