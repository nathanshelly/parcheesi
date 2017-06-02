import processes = require('child_process')
import sleep = require('sleep')
import http = require('http')

import { PlayerServer } from '../server/PlayerServer'
import { FirstPawnMover } from '../FirstPawnMover'

import * as config from '../server/player_config'

namespace Referee {

	function startPlayerServer(): http.Server {
		const player = new FirstPawnMover();
		const s = new PlayerServer(player);

		return s.start(config.PORT, () => console.log("Socket connected..."));
	}

	function startRacketServer(num_games: number): any {
		let racketCmd = 'racket';
		let racketArgs = ['parcheesi/tournament.rkt', num_games.toString()];

		let spawn = processes.spawn;
	  return spawn(racketCmd, racketArgs, {cwd: '.'});
	}

	export function run_games(num: number) {

		let racket = startRacketServer(num);

		let server: http.Server;
		setTimeout(() => {
			server = startPlayerServer();
		}, 5000);
	}

}

Referee.run_games(10);

