// represents a move where a player enters a piece
class EnterMove implements _Move {
  pawn: Pawn;
  
	constructor(pawn: Pawn) {
    this.pawn = pawn;
  }
}
