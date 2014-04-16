function Game_AI(manager) {
	this.manager = manager;
}

Game_AI.prototype.runAI = function() {
	var i = 0;
	while(!this.manager.isGameTerminated()) {
		this.manager.move(i);
		i = (i + 1)%4;
	}
}