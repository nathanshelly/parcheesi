import * as express from 'express'
import * as http from 'http'

import * as net from 'net'

import { Ethernet } from '../Ethernet';
import { FirstPawnMover } from '../FirstPawnMover'
import { _Player } from '../_Player';

import { Coach } from '../rocky/Coach'

import * as config from './player_config';

export class PlayerServer {
	private app: express.Application;
	private socket; // net socket - I don't think this has typings?
	
	private n_player: Ethernet;

	constructor(player: _Player) {
		this.app = express();
		this.socket = new net.Socket();

		this.n_player = new Ethernet(player);
	}

	private connectSocket(verbose: boolean, connectCallback?: () => void) {
		let url = config.SERVER_URL;
		let port = config.SERVER_PORT;
		if (verbose)
			console.log(`attempting to connect to ${url}...`);

		let xml: string = '';
		this.socket.on('data', data => {
			if (verbose)
				console.log(`Received data: ${data}`);

			xml += data.toString();

			let newline_ind = xml.indexOf("\n");

			if (newline_ind != -1) {
				let command = xml.slice(0, newline_ind);
				xml = "";

				let response: string = this.n_player.interpret(command);
				if (verbose)
					console.log(`Responding with: ${response}\n`);

				this.socket.write(response);
			}
		});

		this.socket.on('close', () => {
			if (verbose)
				console.log("Socket closed...");
		});

		this.socket.connect(config.SERVER_PORT, config.SERVER_URL, () => {
			if (connectCallback) { connectCallback() };
		});
	}

	start(port: number, verbose: boolean = false, listenCallback?: () => void, connectCallback?: () => void): http.Server {
		this.connectSocket(verbose, connectCallback);

		return this.app.listen(port, listenCallback);
	}
}

if (require.main == module) {
	let rocky = new Coach().build_rocky();
	let s = new PlayerServer(rocky);

	s.start(
		config.PORT,
		true,
		() => { console.log(`Player server listening on port ${config.PORT}`) },
		() => { console.log("Player socket connected...") });
}

