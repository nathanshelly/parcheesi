import express = require('express');
import * as config from './config';

class PlayerServer {
	private app: express.Application;

	constructor() {
		this.app = express();
	}

	start() {
		this.init_routes();
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
		console.log(`root request from ${req.originalUrl}, IP: ${req.ip}`);
		res.send("Hello world!");
	}

	private do_move_route(req: express.Request, res: express.Response) {
		console.log(`do_move request from ${req.originalUrl}, IP: ${req.ip}`);

		const xml: string = req.body;
		
		// const moves = nplayer.doMove(xml);

		res.set('Content-Type', 'text/xml');
		//res.send(moves);
		
		res.send("do_move out to lunch - try again later");
	}

	private start_game_route(req: express.Request, res: express.Response) {
		console.log(`start_game request from ${req.originalUrl}, IP: ${req.ip}`);
		const xml: string = req.body;

		// const name = nplayer.startGame(xml);
	
		res.set('Content-Type', 'text/xml');
		// res.send(name);

		res.send("start_game out to dinner - try again tomorrow");
	}
}

const s = new PlayerServer();
s.start();

