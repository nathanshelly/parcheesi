import { Rocky } from './src/rocky/Rocky'
import * as Decoder from './src/Decoder'

let [board, dice] = Decoder.doMoveXMLToBoardDice("<do-move><board><start><pawn><color>yellow</color><id>1</id></pawn><pawn><color>red</color><id>2</id></pawn><pawn><color>red</color><id>1</id></pawn><pawn><color>blue</color><id>1</id></pawn></start><main><piece-loc><pawn><color>blue</color><id>2</id></pawn><loc>67</loc></piece-loc><piece-loc><pawn><color>yellow</color><id>0</id></pawn><loc>62</loc></piece-loc><piece-loc><pawn><color>blue</color><id>3</id></pawn><loc>39</loc></piece-loc><piece-loc><pawn><color>red</color><id>0</id></pawn><loc>38</loc></piece-loc><piece-loc><pawn><color>blue</color><id>0</id></pawn><loc>34</loc></piece-loc><piece-loc><pawn><color>yellow</color><id>3</id></pawn><loc>30</loc></piece-loc></main><home-rows><piece-loc><pawn><color>green</color><id>2</id></pawn><loc>0</loc></piece-loc></home-rows><home><pawn><color>yellow</color><id>2</id></pawn><pawn><color>red</color><id>3</id></pawn><pawn><color>green</color><id>3</id></pawn><pawn><color>green</color><id>1</id></pawn><pawn><color>green</color><id>0</id></pawn></home></board><dice><die>2</die><die>6</die></dice></do-move>");

let distances = [2, 6];

let junk = (Board, Color) => 1;

new Rocky(junk).doMove(board, distances);
