import * as _ from 'lodash'
import * as d from '../src/Distances'
import * as c from '../src/Constants'

import { Pawn } from '../src/Pawn'
import { Color } from '../src/Color'
import { MoveEnter } from '../src/MoveEnter'
import { MoveForward } from '../src/MoveForward'

import { expect } from 'chai';
import 'mocha';

describe('Filename: distances.test.ts\n\nrollDice pseudo test:', () => {
    it('should not have any number outside 0-6 for 1000 rolls', () => {		
		let arr = _.fill(new Array(1000), null).map(_ => { return d.rollDice(false); });
		let res = arr.some(distances => { return distances.some(distance => { return distance < 0 || distance > 6; }); });
        expect(res).to.equal(false);
    });
});

describe('consumeMove tests:', () => {
	let pawn: Pawn;
	
	beforeEach(() => {
        pawn = new Pawn(0, Color.Blue)
    });
	
	it("should successfully consume unique distance in array", () => {
		let old_array = [1, 3, c.VALUE_TO_ENTER_ON, 20];
		let new_array = d.consumeMove(old_array, new MoveForward(pawn, 3));

		expect(new_array).to.deep.equal([1, c.VALUE_TO_ENTER_ON, 20]);
	});

	it("should successfully consume another unique distance in array", () => {
		let old_array = [1, 3, c.VALUE_TO_ENTER_ON, 20];
		let new_array = d.consumeMove(old_array, new MoveForward(pawn, 20));

		expect(new_array).to.deep.equal([1, 3, c.VALUE_TO_ENTER_ON]);
	});

	it("should successfully consume first of duplicate distances in array", () => {
		let old_array = [1, 3, c.VALUE_TO_ENTER_ON, 20, 3];
		let new_array = d.consumeMove(old_array, new MoveForward(pawn, 3));

		expect(new_array).to.deep.equal([1, c.VALUE_TO_ENTER_ON, 20, 3]);
	});

	it("should error when asked to consume non-existent distance", () => {
		let old_array = [1, 3, c.VALUE_TO_ENTER_ON, 20];

		expect(() => { d.consumeMove(old_array, new MoveForward(pawn, 6)); }).to.throw(Error);
	});

	it("should error if no pair or number equaling five in distances on MoveEnter", () => {
		let old_array = [1, 3, 20];

		expect(() => { d.consumeMove(old_array, new MoveEnter(pawn)); }).to.throw(Error);
	});

	it("should correctly consume five on MoveEnter", () => {
		let old_array = [1, c.VALUE_TO_ENTER_ON, 2];

		let new_array = d.consumeMove(old_array, new MoveEnter(pawn));
		expect(new_array).to.deep.equal([1, 2]);
	});

	it("should correctly consume 1 and 4 in pair on MoveEnter", () => {
		let old_array = [1, 4, 20];

		let new_array = d.consumeMove(old_array, new MoveEnter(pawn));
		expect(new_array).to.deep.equal([20]);
	});

	it("should correctly consume 2 and 3 in pair on MoveEnter", () => {
		let old_array = [2, 3, 4, 20];

		let new_array = d.consumeMove(old_array, new MoveEnter(pawn));
		expect(new_array).to.deep.equal([4, 20]);
	});
});

describe('distanceInDistances test:', () => {
	it('should correctly identify if given distance in distances', () => {
		let distance: number = c.VALUE_TO_ENTER_ON;
		expect(d.distanceInDistances(distance, [c.VALUE_TO_ENTER_ON, 20])).to.equal(true);
	});
	
	it('should correctly identify if given distance in distances', () => {
		let distance: number = 2;
		expect(d.distanceInDistances(distance, [c.VALUE_TO_ENTER_ON, 2])).to.equal(true);
	});
	
	it('should correctly identify if given distance not in distances', () => {
		let distance: number = 6;
		expect(d.distanceInDistances(distance, [c.VALUE_TO_ENTER_ON, 20])).to.equal(false);
	});
});

describe('hasFive tests (implicitly tests findFive):', () => {
    it('should correctly identify if number five in possible distances', () => {
        let possibled: number[] = [c.VALUE_TO_ENTER_ON, 1];
        expect(d.hasFive(possibled)).to.equal(true);
    });

    it('should correctly identify if number five in possible distances', () => {
        let possibled: number[] = [c.VALUE_TO_ENTER_ON, 2, c.VALUE_TO_ENTER_ON, 2];
        expect(d.hasFive(possibled)).to.equal(true);
    });

    it('should correctly identify 1 and 4 combination summing to five in possible distances', () => {
        let possibled: number[] = [1, 4];
        expect(d.hasFive(possibled)).to.equal(true);
    });

    it('should correctly identify if combination summing to five in possible distances', () => {
        let possibled: number[] = [2, 3];
        expect(d.hasFive(possibled)).to.equal(true);
    });

    it('should correctly identify if no five or combination of c.VALUE_TO_ENTER_ON', () => {
        let possibled: number[] = [1, 2];
        expect(d.hasFive(possibled)).to.equal(false);
    });

    it('should correctly identify if no five or combination of c.VALUE_TO_ENTER_ON', () => {
        let possibled: number[] = [3, 4, 3, 4];
        expect(d.hasFive(possibled)).to.equal(false);
    });
});

