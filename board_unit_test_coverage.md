This file lists methods of the board and their unit test coverage,
says nothing about methods being implicitly tested by integration tests.

## Tested
Does not mean comprehensive

- buildMainRingSpot
- colorIfHomeEntrySpot
- constructor
- pawnInBase
- makeMove
- getSpotAtOffsetFromEntry
- getBaseSpot
- getPawnsOfColor
- getPawnsOfColorOnBoard
- getPawnsOfColorInBase
- getPawnsOfColorOnBoardHelper - will be tested through getPawnsOfColorOnBoard
- getOccupiedSpotsOfColorOnBoard - assuming correct if findPawn and getPawnsOfColorOnBoard pass tests
- getBlockadesOfColor
- getSpotAtOffsetFromSpot
- moveOnePawnBackToBase
- findPawn
- getHomeSpots
- getHomeRowStarts

## Assumed Correct

- getNextSpot
- getEntrySpot

## Needs Tests

- handleSpecialLandings
- landingWillBop