import express = require('express');

import net = require('net');

import { Ethernet } from '../Ethernet';
import { FirstPawnMover } from '../FirstPawnMover';

import * as config from './player_config';

class PlayerServer {
	private app: express.Application;
	private socket; // net socket - I don't think this has typings?
	
	private n_player: Ethernet;

	constructor() {
		this.app = express();
		this.socket = new net.Socket();

		this.n_player = new Ethernet(new FirstPawnMover());
	}

	private listen_callback(port: number) {
		console.log(`Player server listening on port ${port}...`);
	}

	private connectSocket() {
		let url = config.SERVER_URL;
		let port = config.SERVER_PORT;
		console.log(`attempting to connect to ${url}...`);

		this.socket.on('data', data => {
			console.log(`Received data: ${data}`);
			let xml: string = data.toString();

			let response: string = this.n_player.interpret(xml);
			console.log(`Responding with: ${response}\n`);

			this.socket.write(response);
		});

		this.socket.on('close', () => {
			console.log("Socket closed...");
		});

		this.socket.connect(config.SERVER_PORT, config.SERVER_URL, () => {
			console.log("Socket connected...");
		});
	}

	start(port: number) {
		this.app.listen(port, () => { this.listen_callback(port) });

		this.connectSocket();
	}
}

const s = new PlayerServer();
s.start(config.PORT);
