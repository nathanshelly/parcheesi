import { Pawn } from './Pawn'
import { Color } from './Color'

export class BoardPawn {
	pawn: Pawn;
	
	// indices -1 | [0, 71] (-1 is unentered, [0, 63] is board, [64, 71] is home row)
	// indices are delta from the color's starting spot
	position: number;

	constructor(position: number, id: number, color: Color) {
		this.position = position;
		this.pawn = new Pawn(id, color);
	}

	get_position(): number {
		return this.position;
	}

	get_color(): Color {
		return this.pawn.get_color();
	}

	get_id(): number {
		return this.pawn.get_id();
	}
}