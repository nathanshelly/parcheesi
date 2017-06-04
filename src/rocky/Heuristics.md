# Board State Evaluation

## Architecture

- Heuristics module - calculates various components of the heuristic
- Scout class - initialized with board and heuristic function,
								can evaluates moves and rolls (maybe turns?)
- Rocky class - initialized with heuristic function
								creates scouts to scout his moves,
								determines and performs final moves/roll
- Coach class - creates Rocky clones with various heuristic functions
								runs genetic algorithm evaluating their performance,
								then mutates components/weighting factors of the heuristic

## Generating board score

Delta based, delta on score from each move, that way not recalcuting mini
moves. Work for two similar rolls like this: 
- [move_one, move_two]
- [move_one, move_three]

not for rolls like this:

- [move_one, move_two]
- [move_two, move_one]

Order of moves can matter

## Heuristics

### Roll measures on solely our pawns (not taking other players into account)

#### Pawns

- pawns in home 					- number
- pawns in home row				- [array of offsets from home row start]
- pawns in main ring			- [array of offsets from main ring entry]
- pawns in base						- number
- pawns on safety (less value on opponent entries) - tuple:
			([array of offsets from home row start for pure safeties],
			 [array of offsets from home row start for opponent entry spots])
- blockades in home row		- [array of offsets from home row start]
- blockades in main ring	- [array of offsets from main ring entry]

#### Miscellaneous

### Measures including other players

#### Pawns

- opponent pawns on board 													- number
- opponent pawns stuck behind blockades 						- number
- opponent base spots blocked by blockade 					- number
- opponent home row entries blocked by blockade			- number
- distance from our pawns to closest back opponent 	- [tuple of arrays of distances
																											 where each array holds the
																											 distances of opponent pawns
																											 from our pawn]

<!-- come back to return signatures of below heuristics if used -->

#### Maybe, probably not doable in time

- heuristics could take into account how well opponents are doing. For example,
	we might care less about blockading someone who's badly losing
- opponent pawns heuristics could take into account opponent pawn locations. For
	example, opponent pawns could be represented as an [array of offsets of 
	opponents pawns from starting location (or from their respective bases)]
- after rolling doubles once be more agressive?
- after rolling doubles twice prioritize farthest forward pawn less?
- treat distances out of base as risk to minimize? (hand in hand with
	prioritizing getting pawns into home row/home spot)

#### Maybe, probably doable, but helpful?

- bops (overlaps with opponent pawns on board)
- enters home (overlaps with number of pawns in home)
- earns bonus (overlaps with above two scenarios)