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
		setTimeout(function(){that.searchai(manager, that)}, 0);
	}
}

Game_AI.prototype.evaluateGrid = function(grid) {
	var score = 0;
	grid.eachCell(function (x, y, tile) {
		if(tile) {
			if(tile.value > 1024) score += tile.value * tile.value * (x+1) * (y+1);
			score += tile.value * (y+1) * (x+1);
		}
	});
	return score * (grid.availableCells().length+1);
}

Game_AI.prototype.evaluateMoves = function(grid) {
	var moves = [0,0,0,0];
	grid.eachCell(function (x, y, tile) {
		if(tile) {
			for(xPrime = 0; xPrime < grid.size; xPrime++) {
				if(!grid.cells[xPrime][y]) {
					if(xPrime < x) moves[3] = 1;
					else moves[1] = 1;
				}
				if(!grid.cells[x][xPrime]) {
					if(xPrime < y) moves[0] = 1;
					else moves[2] = 1;
				}
			}
			
			for (var direction = 0; direction < 4; direction++) {
				var vector = {
					0: { x: 0,  y: -1 }, // Up
					1: { x: 1,  y: 0 },  // Right
					2: { x: 0,  y: 1 },  // Down
					3: { x: -1, y: 0 }   // Left
				}[direction];
				var cell   = { x: x + vector.x, y: y + vector.y };
				var other  = grid.cellContent(cell);
				if (other && other.value === tile.value) {	
					moves[direction] = 1;
				}
			}
		}
	});
	return moves;
}	

Game_AI.prototype.search = function(level, manager) {
	var max = [0, -1];
	if(level==0) return [0, this.evaluateGrid(manager.grid)];
	var moves = this.evaluateMoves(manager.grid);
	for(var index = 0; index < 4; index++) {
		if(moves[index]) {
		this.clone = manager.clone();
		var moveTotal = 0;
		this.clone.move(index);
		moveTotal = this.search(level-1, this.clone);
		//cells = clone.grid.availableCells();
		//for(var index2 = 0; index2 < cells.length; index2++) {
		//	t2 = new Tile(cells[index2],2);
		//	t4 = new Tile(cells[index2],4);
		//	clone.grid.insertTile(t2);
		//	moveVal = this.search(level-1, clone);
		//	moveTotal += .9*moveVal[1];
		//	clone.grid.removeTile(t2);
		//	clone.grid.insertTile(t4);
		//	moveVal = this.search(level-1, clone);
		//	moveTotal += .1*moveVal[1];
		//	clone.grid.removeTile(t4);
		//}
		//moveTotal /= cells.length;
		if(max[1] <= moveTotal[1]) max = [index, moveTotal[1]];
		}
	}
	return max;
}