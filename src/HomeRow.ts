import * as c from './Constants'
import { Color } from './Color'
import { HomeRowSpot } from './HomeRowSpot'
import { HomeSpot } from './HomeSpot'
import * as _ from 'lodash'

export class HomeRow {
    color: Color;
    home_row: HomeRowSpot[];
    home_spot: HomeSpot;

    constructor(color: Color) {
        this.color = color;
        this.home_row = _.fill(new Array(c.HOME_ROW_SIZE), null).map((e, i) => { return new HomeRowSpot(i) });
        this.home_spot = new HomeSpot();
    }
}