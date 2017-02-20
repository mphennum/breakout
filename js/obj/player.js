(function(game) {

'use strict';

var Obj = game.Obj = game.Obj || {};
var Player = Obj.Player = {};

Player.__init__ = function(cb) {
	delete Player.__init__;

	game.load(['Renderer', 'Obj', 'Obj.Cube'], function() {

		Obj = game.Obj;

		var Cube = Obj.Cube;

		Player = Obj.Player = function(opts) {
			Cube.call(this, opts);
		}; // constructor

		Player.prototype = Object.create(Cube.prototype);

		Player.prototype.update = function(elapsed) {

		}; // update

		if (cb) {
			cb();
		}

	}); // load
}; // __init__

})(window.game);
