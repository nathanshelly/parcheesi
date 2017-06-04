/** Adjusts Rocky formulation based on results using genetic algorithm */

import { Board } from '../Board'
import { _Move } from '../_Move'
import { Color } from '../Color'

import { training_session } from './Referee'
import { Rocky } from './Rocky'
import * as heur from './Heuristics'

class Coach {
	private build_heuristic(): heur.Heuristic {
		return (brd: Board, color: Color, moves: _Move[]) => { return 1 };
	}
}
