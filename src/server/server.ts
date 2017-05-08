import express = require('express');
import * as config from './config';

import { NPlayer } from '../NPlayer';
import { FirstPawnMover } from '../FirstPawnMover';

class PlayerServer {
	private app: express.Application;
	private n_player: NPlayer;

	constructor() {
		this.app = express();
		this.n_player = new NPlayer(new FirstPawnMover());
	}

	start(port: number) {
		this.init_routes();
		this.app.listen(port, this._listen);
	}

	private _listen() {
		console.log(`Listening on port ${config.PORT}...`);
	}

	private init_routes() {
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

