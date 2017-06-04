/** Adjusts Rocky formulation based on results using genetic algorithm */

import { Board } from '../Board'
import { Color } from '../Color'
import { _Move } from '../_Move'

import { Rocky } from './Rocky'
import { training_session } from './Referee'

import * as heur from './Heuristics'
import { components } from './coach_config'

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

	train_rocky(learn_rate: number = 1, n_games: number = 300, verbose: boolean = false) {
		let up = (index: number) => this.up_component_weight(index, learn_rate);
		let down = (index: number) => this.down_component_weight(index, learn_rate);

		let rocky = this.build_rocky();

		let n_heuristic = 0;
		let n_session = 0;
		let old_n_wins = -Infinity;

		let completionCallback = (n_wins: number) => {
			if (verbose)
				console.log(`${rocky.name} won ${n_wins} games in round ${n_session}!`);

			if (n_wins <= old_n_wins) { // Tweak didn't help
				down(n_heuristic);
			}

			up(n_heuristic++);

			rocky = this.build_rocky();
			training_session(rocky, n_games, completionCallback, verbose);
		}

		training_session(rocky, n_games, completionCallback, verbose);
	}
}
