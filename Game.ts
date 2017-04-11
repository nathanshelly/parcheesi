class Parcheesi implements _Game {
	players: _Player[];
	// add a player to the game
  register(p: _Player): void {
		if (this.players.length > 3) {
			// fail silently for now
		}
		else {
			this.players.push(p);
		}
	};
  
  // start a game
  start() : void {
		let colors = [Color.Red, Color.Blue, Color.Green, Color.Yellow]
		this.players.forEach(element => {
			element.startGame(colors.pop());
		});
	};
}