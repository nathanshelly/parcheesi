import * as c from './Constants'

import { Color } from './Color'
import { _Spot } from './_Spot'

export class Pawn {
	id: number;
  color: Color;

  constructor(id: number, color: Color) {
    this.id = id;
    this.color = color;
  }

  // ? Prevent people from making illegal pawns in the first place?

  // verify that pawn is correct:
  // pawn's color matches player
  // pawn's ID is legal
  verify(color: Color): boolean {
    return this.isExpectedColor(color) && this.hasIdInLegalRange();
  }

  isExpectedColor(color: Color): boolean { return this.color === color; }

  hasIdInLegalRange(): boolean {
    return this.id < c.NUM_PLAYER_PAWNS && this.id >= 0;
  }
}