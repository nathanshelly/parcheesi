import * as processes from 'child_process';
import * as http from 'http';

import { PlayerServer } from '../server/PlayerServer';
import { FirstPawnMover } from '../FirstPawnMover';

import * as config from '../server/player_config';

function startPlayerServer(verbose: boolean): http.Server {
  const player = new FirstPawnMover();
  const s = new PlayerServer(player);

  return s.start(config.PORT, verbose, () => console.log('Socket connected...'));
}

function startRacketServer(num_games: number, verbose: boolean): any {
  let racketCmd = 'racket';
  let racketArgs = ['parcheesi/tournament.rkt', num_games.toString()];

  let spawn = processes.spawn;
  return spawn(racketCmd, racketArgs);
}

export function run_games(num: number, verbose: boolean = false) {
  let playerServer: http.Server;

	if (verbose)
		console.log('Starting racket server...');
  let racket = startRacketServer(num, verbose);

  let stdout: string = '';
	racket.on('close', () => {
		if (verbose) {
			console.log('Racket server process closed...');
			console.log(`Stdout from racket server: ${stdout}`);
			console.log('Shutting down player server...');
		}

		console.log(stdout);
    playerServer.close();
  });

  racket.stdout.on('data', chunk => {
		if (verbose)
			console.log(`Data received: ${chunk.toString()}`);
    stdout += chunk.toString();
  });

	if (verbose)
		console.log('Racket server started, starting player server in 5s...');

	// Wait 5 seconds for racket server to start up...
	let now = new Date().getTime();
	while (new Date().getTime() < now + 5000) {};

	if (verbose)
		console.log('Starting player server...');
	playerServer = startPlayerServer(verbose);
}

run_games(10);

