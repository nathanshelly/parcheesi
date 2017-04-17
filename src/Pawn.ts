import { Color } from './Color'
import { Position } from '../src/Position'

export class Pawn {
	id: number;
  color: Color;
	position: Position;

  constructor(id: number, color: Color, position: Position) {
    this.id = id;
    this.color = color;
		this.position = position;
  }

	get_color(): Color {
		return this.color;
	}

	get_id(): number {
		return this.id;
	}

	get_position(): Position {
		return this.position;
	}
}