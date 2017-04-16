export enum Color {
	Blue = 0,
	Red = 1,
	Green = 2,
	Yellow = 3
}

export function colorForIndex(ind: number): Color {
	switch (ind) {
		case 0: return Color.Blue
		case 1: return Color.Red
		case 2: return Color.Green
		case 3: return Color.Yellow
		default: throw new Error("No color for that index!");
	}
}