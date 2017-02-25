(function(game) {

'use strict';

var Obj = game.Obj = game.Obj || {};
var Cube = Obj.Cube = {};

Cube.__init__ = function(cb) {
	delete Cube.__init__;

	game.load(['Renderer', 'Obj'], function() {

		var Renderer = game.Renderer;
		var parent = Obj = game.Obj;

		Cube = Obj.Cube = function(opts) {
			opts = opts || {};

			opts.collidable = (opts.collidable !== false);

			parent.call(this, opts);

			this.color = opts.color || Renderer.DEFAULT_COLOR;
			this.width = opts.width || Renderer.DEFAULT_CUBE_WIDTH;
			this.height = opts.height || Renderer.DEFAULT_CUBE_HEIGHT;
			this.depth = opts.depth || Renderer.DEFAULT_CUBE_DEPTH;
			this.widthsegments = opts['width-segments'] || Renderer.DEFAULT_CUBE_SEGMENTS;
			this.heightsegments = opts['height-segments'] || Renderer.DEFAULT_CUBE_SEGMENTS;
			this.depthsegments = opts['depth-segments'] || Renderer.DEFAULT_CUBE_SEGMENTS;
		}; // constructor

		Cube.prototype = Object.create(parent.prototype);

		Cube.prototype.render = function() {
			parent.prototype.render.call(this, Renderer.createCube({
				'color': this.color,
				'width': this.width,
				'height': this.height,
				'depth': this.depth,
				'width-segments': this.widthsegments,
				'height-segments': this.heightsegments,
				'depth-segments': this.depthsegments
			})); // render
		}; // render

		if (cb) {
			cb();
		}

	}); // load

}; // __init__

})(window.game);
