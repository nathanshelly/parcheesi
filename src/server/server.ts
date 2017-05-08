import express = require('express');
import * as config from './config';

import { Color } from '../Color';
import { Pawn } from '../Pawn';

class PlayerServer {
	app: express.Application;

	constructor() {
		this.app = express();
	}

	start() {
		this.app.listen(config.PORT, this._listen);
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
		res.send("Hello world!");
	}

	private do_move_route(req: express.Request, res: express.Response) {
		const xml: string = req.body;
		
		// const moves = nplayer.doMove(xml);

		res.set('Content-Type', 'text/xml');
		//res.send(moves);
	}

	private start_game_route(req: express.Request, res: express.Response) {
		const xml: string = req.body;

		// const name = nplayer.startGame(xml);
	
		res.set('Content-Type', 'text/xml');
		// res.send(name);
	}
}

