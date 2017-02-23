(function(game) {

'use strict';

var Obj = game.Obj = game.Obj || {};
var Ball = Obj.Ball = {};

Ball.__init__ = function(cb) {
	delete Ball.__init__;

	game.load(['Renderer', 'Obj', 'Obj.Sphere'], function() {

		var Renderer = game.Renderer;
		Obj = game.Obj;

		var parent = Obj.Sphere;

		Ball = Obj.Ball = function(opts) {
			opts = opts || {};

			opts.radius = opts.radius || 5;

			parent.call(this, opts);

			this.speed = opts.speed || 0.25;
			this.dir = opts.dir || Math.PI * 1.5; // down
		}; // constructor

		Ball.prototype = Object.create(parent.prototype);

		Ball.prototype.update = function(elapsed) {
			//this.move(game.rand(-0.01, 0.01, true), game.rand(-0.01, 0.01, true), game.rand(-0.01, 0.01, true));
			//this.move(0.1, 0, 0);
			this.move(0, -this.speed, 0);
		}; // update

		if (cb) {
			cb();
		}

	}); // load

}; // __init__

})(window.game);
