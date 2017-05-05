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
    private is_taken: boolean;
    board: Board;
    player: _Player;

    constructor(board: Board, player: _Player) {
        this.board = board;
        this.player = player;
    }

    take(): Board | null {
        if(this.is_taken)
            throw new Error('Tried to take turn twice.')
        else
            this.is_taken = true;

        let all_pawns_out: boolean = this.board.areAllPawnsOut(this.player.color);
        let rolled_doubles: boolean;

        do {
            let die = d.rollDice(all_pawns_out);
            rolled_doubles = die.length === c.NUM_DOUBLES_DICE;
            if(rolled_doubles) {
                this.num_doubles++;
                if(this.num_doubles === c.MAX_DOUBLES)
                    break;
            }
                

            let moves: _Move[] = this.player.doMove(this.board, die);
            let roll = new Roll(this.board, this.player, moves, die);
            
            if(!roll.take())
                return null;
        } while(rolled_doubles && this.num_doubles < c.MAX_DOUBLES);

        if(this.num_doubles === c.MAX_DOUBLES)
            console.log("DO SOMETHING HERE");
            // kick furthest along pawn that isn't in home spot back
            // this.board.moveOnePawnBackToBase()
        
        return this.board;
    }
}