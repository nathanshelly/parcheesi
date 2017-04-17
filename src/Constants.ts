import { Color } from './Color'
import { Position } from './Position'

export const NUM_PLAYER_PAWNS = 4;
export const MAX_N_PAWNS_BASE = NUM_PLAYER_PAWNS;
export const MAX_N_PAWNS_HOME_SPOT = NUM_PLAYER_PAWNS;
export const MAX_N_PAWNS_MAIN = 2;
export const MAX_N_PAWNS_HOME_ROW = 2;

export const HOME_ROW_SIZE = 8;
export const MAIN_RING_SIZE = 68;

export const SAFE_SPOT_INDICES = [4, 11, 16, 21, 28, 33, 38, 45, 50, 55, 62, 67]

// divided by two cuz typescript enum
export const N_COLORS = Object.keys(Color).length / 2;
export const BLUE_VAL = Color.Blue.valueOf;
export const RED_VAL = Color.Red.valueOf;
export const GREEN_VAL = Color.Green.valueOf;
export const YELLOW_VAL = Color.Yellow.valueOf;

export const HOME_ROW_BY_INDEX = {
    16: Color.Red,
    33: Color.Blue,
    50: Color.Yellow,
    67: Color.Green
}

export const HOME_ROW_BY_COLOR = {
    RED_VAL: 16,
    BLUE_VAL: 33,
    YELLOW_VAL: 50,
    GREEN_VAL: 67
}

export const ENTRY_POINTS = {
    GREEN_VAL: 4,
    RED_VAL: 21,
    BLUE_VAL: 38,
    YELLOW_VAL: 55
}

export const BASE_POSITION = new Position(-1, -1);