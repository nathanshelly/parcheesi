class Parcheesi implements _Game {
	players: _Player[];
	board: ParcheesiBoard;
	// add a player to the game
  register(p: _Player): void {
		if (this.players.length > 3) {
			// fail silently for now
		}
		else {
			this.players.push(p);
		}
	};
  
  // start a game
  start() : void {
		let colors = [Color.Red, Color.Blue, Color.Green, Color.Yellow]
		this.players.forEach(element => {
			element.startGame(colors.pop());
		});

		while(!this.board.winner()) {
			this.players.forEach(player => {
				// TODO: pass board by value
				let dice: [number, number] = [Math.floor(6 * Math.random()), Math.floor(6 * Math.random())];
				let moves: [_Move, _Move] = player.doMove(this.board, dice);

				if (this.isCheat(moves, dice, player)){
					// kick player out of game
					delete this.board.pawns[player.color];

					let index: number = this.players.indexOf(player);
					this.players.splice(index, 1);
				}
				else {
					// TODO: make each move, reward bops and doubles appropriately

				}
			});
		}

	};

	isCheat(moves: [_Move, _Move], dice: [number, number], player: _Player): boolean {
		return this.enteredWithoutFive(moves, dice) || this.moveUnenteredPawn(moves) || this.invalidColor(moves, player)
					 || this.invalidStartPosition(moves) || this.invalidPositionDelta(moves, dice) || this.ranIntoBlockade(moves);
	}

	enteredWithoutFive (moves: [_Move, _Move], dice: [number, number]): boolean {
		let enters = dice.filter(function(die) {return die == 5;}).length;
		moves.forEach(move => {
			if(move instanceof EnterMove && enters > 0)
				enters--;
			else
				return true;
		});
		return false;
	}

	moveUnenteredPawn (moves: [_Move, _Move]): boolean {
		return moves.filter(move => {
				return !(move instanceof EnterMove) && this.board.get_matching_board_pawn(move.pawn).position == -1;
			}).length > 0;
	}

	invalidColor (moves: [_Move, _Move], player: _Player): boolean {
		return moves.filter(move => {return move.pawn.get_color() == player.color;}).length != 2;
	}

	// they must specify start as offset from their home
	invalidStartPosition (moves: [_Move, _Move]): boolean {
		return moves.filter(move => {
			return this.board.get_matching_board_pawn(move.pawn).position == move.start;
		}).length > 0;
	}

	invalidPositionDelta (moves: [_Move, _Move], dice: [number, number]): boolean {
		let dice_two: [number, number] = [dice[0], dice[1]];
		return moves.filter(move => {
			let matched_die_index: number = dice_two.indexOf(move.distance);
			if(matched_die_index != -1) {
				dice_two.splice(matched_die_index, 1);
			}
			return matched_die_index == -1 ? true : false;
		}).length > 0;
	}

	ranIntoBlockade (moves: [_Move, _Move]): boolean {
		let blockades: BoardPawn[] = this.board.findBlockades();
		return moves.filter(move => {
			let hit_blockade = false;
			let move_board_pawn: BoardPawn = this.board.get_matching_board_pawn(move.pawn);
			let moved_board_pawn: BoardPawn = new BoardPawn(move_board_pawn.get_position(), move_board_pawn.get_id(), move_board_pawn.get_color());
			blockades.forEach(blockade_pawn => {
				if(this.board.checkIntersection(blockade_pawn, moved_board_pawn)) {
					hit_blockade = true;
				}
			});
			return hit_blockade;
		}).length > 0;
	}
}