let xml = "<do-move><board><start><pawn><color>red</color><id>1</id></pawn><pawn><color>red</color><id>0</id></pawn></start><main><piece-loc><pawn><color>blue</color><id>1</id></pawn><loc>66</loc></piece-loc><piece-loc><pawn><color>blue</color><id>0</id></pawn><loc>66</loc></piece-loc><piece-loc><pawn><color>green</color><id>0</id></pawn><loc>64</loc></piece-loc><piece-loc><pawn><color>blue</color><id>3</id></pawn><loc>59</loc></piece-loc><piece-loc><pawn><color>red</color><id>3</id></pawn><loc>55</loc></piece-loc><piece-loc><pawn><color>green</color><id>1</id></pawn><loc>49</loc></piece-loc><piece-loc><pawn><color>blue</color><id>2</id></pawn><loc>39</loc></piece-loc><piece-loc><pawn><color>red</color><id>2</id></pawn><loc>29</loc></piece-loc><piece-loc><pawn><color>green</color><id>3</id></pawn><loc>5</loc></piece-loc><piece-loc><pawn><color>green</color><id>2</id></pawn><loc>5</loc></piece-loc><piece-loc><pawn><color>yellow</color><id>3</id></pawn><loc>4</loc></piece-loc><piece-loc><pawn><color>yellow</color><id>1</id></pawn><loc>4</loc></piece-loc><piece-loc><pawn><color>yellow</color><id>2</id></pawn><loc>0</loc></piece-loc><piece-loc><pawn><color>yellow</color><id>0</id></pawn><loc>0</loc></piece-loc></main><home-rows></home-rows><home></home></board><dice><die>2</die><die>2</die><die>5</die><die>5</die></dice></do-move>"

import * as Dec from '../Decoder'
import { Coach } from './Coach'
import { Color } from '../Color'
let [board, dice] = Dec.doMoveXMLToBoardDice(xml);

let player = new Coach().build_rocky();

player.startGame(Color.yellow);

let moves = player.doMove(board, dice);
