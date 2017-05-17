import express = require('express');
import http = require('http');
import socketio = require('socket.io');

import _ = require('lodash');

import { ServerNPlayer } from '../ServerNPlayer';
import { FirstPawnMover } from '../FirstPawnMover';
import { Parcheesi } from '../Parcheesi';

import * as c from '../Constants';
import * as config from './game_config';

let middleware = require('socketio-wildcard')();

class GameServer {
	private app: express.Application;
	private server: http.Server;
	private io: SocketIO.Server;

	private game: Parcheesi;

	constructor() {
		this.app = express();
		this.server = http.createServer(this.app);

		this.io = socketio(this.server);
		this.io.use(middleware);

		this.game = new Parcheesi();

		let players = _.fill(new Array(c.NUM_PLAYERS - 1), new FirstPawnMover());
		players.forEach((p) => {
			this.game.register(p);
		});
	}

	private listen_callback(port: number) {
		console.log(`Game server listening on port ${port}...`);
	}

	private socketConnected(socket: SocketIO.Server) {
		console.log("socket is connected!");

		socket.on('*', packet => {
			console.log("Packet came in!!");
			console.log(packet, "\n");
		});

		while(true) {

			// Wait for one second
			let then = new Date().getTime() + 1000;
			while (new Date().getTime() <= then) {}
			
			socket.emit('test_from_server', "patootie");
		}
	}

	start(port: number) {
		this.app.listen(port, () => { this.listen_callback(port) });

		// Start the game for each AI player
		this.game.players.forEach((p, i) => {
			p.startGame(i);
		});

		// Prep the socket to listen for connections
		this.io.on('connection', this.socketConnected);
	}
}

const s = new GameServer();
s.start(config.PORT);
