
import * as _distances from '../src/Distances'

import { expect } from 'chai';
import 'mocha';

describe('Filename: distances.test.ts\n\nConsumption and addition of distances:', () => {
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
		let new_array = _distances.consumeDistance(old_array, 3);

		expect(new_array).to.deep.equal([1, 5, 20]);
	});

	it("should successfully consume first of duplicate distances in array", () => {
		let old_array = [1, 3, 5, 20, 3];
		let new_array = _distances.consumeDistance(old_array, 3);

		expect(new_array).to.deep.equal([1, 5, 20, 3]);
	});

	it("should error when asked to consume non-existent distance", () => {
		let old_array = [1, 3, 5, 20];

		expect(() => { _distances.consumeDistance(old_array, 6); }).to.throw(Error);
	});

	// TODO write more tests here for different consume case

});