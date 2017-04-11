class BoardPawn {
	pawn: Pawn;
	
	// indices -1 | [0, 71] (-1 is unentered, [0, 63] is board, [64, 71] is home row)
	// indices are delta from the color's starting spot
	position: number;

	get_color(): Color {
		return this.pawn.color;
	}

	get_id(): number {
		return this.pawn.id;
	}
}