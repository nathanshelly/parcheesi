import express = require('express');
import http = require('http');
let socketio = require('socket.io-client');

import { Ethernet } from '../Ethernet';
import { FirstPawnMover } from '../FirstPawnMover';

import * as config from './player_config';

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

		// Patch in the "listen to all events" middleware
		let patch = require('socketio-wildcard')(socketio.Manager);
		this.io = socketio(url);
		patch(this.io);

		// Check connection
		this.io.on('connect', () => {
			console.log('connected on client')
		});

		// Log disconnects
		this.io.on('disconnect', () => {
			console.log('disconnected on client');
		});

		// Prep to listen for commands from the game
		let message: string = ""
		this.io.on('*', packet => {

			let data = packet.data;
			console.log(`Emit event name: ${data[0]}`);

			let partial = data[1];
			message += partial;

			console.log(message);
		});
	}

	start(port: number) {
		this.app.listen(port, () => { this.listen_callback(port) });

		this.connectSocket();
	}
}

const s = new PlayerServer();
s.start(config.PORT);
