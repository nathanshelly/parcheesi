import { Color } from './Color'

export const NUM_PLAYER_PAWNS = 4;
export const MAX_N_PAWNS_BASE = NUM_PLAYER_PAWNS;
export const MAX_N_PAWNS_HOME_SPOT = NUM_PLAYER_PAWNS;

export const NUM_PAWNS_IN_BLOCKADE = 2;
export const MAX_N_PAWNS_MAIN = NUM_PAWNS_IN_BLOCKADE;
export const MAX_N_PAWNS_HOME_ROW = NUM_PAWNS_IN_BLOCKADE;

export const HOME_ROW_SIZE = 8;
export const MAIN_RING_SIZE = 68;
export const ENTRY_TO_HOME_START_OFFSET = 64;

export const ENTRY_VALUE = 5;

export const LARGEST_POSSIBLE_MOVE = 20; // bopping bonus

export const HOME_SPOT_BONUS = 10;
export const BOP_BONUS = 20;

export const SAFE_SPOT_INDICES = [4, 11, 16, 21, 28, 33, 38, 45, 50, 55, 62, 67]

// divided by two cuz typescript enum
export const N_COLORS = Object.keys(Color).length / 2;

export const BLUE_VAL = Color.Blue.valueOf();
export const RED_VAL = Color.Red.valueOf();
export const GREEN_VAL = Color.Green.valueOf();
export const YELLOW_VAL = Color.Yellow.valueOf();

export const HOME_ROW_BY_INDEX = {
    16: Color.Red,
    33: Color.Blue,
    50: Color.Yellow,
    67: Color.Green
}

// Because objects suck, please make sure these keys line up with the X_VAL's above.
export const HOME_ROW_BY_COLOR = {
    1: 16,
    0: 33,
    3: 50,
    2: 67
}

// See note above.
export const ENTRY_POINTS = {
    2: 4,
    1: 21,
    0: 38,
    3: 55
}
export const ENTRY_OFFSET = 17;
