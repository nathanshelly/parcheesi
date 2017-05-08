import * as t from './Translator'

import { Board } from './Board'
import { _Move } from './_Move'
import { _Player } from './_Player'

export class NPlayer {
	player: _Player;

	constructor(player: _Player) {
		this.player = player;
	}

	getPlayerMoves(board_string: string): _Move[] {
		let board: Board, dice: number[];
		[board, dice] = t.translateXMLToBoard(board_string);
		return t.translateMovesToXML(this.player.doMove(board, dice));
	}

	startGameForPlayer(start_game: string): string {
		return this.player.startGame(t.translateStartGameXMLToColor(start_game));
	}

	doublesPenaltyToPlayer() {
		this.player.doublesPenalty();
	}
}