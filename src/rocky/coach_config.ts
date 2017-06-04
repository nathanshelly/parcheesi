import * as heur from './Heuristics';

import { Board } from '../Board';
import { Color } from '../Color';
import { _Move } from '../_Move';

function justLength(h: (Board, Color) => number[]): heur.Heuristic {
  return (brd: Board, col: Color) => h(brd, col).length;
}

export const components: heur.HeuristicComponent[] = [
  {
    heuristic: heur.pawnsInHome,
    weight: 100,
		multiplier: 10,
		description: "Pawns in home"
  },
  {
    heuristic: justLength(heur.pawnsInHomeRow),
    weight: 100,
    multiplier: 5,
		description: "Pawns in home row"
  },
  {
    heuristic: justLength(heur.pawnsInMainRing),
    weight: 75,
    multiplier: 1,
		description: "Pawns in main ring"
  },
  {
    heuristic: justLength(heur.pawnsOnSafety),
    weight: 75,
    multiplier: 1,
		description: "Pawns in safety spots"
  },
  {
    heuristic: justLength(heur.blockadesInMainRing),
    weight: 50,
    multiplier: 1,
		description: "Blockades in main ring"
  },
];