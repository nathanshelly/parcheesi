import * as _ from 'lodash'
import * as c from './Constants'

import { Pawn } from './Pawn'
import { Color } from './Color'
import { _Player } from './_Player'
import { _SpotHandler } from './_SpotHandler'

import { _Move } from './_Move'
import { MoveEnter } from './MoveEnter'
import { MoveForward } from './MoveForward'

import { _Spot } from './_Spot';
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

	constructor() {
		this.mainRing = _.fill(new Array(c.MAIN_RING_SIZE), null).map((_, i) => {
			return this.buildMainRingSpot(i);
		});

		this.mainRing.forEach((sp, i, a) => {
			sp.setNextMain(a[(i + 1) % a.length]);
			sp.index = i; // for debugging purposes
		});

		for (let i = 0; i < c.N_COLORS; i++) {
			let entrance_index = this.getMainRingEntry(i);
			this.bases[i] = new BaseSpot(entrance_index, i);
		}
	}

	// invariant at this point move is legal
	makeMove(move: _Move): number | null {
		let old_spot: _Spot = this.findSpotOfPawn(move.pawn);
		let new_spot: _Spot;

		if(move instanceof MoveForward)
			new_spot = this.spotRunner(old_spot, move.distance, move.pawn.color) as _Spot;
		// move is MoveEnter
		else
			new_spot = old_spot.next(move.pawn.color) as _Spot;
		
		old_spot.removePawn(move.pawn);
		let possible_bonus: number | null = this.handleSpecialLandings(move, new_spot);
		new_spot.addPawn(move.pawn);
		
		return possible_bonus;
	}

	handleSpecialLandings(move: _Move, spot: _Spot): number | null {
		let maybe_home_bonus = this.earnedHomeBonus(spot);
		let maybe_bop_bonus = spot instanceof MainRingSpot 
													? this.earnedBopBonus(move, spot)
													: null;

		if(maybe_home_bonus !== null && maybe_bop_bonus !== null)
			// should never enter here
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
		return (move instanceof MoveEnter ? _.isEqual(landing_spot, this.getMainRingEntry(move.pawn.color)) : !landing_spot.sanctuary)
					 && landing_spot.nPawns() === (c.NUM_PAWNS_IN_BLOCKADE - 1)
					 && landing_spot.getLivePawns().some(pawn => { return pawn.color !== move.pawn.color; });
	}

	moveOnePawnBackToBase(spot: _Spot) {
		if(spot.nPawns() === 0)
			throw new Error("tried to move back pawn from spot with no pawns");
		if(spot instanceof HomeSpot)
			throw new Error("tried to move back pawn from home spot");
		
		let moving_pawn: Pawn = spot.getLivePawns()[0];
		spot.removePawn(moving_pawn)

		this.bases[moving_pawn.color].addPawn(moving_pawn)
	}
	
	findSpotOfPawn(pawn: Pawn): _Spot {
		// maybe check valid color?
		if(!pawn.hasIdInLegalRange())
			throw new Error("given a pawn with invalid ID")
		
		let base_spot: BaseSpot = this.getBaseSpot(pawn.color);
		if(base_spot.pawnExists(pawn))
			return base_spot

		let spot: _Spot = this.getMainRingEntry(pawn.color);
		// spot cannot be null here as we have verified that pawn is
		// valid and must exist on board, write into contract?
		while(!spot.pawnExists(pawn))
			spot = spot.next(pawn.color) as _Spot;

		return spot;
	}

	// get spot at an offset, checking any passed in predicates at
	// each spot along the way, and passing spot to optional spotHandler
	spotRunner(spot: _Spot, distance: number, color: Color, spotHandler?: _SpotHandler, ...predicates: ((spot: _Spot) => boolean)[]): _Spot | null {	
		let next_spot: _Spot | null = spot, counter: number = 0;
		
		while(counter < distance) {
			if(next_spot instanceof HomeSpot)
				// still have distance to go but on home spot
				return null;

			// before getting next spot because
			// indexing starts at 0 for manipulating pawns
			if(spotHandler !== undefined)
				spotHandler.manipulateSpot(next_spot, counter);
			
			// next_spot must be spot here
			next_spot = next_spot.next(color) as _Spot;
			if(predicates.some(predicate => { return predicate(next_spot as _Spot); }))
				return null;

			counter++;
		}

		return next_spot;
	};

	getSpotAtOffsetFromEntry(distance: number, color: Color): _Spot | null {
		let spot = this.getMainRingEntry(color);
		return this.spotRunner(spot, distance, color);
	}

	getMainRingEntry(color: Color): MainRingSpot {
		return this.mainRing[c.COLOR_HOME_AND_ENTRY[color]["ENTRY_FROM_BASE"]];
	}

	getHomeRowStart(color: Color): HomeRowSpot {
		// spot after color's home row entry is guaranteed to be home row spot
		// when next is passed color
		return this.mainRing[c.COLOR_HOME_AND_ENTRY[color]["HOME_ROW_ENTRY"]].next(color) as HomeRowSpot;
	}

	getHomeRowStarts(): HomeRowSpot[] {
		return Object.keys(c.COLOR_HOME_AND_ENTRY).map(key => {
			return this.getHomeRowStart(parseInt(key));
		});
	};

	getHomeSpot(color: Color): HomeSpot {
		return this.spotRunner(this.getHomeRowStart(color), c.HOME_ROW_SIZE, color) as HomeSpot;
	}
	
	getHomeSpots(): HomeSpot[] {
		return Object.keys(c.COLOR_HOME_AND_ENTRY).map(key => {
			return this.getHomeSpot(parseInt(key));
		});
	}

	blockadeOnEntrySpot(color: Color): boolean {
		return this.getMainRingEntry(color).hasBlockade();
	}

	getBaseSpot(color: Color): BaseSpot {
		let base: BaseSpot | undefined = this.bases[color];
		
		if(base === undefined)
			throw new Error("That color isn't playing and has no base spot.");

		return base;
	}

	// returns array of tuples of blockades and their spot
	// used for checking if player reformed blockade
	getBlockadesOfColor(color: Color): [Pawn[], _Spot][] {
		let pawn_spots: _Spot[] = this.getOccupiedSpotsOfColorOnBoard(color);
		
		// filter to unique spots (keeps first of duplicate items)
		let unique_spots = pawn_spots.filter((spot, index, self) => {return index === self.indexOf(spot)});
		// filter spots to only spots with blockades
		let unique_blockaded_spots = unique_spots.filter(spot => {return spot.hasBlockade()});
		
		// get tuples of pawns (sorted for later equality) and spot for spots that have blockades
		let currently_blockaded_pawns = unique_blockaded_spots.map(spot => {
			// need to cast because otherwise Typescript will think this is a
			// heterogenous array
			return [spot.getLivePawns().sort((p1, p2) => p1.id - p2.id), spot] as [Pawn[], _Spot];
		});
		
		return currently_blockaded_pawns;
	}

	// invariant: pawns color and id are correct
	pawnInBase(pawn: Pawn): boolean {
		return this.getBaseSpot(pawn.color).pawnExists(pawn);
	};

	getOccupiedSpotsOfColorOnBoard(color: Color): _Spot[] {
		return this.getPawnsOfColorOnBoard(color).map(pawn => { return this.findSpotOfPawn(pawn); });
	}

	getPawnsOfColor(color: Color): Pawn[] {
		let entry_spot: MainRingSpot = this.getMainRingEntry(color);
		let base_pawns = this.getPawnsOfColorInBase(color)

		return base_pawns.concat(this.getPawnsOfColorOnBoardHelper(color, entry_spot));
	}

	getPawnsOfColorOnBoard(color: Color): Pawn[] {
		let entry_spot: MainRingSpot = this.getMainRingEntry(color);
		return this.getPawnsOfColorOnBoardHelper(color, entry_spot);
	}

	private getPawnsOfColorOnBoardHelper(color: Color, spot: _Spot): Pawn[] {
		let live_pawns: Pawn[], append_pawns: Pawn[];
		live_pawns = spot.getLivePawns();
		append_pawns = (live_pawns.length > 0 && live_pawns[0].color === color)
										? live_pawns
										: [];
		
		if(spot instanceof HomeSpot)
			return append_pawns
		
		// can cast as _Spot here if spot was home spot we would have returned
		let next_spot: _Spot = spot.next(color) as _Spot;
		return append_pawns.concat(this.getPawnsOfColorOnBoardHelper(color, next_spot));
	}
	
	getPawnsOfColorInBase(color: Color): Pawn[] {
		return this.bases[color].getLivePawns();
	}

	areAllPawnsOut(color: Color): boolean {
		return this.getPawnsOfColorInBase(color).length === 0;
	}
}
