(function(game) {

'use strict';

var Ctrl = game.Ctrl = {};

Ctrl.__init__ = function(cb) {
	delete Ctrl.__init__;

	game.load('game', function() {

		var down = Ctrl.down = {}; // key is down until keyup event occurs
		var pressed = Ctrl.pressed = {}; // key is pressed until next update
		//var keydownhandlers = {};

		var keymap = Ctrl.keymap = {
			'q': 81,
			'w': 87,
			'e': 69,
			'r': 82,
			't': 84,
			'y': 89,
			'u': 85,
			'i': 73,
			'o': 79,
			'p': 80,
			'a': 65,
			's': 83,
			'd': 68,
			'f': 70,
			'g': 71,
			'h': 72,
			'j': 74,
			'k': 75,
			'l': 76,
			'z': 90,
			'x': 88,
			'c': 67,
			'v': 86,
			'b': 66,
			'n': 78,
			'm': 77,
			'1': 49,
			'2': 50,
			'3': 51,
			'4': 52,
			'5': 53,
			'6': 54,
			'7': 55,
			'8': 56,
			'9': 57,
			'0': 48,
			'enter': 13,
			'space': 32,
			'tab': 9,
			'esc': 27,
			'~': 192,
			'ctrl': 17,
			'shft': 16,
			'alt': 18
		};

		var reversedkeymap = {};
		for (var k in keymap) {
			reversedkeymap[keymap[k]] = k;
		}

		document.addEventListener('keydown', function(event) {
			var key = reversedkeymap[event.keyCode];

			//game.log(key || 'unknown - ' + event.keyCode);

			if (!key) {
				return;
			}

			pressed[key] = true;
			down[key] = true;

			/*var handlers = keydownhandlers[key];
			if (handlers) {
				for (var i = 0; i < handlers; ++i) {
					handlers[i]();
				}
			}*/

			return false;
		}); // keydown

		document.addEventListener('keyup', function(event) {
			var key = reversedkeymap[event.keyCode];
			if (down[key]) {
				delete down[key];
				return false;
			}
		}); // keyup

		/*Ctrl.onkeydown = function(key, cb) {
			keydownhandlers[key] = keydownhandlers[key] || [];
			keydownhandlers[handlers.length] = cb;
		};*/ // onkeydown

		Ctrl.update = function(elapsed) {
			for (var k in pressed) {
				delete pressed[k];
			}
		}; // update

		if (cb) {
			cb();
		}

	}); // load

}; // __init__

})(window.game);
