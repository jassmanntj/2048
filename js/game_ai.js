function Game_AI(manager) {
	this.manager = manager;
}

Game_AI.prototype.runAI = function() {
	this.dumb(this.manager, this, 0);
}

Game_AI.prototype.runClone = function() {
	this.clone = manager.clone();
	this.dumb(clone, this, 0);
}

Game_AI.prototype.dumb = function(manager, that, i) {
	if(manager.isGameTerminated()) return;
	else {
		manager.move(i);
		i = (i + 1)%4
		setTimeout(function(){that.dumb(manager, that, i)}, 100);
	}
}

Game_AI.prototype.pausecomp = function(time) {
  var date = new Date();
  var curDate = null;
  do{ curDate = new Date(); }
  while(curDate-date < time);
}