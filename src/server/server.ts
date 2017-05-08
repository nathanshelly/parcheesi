import express = require('express');

import { Ethernet } from '../Ethernet';
import { FirstPawnMover } from '../FirstPawnMover';

export abstract class Server {
	protected app: express.Application;
	protected n_player: Ethernet;

	constructor() {
		this.app = express();
		this.n_player = new Ethernet(new FirstPawnMover());
	}

	abstract init_routes(): void;

	abstract listen_callback(port: number): void;

	start(port: number) {
		this.init_routes();
		this.app.listen(port, this.listen_callback);
	}
}

