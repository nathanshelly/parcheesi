import * as c from './Constants'
import { Color } from './Color'
import { HomeRowSpot } from './HomeRowSpot'
import { HomeSpot } from './HomeSpot'

export class HomeRow {
    color: Color;
    home_row: HomeRowSpot[];
    home_spot: HomeSpot;

    constructor(color: Color) {
        this.color = color;
        this.home_row = (new Array(c.HOME_ROW_SIZE)).map((e, i) => { return new HomeRowSpot(i) });
        this.home_spot = new HomeSpot();
    }
}