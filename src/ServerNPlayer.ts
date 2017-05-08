import { _Player } from './_Player';
import { FirstPawnMover } from './FirstPawnMover';
import { _Move } from './_Move';
import { Color } from './Color';
import { Board } from './Board';

export class ServerNPlayer implements _Player {
	url: string | null;
	private localPlayer: _Player | null;

	color: Color;

	constructor(url: string | null) {
		this.url = url;

		if (url === null)
			this.localPlayer = new FirstPawnMover();
		else
			this.localPlayer = null;
	}

	startGame(color: Color): string {
		if (this.localPlayer !== null)
			return this.localPlayer.startGame(color);

		// Translate color to XML
		// Post off to url
		// Return the response
	}

	doMove(board: Board, distances: number[]): _Move[] {
		if (this.localPlayer !== null)
			return this.localPlayer.doMove(board, distances);

		// Translate board and distances to XML
		// Post off to url
		// Return the response
	}

	doublesPenalty(): void {
		if (this.localPlayer !== null)
			this.localPlayer.doublesPenalty();

		// Build the XML message
		// Post off to url
		// Return
	}
}

