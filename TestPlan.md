# Test plan

## Cheat checks

### To Do

#### Sequence cheats

- MoveForward unit tests

- makeMove
- multiple moves in a roll
- multiple rolls in a turn
- winner
- reformedBlockade
- other RulesChecker methods

#### Main cheats

- Attempted to move blockade together in same roll

### Done

#### Main cheats

- Move a pawn of illegal ID
- Move a pawn of not our color
- Moved pawn to invalid location (past the home row)
- Moved pawn to or though blockade (path contains blockade)
- Attempted to move invalid distance (implicitly checks home on exact move)
- Attempted to land on occupied safe spot

#### Global cheats

- Moved a pawn that is not yours
- Pawn id is not 0-3
- Made all legal moves
- Moved pawn to invalid location (off board)

#### Enter cheats

- Enter a pawn of illegal ID
- Enter a pawn of not our color
- Entered on not a 5
- Enter a pawn that wasn't in the base
- Enter a pawn when there is a blockade of our color
- Enter a pawn when there is a blockade of not our color