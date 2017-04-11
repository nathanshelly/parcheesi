class ParcheesiBoard implements _Board {
	pawns: BoardPawns;

	constructor(players: _Player[]) {
		this.pawns = {};
		players.forEach(player => {
			this.pawns[player.color] = {
				0: new BoardPawn(-1, 0, player.color),
				1: new BoardPawn(-1, 1, player.color),
				2: new BoardPawn(-1, 2, player.color),
				3: new BoardPawn(-1, 3, player.color)
			}
		}); 
	}

	get_matching_board_pawn(pawn: Pawn): BoardPawn {
		return this.pawns[pawn.get_color()][pawn.get_id()];
	}

	// move board_pawn distance given by passed in move
	// invariant: all passed in moves are legal (invariant imposed by calling function)
	makeMove(move: EnterMove | MoveHome | MoveMain): boolean {
		let pawn = move.pawn;
		let board_pawn = this.pawns[pawn.get_color()][pawn.get_id()];
		
		this.updatePosition(move, board_pawn)
		let bopped_pawn = this.checkForBop(board_pawn)
		if(bopped_pawn) {
			bopped_pawn.position = -1;
			return true;
		}

		return false;		
	};

	// update board_pawn position
	updatePosition(move: EnterMove | MoveHome | MoveMain, board_pawn: BoardPawn): void {
		if (move instanceof EnterMove) {
			board_pawn.position = 0;
		}
		else {
			board_pawn.position += move.distance;
		}
	};

	// check if move has bopped opponent pawn
	checkForBop(board_pawn: BoardPawn): BoardPawn | null {
		for (let color in this.pawns) {
			let int_color = parseInt(color)
			if(int_color != board_pawn.get_color()) {
				for(let id in this.pawns[int_color]) {
					let temp_board_pawn = this.pawns[int_color][parseInt(id)];
					if(this.checkIntersection(temp_board_pawn, board_pawn)) {
						return temp_board_pawn;
					}
				}
			}
		}
		return null;
	};
	
	// returns empty list if no blockades
	findBlockadeWithinColor(color: Color): BoardPawn[] {
		let blockade_pawns: BoardPawn[] = [];
		let this_color_pawns: ColorPawns = this.pawns[color];
		for(let i = 0; i < Object.keys(this_color_pawns).length; i++) {
			for(let j = 0; j < i; j++) {
				if(this_color_pawns[i].get_position() == this_color_pawns[j].get_position()) {
					blockade_pawns.push(this_color_pawns[i]);
				}
			}
		}
		return blockade_pawns;
	}

	// returns blockades represented as list of boardPawns
	// pawns contain position and color
	findBlockades(): BoardPawn[] {
		let blockade_pawns: BoardPawn[] = [];
		for (let color in this.pawns) {
			let int_color = parseInt(color)
			blockade_pawns = blockade_pawns.concat(this.findBlockadeWithinColor(int_color));
		}
		return blockade_pawns;
	}
	
	checkIntersection(first_pawn: BoardPawn, second_pawn: BoardPawn): boolean {
		let [lower_color, offset] = this.colorOffset(first_pawn.get_color(), second_pawn.get_color())
		let [lower_pawn, higher_pawn] = first_pawn.get_color() == lower_color ? [first_pawn, second_pawn] : [second_pawn, first_pawn];
		
		return (lower_pawn.position + offset) == higher_pawn.get_position();
	}

	colorOffset(first_color: Color, second_color: Color): [Color, number] {
		let offset = 17 * Math.abs(first_color - second_color);
		let lower_color = first_color < second_color ? first_color : second_color;
		return [lower_color, offset]
	}
 }

// all pawns, keyed by color to
// get dict of pawns belonging to color
interface BoardPawns {
	[color: number]: ColorPawns;
}

// pawns belonging to color, keyed by id
interface ColorPawns {
	[id: number]: BoardPawn;
}