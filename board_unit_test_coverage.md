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
- getPawnsOfColorOnBoardHelper - will be tested through getPawnsOfColorOnBoard
- getOccupiedSpotsOfColorOnBoard - assuming correct if findPawn and getPawnsOfColorOnBoard pass tests
- getBlockadesOfColor

## Assumed Correct

- getNextSpot
- getEntrySpot

## Needs Tests

- getSpotAtOffsetFromSpot
- moveOnePawnBackToBase
- findPawn
- handleSpecialLandings
- landingWillBop
- getHomeSpots
- getHomeRowStarts
- getPawnsOfColorOnBoard
- getPawnsOfColorInBase