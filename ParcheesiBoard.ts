class ParcheesiBoard implements _Board {
	pawns: BoardPawns;

	// move board_pawn distance given by passed in move
	// invariant: all passed in moves are legal (invariant imposed by calling function)
	makeMove(move: EnterMove | MoveHome | MoveMain): boolean {
		let pawn = move.pawn;
		let board_pawn = this.pawns[pawn.color][pawn.id];
		
		this.updatePosition(move, board_pawn)
		let bopped_pawn = this.checkForBop(board_pawn)
		if(bopped_pawn) {
			this.pawns[bopped_pawn.get_color()][bopped_pawn.get_id()].position = -1;
			return true;
		}

		return false;		
	};

	// update board_pawn position
	updatePosition(move: EnterMove | MoveHome | MoveMain, board_pawn: BoardPawn): void {
		if (move instanceof EnterMove) {
			board_pawn.position = 0;
		}
		else if (move instanceof MoveMain) {
			board_pawn.position += (move as MoveMain).distance;
		}
		else {
			board_pawn.position += (move as MoveHome).distance;
		}
	}

	// check if move has bopped opponent pawn
	checkForBop(board_pawn: BoardPawn): BoardPawn | null {
		for (let color in this.pawns) {
			let int_color = parseInt(color)
			if(int_color != board_pawn.get_color()) {
				for(let id in this.pawns[int_color]) {
					let temp_board_pawn = this.pawns[int_color][parseInt(id)];
					if(temp_board_pawn.position == board_pawn.position) {
						return temp_board_pawn;
					}
				}
			}
		}
		return null;
	}	
}


// all pawns, keyed by color to
// get dict of pawns belonging to color
interface BoardPawns {
	[color: number]: PawnsForPlayer;
}

// pawns belonging to color, keyed by id
interface PawnsForPlayer {
	[id: number]: BoardPawn;
}