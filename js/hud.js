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

	var $pause;
	var pausewidth;
	var pauseheight;

	var player;

	var resize = function(event) {
		$this.style.height = event.height;

		pausewidth = $pause.offsetWidth || pausewidth;
		pauseheight = $pause.offsetHeight || pauseheight;
		$pause.style.top = ((event.height - pauseheight) / 2) + 'px';
		$pause.style.left = ((event.width - pausewidth) / 2) + 'px';
	}; // resize

	HUD.init = function(opts) {
		opts = opts || {};
		$parent = opts.parent || game.elemap.$body;
		player = opts.player;

		// hud

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

		// pause screen

		$pause = document.createElement('div');
		$pause.className = 'game-hud-pause';
		$pause.style.display = 'none';
		$pause.innerHTML =
			'<h1>Breakout</h1>' +
			'<p>left: LEFT or A</p>' +
			'<p>right: RIGHT or D</p>' +
			'<p>unpause: SPACE</p>' +
			'<p style="margin-top: 10px">credit: mph</p>'
		;

		$this.appendChild($pause);

		game.listen('pause', function(event) {
			$pause.style.display = '';
		}); // pause

		game.listen('unpause', function(event) {
			$pause.style.display = 'none';
		}); // unpause

		// resize

		game.yield(resize.bind(this, {'width': window.innerWidth, 'height': window.innerHeight}));
		game.listen('resize', resize);
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
