function Game_AI(manager) {
	this.manager = manager;
}

Game_AI.prototype.runAI = function() {
	this.run(this, 0);
}

Game_AI.prototype.run = function(that, i) {
	if(that.manager.isGameTerminated()) return;
	else {
		that.manager.move(i);
		i = (i + 1)%4
		setTimeout(function(){that.run(that, i)}, 100);
	}
}

Game_AI.prototype.pausecomp = function(time) {
  var date = new Date();
  var curDate = null;
  do{ curDate = new Date(); }
  while(curDate-date < time);
}