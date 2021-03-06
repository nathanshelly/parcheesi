import * as enc from './Encoder'
import * as dec from './Decoder'

import * as _ from 'lodash'

import { Board } from './Board'
import { _Move } from './_Move'
import { _Player } from './_Player'

export class Ethernet {
	player: _Player;

	constructor(player: _Player) {
		this.player = player;
	}

	interpret(xml: string): string {
		let tag = xml.substring(1, xml.indexOf('>'));

		switch (tag) {
			case "start-game":
				return this.startGameForPlayer(xml);
			case "do-move":
				return this.getPlayerMoves(xml);
			case "doubles-penalty":
				return this.doublesPenaltyToPlayer();
			default: {
				console.log(tag);
				throw `Couldn't identify tag: ${tag}`;
			}
		}
	}

	getPlayerMoves(board_string: string): string {
		let board: Board, dice: number[];
		[board, dice] = dec.doMoveXMLToBoardDice(board_string);
		
		let cache: Board = _.cloneDeep(board);
		return enc.movesToMovesXML(this.player.doMove(board, dice), cache);
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
