import * as enc from './Encoder'
import * as dec from './Decoder'

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
		[board, dice] = dec.doMoveXMLToBoardDice(board_string);
		return enc.movesToMovesXML(this.player.doMove(board, dice));
	}

	startGameForPlayer(start_game: string): string {
		return enc.nameResponseXML(this.player.startGame(dec.startGameXMLToColor(start_game)));
	}

	// no XML translation needed because no arguments
	doublesPenaltyToPlayer(): string {
		this.player.doublesPenalty();
		return enc.voidXML();
	}
}
