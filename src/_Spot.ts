interface _Spot { // see spot run
    home_row: _Spot[] | null;
    position: number;
    sanctuary: boolean;
}

class Spot implements _Spot {
    home_row: _Spot[] | null;
    position: number;
    sanctuary: boolean;
}