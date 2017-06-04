import * as processes from 'child_process';
import * as http from 'http';

import { PlayerServer } from '../server/PlayerServer';
import { _Player } from '../_Player'
import { FirstPawnMover } from '../FirstPawnMover';

import * as config from '../server/player_config';

function startPlayerServer(player: _Player, verbose: boolean): http.Server {
  const s = new PlayerServer(player);

	return s.start(config.PORT, verbose, () => {
		if (verbose)
			console.log('Socket connected...')
	});
}

function startRacketServer(num_games: number, verbose: boolean): any {
  let racketCmd = 'racket';
  let racketArgs = ['parcheesi/tournament.rkt', num_games.toString()];

  let spawn = processes.spawn;
  return spawn(racketCmd, racketArgs);
}

function extract_wins(racket_stdout: string, player_name: string): number {
	let pat = new RegExp(`"${player_name}" (\\d+)`);

	let match = racket_stdout.match(pat);

	if (match == null)
		throw Error("Couldn't match racket_stdout!");

	let n_wins = match[1];

	return parseInt(n_wins);
}

export function training_session(player: _Player, num_games: number, completionCallback: (number) => void, verbose: boolean = false) {
  let playerServer: http.Server;

	if (verbose)
		console.log('Starting racket server...');
  let racket = startRacketServer(num_games, verbose);

  let stdout: string = '';
	racket.on('close', () => {
		if (verbose) {
			console.log('Racket server process closed...');
			console.log(`Stdout from racket server: ${stdout}`);
			console.log('Shutting down player server...');
		}

		completionCallback(extract_wins(player.))
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

	playerServer = startPlayerServer(player, verbose);
}

export function count_wins(num_games: number, name: string, verbose: boolean = false): string {

}

training_session(20, false);

