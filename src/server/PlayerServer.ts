import express = require('express');
import * as config from './player_config';

import { Server } from './Server';

class PlayerServer extends Server {
	constructor() {
		super();
	}

	listen_callback(port: number) {
		console.log(`Listening on port ${port}...`);
	}

	init_routes() {
		this.app.get('/', this.root_route);
		this.app.post('/do_move', this.do_move_route);
		this.app.post('/start_game', this.start_game_route);
	}

	private root_route(req: express.Request, res: express.Response) {
		console.log(`root request from ${req.originalUrl}, IP: ${req.ip}`);
		res.send("Hello world!");
	}

	private do_move_route(req: express.Request, res: express.Response) {
		console.log(`do_move request from ${req.originalUrl}, IP: ${req.ip}`);

		const xml_string: string = req.body;
	
		const moves = this.n_player.getPlayerMoves(xml_string);

		res.set('Content-Type', 'text/xml');
		res.send(moves);
	}

	private start_game_route(req: express.Request, res: express.Response) {
		console.log(`start_game request from ${req.originalUrl}, IP: ${req.ip}`);
		const xml_string: string = req.body;

		const name = this.n_player.startGameForPlayer(xml_string);
	
		res.set('Content-Type', 'text/xml');
		res.send(name);
	}
}

const s = new PlayerServer();
s.start(config.PORT);

