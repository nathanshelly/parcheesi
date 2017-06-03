import * as processes from 'child_process';
import * as sleep from 'sleep';
import * as http from 'http';

import { PlayerServer } from '../server/PlayerServer';
import { FirstPawnMover } from '../FirstPawnMover';

import * as config from '../server/player_config';

function startPlayerServer(): http.Server {
  const player = new FirstPawnMover();
  const s = new PlayerServer(player);

  return s.start(config.PORT, () => console.log('Socket connected...'));
}

function startRacketServer(num_games: number): any {
  let racketCmd = 'racket';
  let racketArgs = ['parcheesi/tournament.rkt', num_games.toString()];

  let spawn = processes.spawn;
  return spawn(racketCmd, racketArgs, { cwd: '.' });
}

export function run_games(num: number) {
  let playerServer: http.Server;

  console.log('Starting racket server...');
  let racket = startRacketServer(num);

  let stdout: string = '';
  racket.on('close', () => {
    console.log('Racket server process closed...');
    console.log(`Stdout from racket server: ${stdout}`);
    console.log('Shutting down player server...');
    playerServer.close();
  });

  racket.stdout.on('data', chunk => {
    console.log(`Data received: ${chunk.toString()}`);
    stdout += chunk.toString();
  });

  console.log('Racket server started, starting player server in 5s...');

  setTimeout(() => {
    console.log('Starting player server...');
    playerServer = startPlayerServer();
  }, 5000);
}

run_games(10);
