import { Color } from './Color'

export class Pawn {
  // id
	id: number;
  color: Color;
  constructor(id: number, color: Color) {
    this.id = id;
    this.color = color;
  }

	get_color(): Color {
		return this.color;
	}

	get_id(): number {
		return this.id;
	}
}