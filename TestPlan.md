# Test plan

## Cheat checks

### To Do

#### Main cheats

- Moved pawn to or though blockade (path contains blockade)
- Attempted to land on occupied safe spot
- Attempted to move invalid distance
- Attempted to enter home row incorrectly
- Attempted to move to home on not exact move
- Attempted to move blockade together in same roll

### Done

#### Global cheats

- Moved a pawn that is not yours
- Pawn \_id is not 0-3
- Made all legal moves
- Moved pawn to invalid location (off board)

#### Enter cheats

- Entered on not a 5
- Start and distance are not -1
- Enter a pawn that wasn't in the base