import { Color } from './Color'
import { _Spot } from './_Spot'

export class Pawn {
	id: number;
  color: Color;

	spot: _Spot;

  constructor(id: number, color: Color, spot: _Spot) {
    this.id = id;
    this.color = color;
		this.spot = spot;
  }
}