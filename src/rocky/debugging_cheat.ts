let xml = "<do-move><board><start><pawn><color>yellow</color><id>3</id></pawn><pawn><color>yellow</color><id>0</id></pawn><pawn><color>red</color><id>1</id></pawn><pawn><color>green</color><id>3</id></pawn><pawn><color>blue</color><id>2</id></pawn><pawn><color>blue</color><id>1</id></pawn></start><main><piece-loc><pawn><color>red</color><id>0</id></pawn><loc>52</loc></piece-loc><piece-loc><pawn><color>blue</color><id>3</id></pawn><loc>39</loc></piece-loc><piece-loc><pawn><color>red</color><id>2</id></pawn><loc>38</loc></piece-loc><piece-loc><pawn><color>yellow</color><id>1</id></pawn><loc>31</loc></piece-loc><piece-loc><pawn><color>yellow</color><id>2</id></pawn><loc>2</loc></piece-loc></main><home-rows><piece-loc><pawn><color>green</color><id>1</id></pawn><loc>1</loc></piece-loc><piece-loc><pawn><color>green</color><id>0</id></pawn><loc>1</loc></piece-loc><piece-loc><pawn><color>blue</color><id>0</id></pawn><loc>4</loc></piece-loc></home-rows><home><pawn><color>red</color><id>3</id></pawn><pawn><color>green</color><id>2</id></pawn></home></board><dice><die>4</die><die>4</die></dice></do-move>"

import * as Dec from '../Decoder'
import { Coach } from './Coach'
import { Color } from '../Color'
let [board, dice] = Dec.doMoveXMLToBoardDice(xml);

let player = new Coach().build_rocky();

player.startGame(Color.green);

let moves = player.doMove(board, dice);
