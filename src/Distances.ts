function rollDie(): number {
	// random roll between 0 and 6
	return Math.floor(6 * Math.random());
}

function isDoubles(dice: number[]): boolean {
	// checks if dice in roll are doubles
	return dice[0] == dice[1];
}

function doublesOpposites(visible_face: number): number[] {
	// given a visible face returns the tuple of opposite faces,
	// invariant on calling: initial_roll had doubles
	let max_pips_on_both_sides: number = 14;
	let num_dice: number = 2;

	return [null, null].map(i => {
		return (max_pips_on_both_sides - (visible_face * num_dice))/2
	});
}

export function rollDice(): number[] {
	let initial_roll: number[] = [this.rollDie(), this.rollDie()]
	return isDoubles(initial_roll) ? initial_roll.concat(doublesOpposites(initial_roll[0])) : initial_roll;
}

export function addDistance(current_distances: number[], new_distance: number): number[] {
	current_distances.push(new_distance);
	return current_distances;
}

export function consumeDistance(current_distances: number[], distance_to_consume: number): number[] {
	if(!(distance_to_consume in current_distances))
		throw new Error("That distance isn't in the array and can't be consumed!");
	
	current_distances.splice(current_distances.indexOf(distance_to_consume), 1);
	return current_distances;
}