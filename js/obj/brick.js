(function(game) {

'use strict';

var Obj = game.Obj = game.Obj || {};
var Brick = Obj.Brick = {};

Brick.__init__ = function(cb) {
	delete Brick.__init__;

	game.load(['Renderer', 'Obj', 'Obj.Cube'], function() {

		var Renderer = game.Renderer;
		Obj = game.Obj;

		var parent = Obj.Cube;

		Brick = Obj.Brick = function(opts) {
			opts = opts || {};

			opts.width = opts.width || Brick.DEFAULT_WIDTH;
			opts.height = opts.height || Brick.DEFAULT_HEIGHT;
			opts.depth = opts.depth || 2;

			parent.call(this, opts);
		}; // constructor

		Brick.prototype = Object.create(parent.prototype);

		Brick.DEFAULT_WIDTH = 10;
		Brick.DEFAULT_HEIGHT = 2;

		Brick.prototype.update = function(elapsed) {
			//this.move(game.rand(-0.01, 0.01, true), game.rand(-0.01, 0.01, true), game.rand(-0.01, 0.01, true));
			//this.move(0.1, 0, 0);
		}; // update

		if (cb) {
			cb();
		}

	}); // load
}; // __init__

})(window.game);
