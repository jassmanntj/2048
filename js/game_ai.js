function Game_AI(manager) {
	this.manager = manager;
	this.weightsA = [ [1, 2, 32, 64],
					[2, 4, 16, 128],
					[32, 16, 8, 256],
					[64, 128, 256, 512] ];
	this.weightsB =  [ [64, 128, 256, 512],
					[32, 16, 8, 256],
					[2, 4, 16, 128],
					[1, 2, 32, 64] ];
	this.weightsC = [ [512, 256, 128, 64],
					[256, 8, 16, 32],
					[128, 16, 4, 2],
					[64, 32, 2, 1] ];
	this.weightsD = [ [64, 32, 2, 1],
					[128, 16, 4, 2],
					[256, 8, 16, 32],
					[512, 256, 128, 64] ];
	this.weights = this.weightsA;
	this.lastWins = 50;
	this.setMax = true;
	this.setMin = false;
	this.minPercent = 100;
	this.maxPercent = 100;
	this.averageTime = 0;
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
	this.startTime = Date.now();
	this.searchai(this.manager,this);
}

Game_AI.prototype.searchai = function(manager, that) {
	if(this.manager.isGameTerminated()) {
		if(this.manager.won) this.manager.wins++;
		this.manager.totalGames++;
		this.averageTime += (Date.now() -  this.startTime)/100;
		if(this.manager.totalGames == 100) {
			console.log("%d\t%d\t%d",this.manager.maxLevels,this.manager.wins,this.averageTime);
			this.manager.totalGames = 0;
			this.manager.wins = 0;
			this.averageTime = 0;
			this.manager.maxLevels++;
		}
		this.manager.restart();
		return;
	}
	else {
		
		//var levels = this.manager.maxLevels - manager.grid.availableCells().length;
		//levels = levels < this.manager.minLevels ? this.manager.minLevels : levels;
		scoreA = this.evaluateGrid_TEST(this.manager.grid,this.weightsA);
		scoreB = this.evaluateGrid_TEST(this.manager.grid,this.weightsB);
		scoreC = this.evaluateGrid_TEST(this.manager.grid,this.weightsC);
		scoreD = this.evaluateGrid_TEST(this.manager.grid,this.weightsD);
		score = scoreA;
		this.weights = this.weightsA;
		if(scoreB > score) {
			this.weights = this.weightsB;
			score = scoreB;
		}
		if(scoreC > score) {
			this.weights = this.weightsC;
			score = scoreC;
		}
		if(scoreD > score) {
			this.weights = this.weightsD;
			score = scoreD;
		}
		m = that.search(this.manager.maxLevels, that.manager);
		manager.move(m[0]);
		setTimeout(function(){that.searchai(manager, that)}, 0);
	}
}

Game_AI.prototype.evaluateGrid = function(grid) {
	var score = 0;
	grid.eachCell(function (x, y, tile) {
		if(tile) {
			var worth = tile.value * (y+1) * (x+1);
			worth = worth * worth;
			//if(tile.value > 1024) score += tile.value * tile.value * (x+1) * (y+1);
			score += worth;
		}
	});
	return score;//* (grid.availableCells().length+1);
}

Game_AI.prototype.evaluateGrid_TEST = function(grid) {
	var score = 0;
	var w = this.weights;
	grid.eachCell(function (x, y, tile) {
		if(tile) {
			//if(tile.value > 1024) score += tile.value * tile.value * (x+1) * (y+1);
			value = tile.value * w[y][x];
			score += value;//* value;
		}
	});
	return score * (grid.availableCells().length+1);	
}

Game_AI.prototype.evaluateMoves = function(grid) {
	var moves = [0,0,0,0];
	grid.eachCell(function (x, y, tile) {
		if (moves[0] === 1 && moves[1] === 1
			&& moves[2] === 1 && moves[3] === 1) return moves;
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
	if(level==0) return [0, this.evaluateGrid_TEST(manager.grid)];
	var moves = this.evaluateMoves(manager.grid);
	for(var index = 0; index < 4; index++) {
		if(moves[index]) {
		this.clone = manager.clone();
		var moveTotal = 0;
		this.clone.moveWorstTile(index);
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