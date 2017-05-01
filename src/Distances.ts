import * as c from './Constants'
import { _Move } from './_Move';
import { MoveEnter } from './MoveEnter';
import { MoveForward } from './MoveForward';

export function rollDice(all_pawns_out: boolean): number[] {
	let initial_roll: number[] = [this.rollDie(), this.rollDie()];
	return isDoubles(initial_roll) && all_pawns_out ? initial_roll.concat(doublesOpposites(initial_roll[0])) : initial_roll;
}

function rollDie(): number {
	// random roll between 0 and 6
	return Math.floor(6 * Math.random());
}

function isDoubles(dice: number[]): boolean {
	// checks if dice in roll are doubles
	return dice[0] === dice[1];
}

function doublesOpposites(visible_face: number): number[] {
	// given a visible face returns the tuple of opposite faces,
	// invariant on calling: initial_roll had doubles
	let max_pips_on_both_sides: number = 7;

	return [null, null].map(i => {
		return max_pips_on_both_sides - visible_face;
	});
}

export function addDistance(current_distances: number[], new_distance: number): number[] {
	current_distances.push(new_distance);
	return current_distances;
}

export function consumeMove(current_distances: number[], move: _Move): number[] {
	return (move instanceof MoveEnter)
					? consumeMoveEnterDistance(current_distances)
					: consumeMoveForwardDistance(current_distances, (move as MoveForward).distance);
}
	
function consumeMoveForwardDistance(current_distances: number[], distance_to_consume: number): number[] {
	if(!(distance_to_consume in current_distances))
		throw new Error("That distance isn't in the array and can't be consumed!");
	
	return consumeSingleDistance(current_distances, distance_to_consume);
}

// there must be a five at this point
function consumeMoveEnterDistance(current_distances: number[]): number[] {
	let fives: [number, number][] = findFive(current_distances);

	if(fives.length === 0)
		throw new Error('No fives or combinations of five in possible distances');

	// if there are fives we are guaranteed that any and all fives are all the same
	// there can never be a current_distances like this [1, 4, 5]
	// current_distances can only ever one pair of 1 and 4 or 2 and 3, or duplicate 5s
	// in the case of duplicate 5s it doesn't matter which one we remove

	let five_to_consume: [number, number] = fives[0];

	// in this case the five is a single 5, not 1 and 4 or 2 and 3
	if(five_to_consume[1] === 0)
		return consumeSingleDistance(current_distances, five_to_consume[0]);
	else
		return consumePair(current_distances, five_to_consume);
}

function consumePair(current_distances: number[], pair_to_consume: [number, number]): number[] {
	current_distances = consumeSingleDistance(current_distances, pair_to_consume[0]);
	return consumeSingleDistance(current_distances, pair_to_consume[1]);
}

function consumeSingleDistance(current_distances: number[], distance_to_consume: number):  number[] {
	current_distances.splice(current_distances.indexOf(distance_to_consume), 1);
	return current_distances;
}

// returns pairs in set of pairs that sum to c.ENTRY_VALUE
export function findFive(current_distances: number[]): [number, number][] {
	let pairs = distanceCombinations(current_distances);
	return pairs.filter(pair => { return pair[0] + pair[1] === c.VALUE_TO_ENTER_ON; });
}

function distanceCombinations(possible_distances: number[]): [number, number][]{
		let pairs: [number, number][] = [];
		
		// generate all pairs of distances
		for(let i = 0; i < possible_distances.length; i++) {
			for(let j = 0; j < i; j++) {
				pairs.push([possible_distances[i], possible_distances[j]]);
			}
		}

		// add lone distance combos
		possible_distances.forEach(move => { pairs.push([move, 0]); });
		return pairs;
}