import * as c from './Constants'
import { Color } from './Color'
import { HomeRowSpot } from './HomeRowSpot'
import { HomeSpot } from './HomeSpot'
import * as _ from 'lodash'

export class HomeRow {
    color: Color;
    row: HomeRowSpot[];
    spot: HomeSpot;

    constructor(color: Color) {
        this.color = color;
        this.row = _.fill(new Array(c.HOME_ROW_SIZE), null).map((e, i) => { return new HomeRowSpot(i) });
        this.spot = new HomeSpot();
    }
}