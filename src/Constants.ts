import { Color } from './Color'

export const NUM_PLAYERS = 4;
export const NUM_PLAYER_PAWNS = 4;
export const MAX_N_PAWNS_BASE = NUM_PLAYER_PAWNS;
export const MAX_N_PAWNS_HOME_SPOT = NUM_PLAYER_PAWNS;

export const NUM_PAWNS_IN_BLOCKADE = 2;
export const MAX_N_PAWNS_MAIN = NUM_PAWNS_IN_BLOCKADE;
export const MAX_N_PAWNS_HOME_ROW = NUM_PAWNS_IN_BLOCKADE;

export const HOME_ROW_SIZE = 7;
export const MAIN_RING_SIZE = 68;
export const OFFSET_BETWEEN_ENTRIES = 17;
export const ENTRY_TO_HOME_ROW_START_OFFSET = 64;
export const ENTRY_TO_HOME_OFFSET = ENTRY_TO_HOME_ROW_START_OFFSET + HOME_ROW_SIZE;

export const VALUE_TO_ENTER_ON = 5;
export const LARGEST_POSSIBLE_MOVE = 20; // bopping bonus

export const BOP_BONUS = 20;
export const HOME_SPOT_BONUS = 10;

export const NUM_DICE = 2;
export const NUM_DOUBLES_DICE = 2;

export const MAX_DOUBLES = 3;
export const COLOR_TO_RUN_MAIN_RING = Color.green;
export const SAFE_SPOT_INDICES = [4, 11, 16, 21, 28, 33, 38, 45, 50, 55, 62, 67]

// Because objects suck, please make sure these keys line up correct colors
export const COLOR_HOME_AND_ENTRY = {
    0: {"HOME_ROW_ENTRY": 33,
        "ENTRY_FROM_BASE": 38},
    1: {"HOME_ROW_ENTRY": 16,
        "ENTRY_FROM_BASE": 21},
    2: {"HOME_ROW_ENTRY": 67,
        "ENTRY_FROM_BASE": 4},
    3: {"HOME_ROW_ENTRY": 50,
        "ENTRY_FROM_BASE": 55},
}

// USED ONLY IN TEST METHODS

export const TEST_NAME = 'Rǝad';
export const TEST_BASE_INDEX = -1;

// divide by two cuz typescript enum
export const N_COLORS = Object.keys(Color).length / 2;

