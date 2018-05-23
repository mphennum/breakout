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
		for (var k in $windows) {
			positionWindow($windows[k], event);
		}
	}; // resize

	var createWindow = function(name, title, html) {
		var win = $windows[name] = {};
		var $ele = win.$ele = document.createElement('div');
		$ele.className = 'game-hud-window game-hud-window-' + name;
		$ele.style.display = 'none';
		$ele.innerHTML = '<h1>' + title + '</h1>' + html;

		$this.appendChild($ele);

		return win;
	}; // createWindow

	var positionWindow = function(win, event) {
		var $ele = win.$ele;
		win.w = $ele.offsetWidth || win.w;
		win.h = $ele.offsetHeight || win.h;
		$ele.style.top = ((event.height - win.h) / 2) + 'px';
		$ele.style.left = ((event.width - win.w) / 2) + 'px';
	}; // positionWindow

	var showWindow = function(win) {
		win.$ele.style.display = '';
		positionWindow(win, {
			'width': game.width,
			'height': game.height
		});
	}; // showWindow

	var hideWindow = function(win) {
		win.$ele.style.display = 'none';
	}; // hideWindow

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

		var pausewin = createWindow('pause', 'Breakout',
			'<p>left: LEFT or A</p>' +
			'<p>right: RIGHT or D</p>' +
			'<p>unpause: SPACE</p>' +
			'<p style="margin-top: 10px">credit: mph</p>'
		);

		game.listen('pause', function(event) {
			showWindow(pausewin);
		}); // pause

		game.listen('unpause', function(event) {
			hideWindow(pausewin);
		}); // unpause

		var gameoverwin = createWindow('game-over', 'Game Over',
			'<p>refresh the page to play again</p>'
		);

		var gamewonwin = createWindow('game-won', 'Congratulations',
			'<p>You won!</p>' +
			'<p style="margin-top: 10px">refresh the page to play again</p>'
		);

		game.listen('over', function() {
			if (game.won) {
				showWindow(gamewonwin);
			} else { // lost
				showWindow(gameoverwin);
			}
		});

		// resize

		game.yield(resize.bind(this, {'width': game.width, 'height': game.height}));
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
