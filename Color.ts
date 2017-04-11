enum Color {
	Blue,
	Red,
	Green,
	Yellow
}

function colorForIndex(ind: number): Color {
	switch (ind) {
		case 0: return Color.Blue
		case 1: return Color.Red
		case 2: return Color.Green
		case 3: return Color.Yellow
	}
}