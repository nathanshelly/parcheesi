# Board State Evaluation

## Generating board score

Delta based, delta on score from each move, that way not recalcuting mini
moves. Work for two similar rolls like this: 
- [move_one, move_two]
- [move_one, move_three]

not for rolls like this:

- [move_one, move_two]
- [move_two, move_one]

Order of moves can matter


## Roll measures on solely our pawns (not taking other players into account)

### Pawns

- pawns in home
- pawns in home row
- pawns in main ring
- pawns in base
- pawns on safety (less value on opponent entries)
- main ring locations
- home row locations
- blockades

### Miscellaneous

- bops
- enters home (overlaps with number of panws in home)
- earns bonus (overlaps with above two scenarios)

## Measures including other players

### Pawns

- opponent pawns on board (overlaps with moves that bop)
- opponent pawns stuck behind blockades
- opponent base spots blocked by blockade
- opponent home row entries blocked by blockade
- distance from our pawns to closest back opponent

## Maybe, probably not

- heuristics could take into account how well opponents are doing. For example,
	we might care less about blockading someone who's badly losing
- after rolling doubles once be more agressive?
- after rolling doubles twice prioritize farthest forward pawn less?
- treat distances out of base as risk to minimize? (hand in hand with
	prioritizing getting pawns into home row/home spot)