import { Rocky } from './rocky/Rocky'
import { Color } from './Color'
import * as Decoder from './Decoder'

let [board, dice] = Decoder.doMoveXMLToBoardDice("<do-move><board><start><pawn><color>yellow</color><id>3</id></pawn><pawn><color>yellow</color><id>2</id></pawn><pawn><color>red</color><id>1</id></pawn><pawn><color>red</color><id>0</id></pawn><pawn><color>blue</color><id>3</id></pawn><pawn><color>blue</color><id>0</id></pawn></start><main><piece-loc><pawn><color>yellow</color><id>1</id></pawn><loc>61</loc></piece-loc><piece-loc><pawn><color>blue</color><id>2</id></pawn><loc>43</loc></piece-loc><piece-loc><pawn><color>yellow</color><id>0</id></pawn><loc>26</loc></piece-loc><piece-loc><pawn><color>red</color><id>3</id></pawn><loc>24</loc></piece-loc><piece-loc><pawn><color>green</color><id>1</id></pawn><loc>17</loc></piece-loc><piece-loc><pawn><color>green</color><id>0</id></pawn><loc>17</loc></piece-loc><piece-loc><pawn><color>green</color><id>3</id></pawn><loc>5</loc></piece-loc><piece-loc><pawn><color>green</color><id>2</id></pawn><loc>5</loc></piece-loc><piece-loc><pawn><color>blue</color><id>1</id></pawn><loc>4</loc></piece-loc><piece-loc><pawn><color>red</color><id>2</id></pawn><loc>3</loc></piece-loc></main><home-rows></home-rows><home></home></board><dice><die>5</die><die>5</die><die>2</die><die>2</die></dice></do-move>");

let junk = (Board, Color) => 1;

let rocky = new Rocky(junk);
rocky.startGame(Color.green);
let moves = rocky.doMove(board, dice);

let pawn2loc = board.findSpotOfPawn(moves[0].pawn)
let pawn3loc = board.findSpotOfPawn(moves[1].pawn)
console.log("done")