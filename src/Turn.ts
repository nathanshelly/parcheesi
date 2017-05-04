import * as c from './Constants'
import * as d from './Distances'

import { Pawn } from './Pawn'
import { Roll } from './Roll'
import { Color } from './Color';
import { Board } from './Board'
import { _Spot } from './_Spot'
import { _Move } from './_Move'
import { _Player } from './_Player'

export class Turn {
    private num_doubles: number = 0;
    private rolled_doubles: boolean;
    private is_taken: boolean;
    board: Board;
    player: _Player;

    constructor(board: Board, player: _Player) {
        this.board = board;
        this.player = player;
    }

    take(): boolean {
        if(this.is_taken)
            throw new Error('Tried to take turn twice.')
        else
            this.is_taken = true;

        let all_pawns_out: boolean = false;
        this.rolled_doubles = true;
        
        while(this.rolled_doubles && this.num_doubles < c.MAX_DOUBLES) 
        {
            let die = d.rollDice(all_pawns_out);
            this.rolled_doubles = die.length === c.NUM_DOUBLES_DICE;
            if(this.rolled_doubles)
                this.num_doubles++;

            let moves: _Move[] = this.player.doMove(this.board, die);
            let roll = new Roll(this.board, this.player, moves, die);
            
            if(!roll.take())
                return false;
        }

        return true;
    }
}