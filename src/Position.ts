export class Position {
    main_ring_location : number;
		home_row_location: number;

    constructor(main_ring_location: number, home_row_location: number) {
        this.main_ring_location = main_ring_location;
        this.home_row_location = home_row_location;
    }
}