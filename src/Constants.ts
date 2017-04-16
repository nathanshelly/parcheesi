import { Color } from './Color'

export const MAX_N_PAWNS_MAIN = 2;
export const MAX_N_PAWNS_HOME_ROW = 2;
export const MAX_N_PAWNS_BASE = 4;
export const MAX_N_PAWNS_HOME_SPOT = 4;
export const HOME_ROW_SIZE = 8;
export const MAIN_RING_SIZE = 68;
export const SAFE_SPOT_INDICES = [4, 11, 16, 21, 28, 33, 38, 45, 50, 55, 62, 67]
export const N_COLORS = 4;
export const BLUE_VAL = Color.Blue.valueOf;
export const RED_VAL = Color.Red.valueOf;
export const GREEN_VAL = Color.Green.valueOf;
export const YELLOW_VAL = Color.Yellow.valueOf;
export const HOME_ROW_COLORS = {
    16: Color.Red,
    33: Color.Blue,
    50: Color.Yellow,
    67: Color.Green
}
export const ENTRY_POINTS = {
    GREEN_VAL: 4,
    RED_VAL: 21,
    BLUE_VAL: 38,
    YELLOW_VAL: 55
}
