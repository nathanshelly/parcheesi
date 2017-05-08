import express = require('express');

import { Server } from './Server';
import { ServerNPlayer } from '../ServerNPlayer';
import * as c from '../Constants';
import * as config from './game_config';

class GameServer extends Server {
	players: ServerNPlayer[];

	constructor() {
		super();

		const p_urls = config.PLAYER_URLS;

		let n_locals = c.NUM_PLAYERS - p_urls.length;
		
	}

	init_routes() {};

	listen_callback(port: number) {
		console.log(`Listening on port ${port}`);
	}


}
