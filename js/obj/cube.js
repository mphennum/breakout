(function(game) {

'use strict';

var Obj = game.Obj = game.Obj || {};
var Cube = Obj.Cube = {};

Cube.__init__ = function(cb) {
	delete Cube.__init__;

	game.load(['Renderer', 'Obj'], function() {

		Obj = game.Obj;

		Cube = Obj.Cube = function(opts) {
			opts = opts || {};

			Obj.call(this, opts);

			this.render(game.Renderer.createCube({
				'color': opts.color,
				'width': opts.width,
				'height': opts.height,
				'depth': opts.depth,
				'width-segments': opts['width-segments'],
				'height-segments': opts['height-segments'],
				'depth-segments': opts['depth-segments']
			})); // render

			this.move(opts.x, opts.y, opts.z);
		}; // constructor

		Cube.prototype = Object.create(Obj.prototype);

		if (cb) {
			cb();
		}

	}); // load

}; // __init__

})(window.game);
