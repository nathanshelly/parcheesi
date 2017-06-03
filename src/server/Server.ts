import express = require('express');

export abstract class Server {
	protected app: express.Application;

	constructor() {
		this.app = express();
	}

	abstract start(port: number);
}

