import express = require('express');
import _ = require('lodash');

import { Server } from './Server';
import { ServerNPlayer } from '../ServerNPlayer';
import { Parcheesi } from '../Parcheesi';
import * as c from '../Constants';
import * as config from './game_config';

class GameServer extends Server {
	private game: Parcheesi;

	constructor() {
		super();

		this.game = new Parcheesi();
		
		const players = this.init_players();
		players.forEach((p) => {
			this.game.register(p);
		});
	}

	private init_players(): ServerNPlayer[] {
		const p_urls = config.PLAYER_URLS;

		let n_locals = c.NUM_PLAYERS - p_urls.length;
		let filler = _.fill(new Array(n_locals), null);
		filler.push.apply(filler, p_urls);

		return filler.map((p) => {
			return new ServerNPlayer(p);
		});
	}

	private listen_callback(port: number) {
		console.log(`Game server listening on port ${port}...`);
	}

	start(port: number) {
		this.app.listen(port, () => { this.listen_callback(port) });

		// Start the game for each player
		this.game.players.forEach((p, i) => {
			p.startGame(i);
		});

		this.game.start();
	}
}

const s = new GameServer();
s.start(config.PORT);

