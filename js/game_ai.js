function Game_AI(manager) {
	this.manager = manager;
}

Game_AI.prototype.runAI = function() {
	this.dumb(this.manager, this, 0);
}

Game_AI.prototype.runClone = function() {
	this.clone = this.manager.clone();
	this.dumb(clone, this, 0);
}

Game_AI.prototype.dumb = function(manager, that, i) {
	if(manager.isGameTerminated()) return;
	else {
		manager.move(i);
		i = (i + 1)%4;
		setTimeout(function(){that.dumb(manager, that, i)}, 100);
	}
}

Game_AI.prototype.searchAI = function() {
	this.searchai(this.manager,this);
}

Game_AI.prototype.searchai = function(manager, that) {
	if(manager.isGameTerminated()) return;
	else {
		m = that.search(2, that.manager);
		manager.move(m[0]);
		setTimeout(function(){that.searchai(manager, that)}, 100);
	}
}
		
		

Game_AI.prototype.search = function(level, manager) {
	var max = [0, manager.score];
	if(level==0) return max;
	for(var index = 0; index < 4; index++) {
		var clone = manager.clone();
		var moveTotal = 0;
		clone.moveNoTile(index);
		cells = clone.grid.availableCells();
		for(var index2 = 0; index2 < cells.length; index2++) {
			t2 = new Tile(cells[index2],2);
			t4 = new Tile(cells[index2],4);
			clone.grid.insertTile(t2);
			moveVal = this.search(level-1, clone);
			moveTotal += .9*moveVal[1];
			clone.grid.removeTile(t2);
			clone.grid.insertTile(t4);
			moveVal = this.search(level-1, clone);
			moveTotal += .1*moveVal[1];
			clone.grid.removeTile(t4);
		}
		moveTotal /= cells.length;
		if(max[1] < moveTotal) max = [index, moveTotal];
	}
	return max;
}

Game_AI.prototype.pausecomp = function(time) {
  var date = new Date();
  var curDate = null;
  do{ curDate = new Date(); }
  while(curDate-date < time);
}