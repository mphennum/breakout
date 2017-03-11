(function(game) {

'use strict';

var HUD = game.HUD = {};

HUD.__init__ = function(cb) {

	var $parent;
	var $this;

	var fps;
	var $fps;

	var score;
	var $score;

	var player;

	HUD.init = function(opts) {
		opts = opts || {};
		$parent = opts.parent || game.elemap.$body;
		player = opts.player;

		$this = document.createElement('div');
		$this.className = 'game-hud';

		$parent.appendChild($this);

		// fps

		$fps = document.createElement('div');
		$fps.className = 'game-hud-fps';
		$this.appendChild($fps);

		// score

		$score = document.createElement('div');
		$score.className = 'game-hud-score';
		$this.appendChild($score);

		// resize
		game.onresize(function(width, height) {
			$this.style.height = height;
		}); // onresize

		// #TODO
		// lives / balls remaining (from player)
		// pause screen + instructions
		// opacity / transparency
	}; // init

	HUD.update = function(elapsed) {
		if (game.fps !== fps) {
			fps = game.fps;
			$fps.innerHTML = fps + ' fps';
		}

		if (player.score !== score) {
			score = player.score;
			$score.innerHTML = score + ' point' + ((score === 1) ? '' : 's');
		}
	}; // update

	if (cb) {
		cb();
	}
}; // __init__

})(window.game);
