import express = require('express');

import { NPlayer } from '../NPlayer';
import { FirstPawnMover } from '../FirstPawnMover';

export abstract class Server {
	protected app: express.Application;
	protected n_player: NPlayer;

	constructor() {
		this.app = express();
		this.n_player = new NPlayer(new FirstPawnMover());
	}

	abstract init_routes(): void;

	abstract listen_callback(port: number): void;

	start(port: number) {
		this.init_routes();
		this.app.listen(port, this.listen_callback);
	}
}

