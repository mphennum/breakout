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

	var $windows = {};

	var player;

	var resize = function(event) {
		$this.style.height = event.height;

		for (var k in $windows) {
			var win = $windows[k];
			var $ele = win.$ele;
			win.w = $ele.offsetWidth || win.w;
			win.h = $ele.offsetHeight || win.h;
			$ele.style.top = ((event.height - win.h) / 2) + 'px';
			$ele.style.left = ((event.width - win.w) / 2) + 'px';
		}
	}; // resize

	var createWindow = function(name, html) {
		var win = $windows[name] = {};
		var $ele = win.$ele = document.createElement('div');
		$ele.className = 'game-hud-window game-hud-window-' + name;
		$ele.style.display = 'none';
		$ele.innerHTML = html;

		$this.appendChild($ele);

		return $ele;
	}; // createWindow

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

		// windows

		var $pause = createWindow('pause',
			'<h1>Breakout</h1>' +
			'<p>left: LEFT or A</p>' +
			'<p>right: RIGHT or D</p>' +
			'<p>unpause: SPACE</p>' +
			'<p style="margin-top: 10px">credit: mph</p>'
		);

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
