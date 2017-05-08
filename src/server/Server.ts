import express = require('express');

import { FirstPawnMover } from '../FirstPawnMover';

export abstract class Server {
	protected app: express.Application;

	constructor() {
		this.app = express();
	}

	abstract start(port: number);
}

