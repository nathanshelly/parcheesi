import * as _ from 'lodash'
import * as c from '../src/Constants'

import { Pawn } from '../src/Pawn'
import { Color } from '../src/Color'

import { expect } from 'chai';
import 'mocha';

describe('Filename: pawn_unit.test.ts\n\nUnit tests for verify, isExpectedcolor and hasIdInLegalRange:', () => {
    it('should correctly determine that pawn is different color than passed in color', () => {
        let pawn = new Pawn(1, Color.blue);
        expect(pawn.isExpectedColor(Color.red)).to.equal(false);
    });

    it('should correctly determine that pawn is same color as passed in color', () => {
        let pawn = new Pawn(1, Color.blue);
        expect(pawn.isExpectedColor(Color.blue)).to.equal(true);
    });

    it('should correctly determine that pawn has valid id', () => {
        let pawn = new Pawn(3, Color.blue);
        expect(pawn.hasIdInLegalRange()).to.equal(true);
    });

    it('should correctly determine that pawn has invalid id', () => {
        let pawn = new Pawn(4, Color.blue);
        expect(pawn.hasIdInLegalRange()).to.equal(false);
    });

		// verify tests

		it('should correctly determine that pawn is illegal because of color', () => {
        let pawn = new Pawn(1, Color.blue);
        expect(pawn.verify(Color.red)).to.equal(false);
    });

		it('should correctly determine that pawn is illegal because of id', () => {
        let pawn = new Pawn(5, Color.blue);
        expect(pawn.verify(Color.blue)).to.equal(false);
    });

    it('should correctly determine that pawn is illegal', () => {
        let pawn = new Pawn(4, Color.blue);
        expect(pawn.verify(Color.green)).to.equal(false);
    });
		
		it('should correctly determine that pawn is legal', () => {
        let pawn = new Pawn(1, Color.blue);
        expect(pawn.verify(Color.blue)).to.equal(true);
    });
});