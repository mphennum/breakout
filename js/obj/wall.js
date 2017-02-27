(function(game) {

'use strict';

var Obj = game.Obj = game.Obj || {};
var Wall = Obj.Wall = {};

Wall.__init__ = function(cb) {
	delete Wall.__init__;

	game.load(['Renderer', 'Obj', 'Obj.Cube'], function() {

		var Renderer = game.Renderer;
		Obj = game.Obj;

		var parent = Obj.Cube;

		Wall = Obj.Wall = function(opts) {
			opts = opts || {};

			parent.call(this, opts);

			this.isbottom = !!opts.isbottom;
		}; // constructor

		Wall.prototype = Object.create(parent.prototype);

		Wall.prototype.iswall = true;

		Wall.prototype.update = function(elapsed) {
			//this.move(game.rand(-0.01, 0.01, true), game.rand(-0.01, 0.01, true), game.rand(-0.01, 0.01, true));
			//this.move(0.1, 0, 0);
		}; // update

		Wall.prototype.handleCollision = function(obj) {
			if (obj.isball) {
				obj.handleCollision(this);
			}
		}; // handleCollision

		if (cb) {
			cb();
		}

	}); // load

}; // __init__

})(window.game);
