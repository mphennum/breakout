(function(game) {

'use strict';

var Obj = game.Obj = game.Obj || {};
var Player = Obj.Player = {};

Player.__init__ = function(cb) {
	delete Player.__init__;

	game.load(['Renderer', 'Obj', 'Obj.Cube'], function() {

		var Renderer = game.Renderer;
		Obj = game.Obj;

		var parent = Obj.Cube;

		Player = Obj.Player = function(opts) {
			opts = opts || {};

			opts.width = opts.width || 20;
			opts.height = opts.height || 2;
			opts.depth = opts.depth || 2;

			parent.call(this, opts);
		}; // constructor

		Player.prototype = Object.create(parent.prototype);

		Player.prototype.update = function(elapsed) {
			//this.move(game.rand(-0.01, 0.01, true), game.rand(-0.01, 0.01, true), game.rand(-0.01, 0.01, true));
			//this.move(0.1, 0, 0);
		}; // update

		if (cb) {
			cb();
		}

	}); // load
}; // __init__

})(window.game);
