import { _Player } from './_Player';
import { FirstPawnMover } from './FirstPawnMover';
import { _Move } from './_Move';
import { Color } from './Color';
import { Board } from './Board';

import * as enc from './Encoder';
import * as dec from './Decoder';

import request = require('sync-request');

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
		this.color = color;

		if (this.localPlayer !== null)
			return this.localPlayer.startGame(color);

		let xml = enc.colorToStartGameXML(color); // Translate color to XML

		// Post off to url, synchronously
		let res = request("POST", this.url, {
			"headers": {
				"Content-Type": "text/xml"
			},
			"body": xml
		});

		return dec.nameFromXML(res.getBody()); // Return the response
	}

	doMove(board: Board, distances: number[]): _Move[] {
		if (this.localPlayer !== null)
			return this.localPlayer.doMove(board, distances);

		let xml = enc.doMoveToXML(board, distances); // Translate board and distances to XML
		
		// Post off to url, synchronously
		let res = request("POST", this.url, {
			"headers": {
				"Content-Type": "text/xml"
			},
			"body": xml
		});
		
		return dec.movesFromXML(res.getBody()); // Return the response
	}

	doublesPenalty(): void {
		if (this.localPlayer !== null)
			this.localPlayer.doublesPenalty();

		let xml = enc.doublesPenaltyXML(); // Build the XML message

		// Post off to url, synchronously
		let res = request("POST", this.url, {
			"headers": {
				"Content-Type": "text/xml"
			},
			"body": xml
		});

		return;
	}
}

