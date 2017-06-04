/** Adjusts Rocky formulation based on results using genetic algorithm */

import * as heur from './Heuristics'

import { Board } from '../Board'
import { Color } from '../Color'
import { _Move } from '../_Move'

import { Rocky } from './Rocky'
import { training_session } from './Referee'

export class Coach {
	private build_heuristic(): heur.Heuristic {
		return (brd: Board, color: Color, moves: _Move[]) => { return 1; };
	}
}
