(function(game) {

'use strict';

var Obj = game.Obj = game.Obj || {};
var Sphere = Obj.Sphere = {};

Sphere.__init__ = function(cb) {
	delete Sphere.__init__;

	game.load(['Renderer', 'Obj'], function() {

		Obj = game.Obj;

		Sphere = Obj.Sphere = function(opts) {
			opts = opts || {};

			Obj.call(this, opts);

			this.render(game.Renderer.createSphere({
				'color': opts.color,
				'radius': opts.radius,
				'width-segments': opts['width-segments'],
				'height-segments': opts['height-segments']
			})); // render

			this.move(opts.x, opts.y, opts.z);
		}; // constructor

		Sphere.prototype = Object.create(Obj.prototype);

		if (cb) {
			cb();
		}

	}); // load

}; // __init__

})(window.game);
