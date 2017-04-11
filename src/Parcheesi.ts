import { _Game } from './_Game'
import { _Player } from './_Player'
import { _Move } from './_Move'
import { ParcheesiBoard } from './ParcheesiBoard'
import { Color } from './Color'
import { EnterMove } from './EnterMove'
import { BoardPawn } from './BoardPawn'

export class Parcheesi implements _Game {
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

	buildBoard() {
		this.board = new ParcheesiBoard(this.players);
	}
  
  	// start a game
  	start() : void {
		this.buildBoard();

		let colors = [Color.Blue, Color.Red, Color.Green, Color.Yellow]
		this.players.forEach(element => {
			element.startGame(colors.pop());
		});

		let ind = 0;
		while(!this.board.winner()) {
			let player = this.players[ind];
			ind = (ind + 1) % this.players.length;
			
			// TODO: pass board by value, prevent modifications by player to board
			let results: [[number, number][], boolean] = this.getTurnDicePairs();
			let turn_dice_pairs: [number, number][] = results[0];
			let triple_doubles: boolean = results[1];

			// run each move in order
			let cheat: boolean = turn_dice_pairs.every(turn_dice_pair => {
				if(this.handleDiceMove(this.board, turn_dice_pair, player))
					return false;
				else
					return true;
			});

			// triple_doubles penalty
			if(triple_doubles) {
				// triple doubles -> ya fucked up, move farthest pawn back to start
			}
		}
	};

	handleDiceMove(board: _Board, dice: [number, number], player: _Player): boolean {
		// ask player for moves
		let moves: [_Move, _Move] = player.doMove(this.board, dice);
		// double bonus -> move by tops and bottoms of dice 
		// double repeat -> 'nother turn
		// need to give all four dice at once (or handle in player? have to catch that as cheating case)

		if (this.isCheat(moves, dice, player)){
			// kick player out of game
			delete this.board.pawns[player.color];

			let index: number = this.players.indexOf(player);
			this.players.splice(index, 1);
		}
		else {
			// TODO: reward bops and home moves
			// bop bonus -> if bopped, get extra 20 move
			// home bonus -> move into home, get extra 10 move 
			// have board.makeMove() differentiate between case
			let extraMoves = moves.map(m => {
				this.board.makeMove(m);
			});
		}
	}

	isCheat(moves: [_Move, _Move], dice: [number, number], player: _Player): boolean {
		return this.enteredWithoutFive(moves, dice) || this.moveUnenteredPawn(moves) || this.invalidColor(moves, player)
					 || this.invalidStartPosition(moves) || this.invalidPositionDelta(moves, dice) || this.ranIntoBlockade(moves)
					 || this.moveOutOfRange(moves);
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
			let moved_board_pawn: BoardPawn = new BoardPawn(move_board_pawn.get_position() + move.distance, move_board_pawn.get_id(), move_board_pawn.get_color());
			blockades.forEach(blockade_pawn => {
				if(this.board.checkIntersection(blockade_pawn, moved_board_pawn)) {
					hit_blockade = true;
				}
			});
			return hit_blockade;
		}).length > 0;
	}

	moveOutOfRange (moves: [_Move, _Move]): boolean {
		return !moves.every(m => {
			return (m.start + m.distance) < 72
		});
	}

	getTurnDicePairs(): [[number, number][], boolean] {
		let potential_dice_pairs: [number, number][] = this.getPotentialTurnDicePairs();
		let doubles = potential_dice_pairs.map(dice_pair => {
			return dice_pair[0] == dice_pair[1];
		});

		let final_turn_dice_pairs: [number, number][] = []
		final_turn_dice_pairs.push(potential_dice_pairs[0])
		let triple_doubles: boolean = false;

		if(doubles[0]) {
			final_turn_dice_pairs.push(potential_dice_pairs[1])
			if(doubles[1]) {
				if(doubles[2]) {
					triple_doubles = true;
				}
				else {
					final_turn_dice_pairs.push(potential_dice_pairs[2])
				}
			}	
		}

		return [final_turn_dice_pairs, triple_doubles]
	}

	getPotentialTurnDicePairs(): [number, number][] {
		// generates 3-tuple of dice pairs, the player will play the first one
		// and potentially the others as governed by getTurnDicePairs
		return [this.rollTwoDice(), this.rollTwoDice(), this.rollTwoDice()];
	}

	rollTwoDice(): [number, number] {
		return [Math.floor(6 * Math.random()), Math.floor(6 * Math.random())]
	}
}