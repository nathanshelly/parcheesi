import * as e from './Encoder'
import * as d from './Decoder'

import { Board } from './Board'
import { _Move } from './_Move'
import { _Player } from './_Player'

export class Ethernet {
	player: _Player;

	constructor(player: _Player) {
		this.player = player;
	}

	getPlayerMoves(board_string: string): string {
		let board: Board, dice: number[];
		[board, dice] = d.doMoveXMLToBoardDice(board_string);
		return e.movesToMovesXML(this.player.doMove(board, dice));
	}

	startGameForPlayer(start_game: string): string {
		return e.nameResponseXML(this.player.startGame(d.startGameXMLToColor(start_game)));
	}

	// no XML translation needed because no arguments
	doublesPenaltyToPlayer(): string {
		this.player.doublesPenalty();
		return e.doublesPenaltyResponse();
	}
}