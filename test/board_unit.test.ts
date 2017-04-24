import * as _ from 'lodash'
import * as c from '../src/Constants'
import * as tm from './testMethods'

import { Pawn } from '../src/Pawn'
import { Color } from '../src/Color'
import { _Player } from '../src/_Player'

import { _Move } from '../src/_Move'
import { MoveEnter } from '../src/MoveEnter'
import { MoveForward } from '../src/MoveForward'

import { _Spot } from '../src/_Spot'
import { BaseSpot } from '../src/BaseSpot'
import { HomeSpot } from '../src/HomeSpot'
import { HomeRowSpot } from '../src/HomeRowSpot'
import { MainRingSpot } from '../src/MainRingSpot'

import { expect } from 'chai'
import 'mocha'

describe("Filename: board_unit.test.ts\n\nThe board's move-making functionality", () => {
    it("should perform entrance moves correctly", () => {
        expect(0).to.equal(1);
    });

    it("should advance spots in the main ring correctly", () => {
        expect(0).to.equal(1);
    });

    it("should advance spots from the main ring to the home row correctly", () => {
        expect(0).to.equal(1);
    });

    it("should advance spots from the main ring to the home spot correctly", () => {
        expect(0).to.equal(1);
    });

    it("should advance spots in the home row correctly", () => {
        expect(0).to.equal(1);
    });

    it("should advance spots from the home row to the home spot correctly", () => {
        expect(0).to.equal(1);
    });

    it("should perform forward moves from the main ring to the main ring correctly", () => {
        expect(0).to.equal(1);
    });

    it("should perform forward moves from the main ring to the home row correctly", () => {
        expect(0).to.equal(1);
    });

    it("should perform forward moves from the home row to the home row correctly", () => {
        expect(0).to.equal(1);
    });

    it("should perform forward moves from the main ring to the home spot correctly", () => {
        expect(0).to.equal(1);
    });

    it("should perform forward moves from the home row to the home spot correctly", () => {
        expect(0).to.equal(1);
    });

    it("should correctly form blockades on the main ring", () => {
        expect(0).to.equal(1);
    });

    it("should correctly form blockades on the home row", () => {
        expect(0).to.equal(1);
    });
});

describe("The board's bonus functionality", () => {
    it("should confer a bonus upon landing on the home spot", () => {
        expect(0).to.equal(1);
    });

    it("should detect that a landing on the main ring from the main ring will bop correctly", () => {
        expect(0).to.equal(1);
    });
    
    it("should detect that a landing on the main ring from a base will bop correctly", () => {
        expect(0).to.equal(1);
    });

    it("should detect that a landing will bop in the main ring", () => {
        expect(0).to.equal(1);
    });

    it("should confer a bonus and send back a pawn upon a bop from a forward move", () => {
        expect(0).to.equal(1);
    });

    it("should confer a bonus and send back a pawn upon a bop from an entrance move", () => {
        expect(0).to.equal(1);
    });
});

describe("The board's locating functionality", () => {
    it("should find a pawn in the base correcty", () => {
        expect(0).to.equal(1);
    });

    it("should find a pawn in the main ring correctly", () => {
        expect(0).to.equal(1);
    });

    it("should find a pawn in the home row correctly", () => {
        expect(0).to.equal(1);
    });

    it("should find a pawn in the home spot correctly", () => {
        expect(0).to.equal(1);
    });

    it("should detect that a pawn is in the base correctly", () => {
        expect(0).to.equal(1);
    });

    it("should detect that a pawn is not in the base correctly", () => {
        expect(0).to.equal(1);
    });

    it("should get a base spot with pawns on it correctly", () => {
        expect(0).to.equal(1);
    });

    it("should get main ring spots with pawns on them correctly", () => {
        expect(0).to.equal(1);
    });

    it("should get home row spots with pawns on them correctly", () => {
        expect(0).to.equal(1);
    });

    it("should get a base, main ring spot, home row spot, and home spot, all with pawns on them, correctly", () => {
        expect(0).to.equal(1);
    });
});

describe("The board's end-game functionality", () => {
    it("should accurately determine if there is a winner", () => {
        expect(0).to.equal(1);
    });
});