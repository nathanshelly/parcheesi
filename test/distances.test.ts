import * as _distances from '../src/Distances'

import { Pawn } from '../src/Pawn'
import { Color } from '../src/Color'
import { MoveEnter } from '../src/MoveEnter'
import { MoveForward } from '../src/MoveForward'

import { expect } from 'chai';
import 'mocha';

describe('Filename: distances.test.ts\n\nConsumption and addition of distances:', () => {
	let pawn: Pawn;
	
	beforeEach(() => {
        pawn = new Pawn(0, Color.Blue)
    });
	
	it("should successfully add new unique distance to array", () => {
		let old_array = [1, 3, 5, 20];
		let new_array = _distances.addDistance(old_array, 6);

		expect(new_array).to.deep.equal([1, 3, 5, 20, 6]);
	});

	it("should successfully add new duplicate distance to array", () => {
		let old_array = [1, 3, 5, 20];
		let new_array = _distances.addDistance(old_array, 3);

		expect(new_array).to.deep.equal([1, 3, 5, 20, 3]);
	});

	it("should successfully consume unique distance in array", () => {
		let old_array = [1, 3, 5, 20];
		let new_array = _distances.consumeMove(old_array, new MoveForward(pawn, 3));

		expect(new_array).to.deep.equal([1, 5, 20]);
	});

	it("should successfully consume first of duplicate distances in array", () => {
		let old_array = [1, 3, 5, 20, 3];
		let new_array = _distances.consumeMove(old_array, new MoveForward(pawn, 3));

		expect(new_array).to.deep.equal([1, 5, 20, 3]);
	});

	it("should error when asked to consume non-existent distance", () => {
		let old_array = [1, 3, 5, 20];

		expect(() => { _distances.consumeMove(old_array, new MoveForward(pawn, 6)); }).to.throw(Error);
	});

	it("should error if no pair or number equaling five in distances on MoveEnter", () => {
		let old_array = [1, 3, 20];

		expect(() => { _distances.consumeMove(old_array, new MoveEnter(pawn)); }).to.throw(Error);
	});

	it("should correctly consume five on MoveEnter", () => {
		let old_array = [1, 5, 2];

		let new_array = _distances.consumeMove(old_array, new MoveEnter(pawn));
		expect(new_array).to.deep.equal([1, 2]);
	});

	it("should correctly consume 1 and 4 in pair on MoveEnter", () => {
		let old_array = [1, 4, 20];

		let new_array = _distances.consumeMove(old_array, new MoveEnter(pawn));
		expect(new_array).to.deep.equal([20]);
	});

	it("should correctly consume 2 and 3 in pair on MoveEnter", () => {
		let old_array = [2, 3, 4, 20];

		let new_array = _distances.consumeMove(old_array, new MoveEnter(pawn));
		expect(new_array).to.deep.equal([4, 20]);
	});

});