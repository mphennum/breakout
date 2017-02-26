(function(game) {

'use strict';

var Obj = game.Obj = game.Obj || {};
var Player = Obj.Player = {};

Player.__init__ = function(cb) {
	delete Player.__init__;

	game.load(['Ctrl', 'Renderer', 'Obj', 'Obj.Cube'], function() {

		Obj = game.Obj;

		var Ctrl = game.Ctrl;
		var Renderer = game.Renderer;

		var bounds = game.bounds;

		var parent = Obj.Cube;

		Player = Obj.Player = function(opts) {
			opts = opts || {};

			opts.width = opts.width || 30;
			opts.height = opts.height || 2;
			opts.depth = opts.depth || 2;

			parent.call(this, opts);

			this.speed = opts.speed || 0.15;
		}; // constructor

		Player.prototype = Object.create(parent.prototype);

		Player.prototype.update = function(elapsed) {
			//this.move(game.rand(-0.01, 0.01, true), game.rand(-0.01, 0.01, true), game.rand(-0.01, 0.01, true));
			//this.move(0.1, 0, 0);
			//game.log(Ctrl.down);
			if (Ctrl.down['a'] && this.x - (this.width / 2) - 2 > bounds.x[0]) {
				this.move(-this.speed * elapsed, 0, 0);
			}

			if (Ctrl.down['d'] && this.x + (this.width / 2) + 2 < bounds.x[1]) {
				this.move(this.speed * elapsed, 0, 0);
			}
		}; // update

		Player.prototype.handleCollision = function(obj) {
			if (obj instanceof Obj.Ball) {
				obj.handleCollision(this);
			}
		}; // handleCollision

		if (cb) {
			cb();
		}

	}); // load

}; // __init__

})(window.game);
