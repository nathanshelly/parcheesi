import * as c from './Constants'
import { Color } from './Color'
import { HomeRowSpot } from './HomeRowSpot'
import { HomeSpot } from './HomeSpot'
import { Position } from './Position'
import * as _ from 'lodash'

export class HomeRow {
    color: Color;
    row: HomeRowSpot[];
    spot: HomeSpot;

    constructor(color: Color) {
        this.color = color;
        this.row = _.fill(new Array(c.HOME_ROW_SIZE), null).map((e, i) => { return new HomeRowSpot(new Position(c.HOME_ROW_BY_COLOR[color], i)) });
        this.spot = new HomeSpot(new Position(c.HOME_ROW_BY_COLOR[color], c.HOME_ROW_SIZE));
    }
}