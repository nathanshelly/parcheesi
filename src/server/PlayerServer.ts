import express = require('express');
import http = require('http');
import socketio = require('socket.io-client');

import { Ethernet } from '../Ethernet';
import { FirstPawnMover } from '../FirstPawnMover';

import * as config from './player_config';

let middleware = require('socketio-wildcard')();

class PlayerServer {
	private app: express.Application;
	private server: http.Server;
	private io: SocketIO.Socket;

	private n_player: Ethernet;

	constructor() {
		this.app = express();
		this.server = http.createServer(this.app);

		this.n_player = new Ethernet(new FirstPawnMover());
	}

	private listen_callback(port: number) {
		console.log(`Player server listening on port ${port}...`);
	}

	private connectSocket() {
		let url = config.SERVER_URL;
		
		console.log(`attempting to connect to ${url}...`);
		this.io = socketio(url);

		// Patch in the "listen to all events" middleware
		let patch = require('socketio-wildcard')(socketio.Manager);
		patch(this.io);

		// Prep to listen for commands from the game
		this.io.on('*', packet => {
			console.log("Packet came in!!");
			console.log(packet, "\n");
		});
	}

	start(port: number) {
		this.app.listen(port, () => { this.listen_callback(port) });

		this.connectSocket();
	}
}

const s = new PlayerServer();
s.start(config.PORT);
