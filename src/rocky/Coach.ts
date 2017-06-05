/** Adjusts Rocky formulation based on results using genetic algorithm */
import * as fs from 'fs'
import * as util from 'util'

import { Board } from '../Board'
import { Color } from '../Color'
import { _Move } from '../_Move'

import { Rocky } from './Rocky'
import { training_session } from './Referee'

import * as heur from './Heuristics'
import { components, params } from './coach_config'

class Coach {
	/* Heuristic components: Heuristic, weight, multiplier */
	private components: heur.HeuristicComponent[];

	constructor() {
		this.components = components;
	}

	private compose_heuristic(): heur.Heuristic {
		return (brd: Board, color: Color) => {
			return this.components.map(h => {
				return h.heuristic(brd, color) * h.weight * h.multiplier;
			}).reduce((a, b) => a + b);
		};
	}

	private build_rocky(): Rocky {
		return new Rocky(this.compose_heuristic());
	}

	private up_component_weight(index: number, learn_rate: number) {
		this.components[index].weight += learn_rate;
	}

	private down_component_weight(index: number, learn_rate: number) {
		this.components[index].weight -= learn_rate;
	}

	train_rocky(learn_rate: number = params.learning_rate, n_games: number = params.n_games, verbose: boolean = false) {
		let up = (index: number) => this.up_component_weight(index, learn_rate);
		let down = (index: number) => this.down_component_weight(index, learn_rate);

		let rocky = this.build_rocky();

		let n_heuristic = -1;
		let n_session = 0.0;
		let old_n_wins_av = -Infinity;
		let still_training = false;
		let completionCallback = (n_wins: number) => {
			if (verbose)
				console.log(`${rocky.name} won ${n_wins} games in round ${n_session}!`);

			/* If we are at the beginning of a round of tweaks */
			if (n_heuristic == 0)
				still_training = false;

			/* Tweak the next heuristic weight */
			n_heuristic = (n_heuristic + 1) % this.components.length;
			up(n_heuristic);

			if (n_wins <= old_n_wins_av) // Tweak didn't help
				down(n_heuristic);
			else
				still_training = true;


			/* If we are at the end of the components and haven't changed any, don't recur */
			let cont = true;
			if (n_heuristic == this.components.length - 1 && !still_training)
				cont = false;

			if (cont) {
				rocky = this.build_rocky();
				training_session(rocky, n_games, completionCallback, verbose);
			}

			/* Log training progress */
			let message = `Training session #${n_session}\n${rocky.name} won ${n_wins} games, with running average ${old_n_wins_av}\nHeuristics:\n${this.components.map(c => util.inspect(c, false, undefined) + "\n")}\n`;

			console.log(message);
			fs.appendFileSync("./training_output.log", message);

			/* Cache the previous wins */
			n_session++;
			old_n_wins_av = old_n_wins_av == -Infinity ? n_wins : ((old_n_wins_av * n_session) + n_wins) / (n_session + 1);
		}

		if (verbose)
			console.log("Starting training...")

		training_session(rocky, n_games, completionCallback, verbose);
	}
}

if (require.main == module) {
	new Coach().train_rocky();
}

