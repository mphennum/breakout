(function(game) {

'use strict';

var Obj = game.Obj = game.Obj || {};
var Sphere = Obj.Sphere = {};

Sphere.__init__ = function(cb) {
	delete Sphere.__init__;

	game.load(['Renderer', 'Obj'], function() {

		var Renderer = game.Renderer;
		var parent = Obj = game.Obj;

		Sphere = Obj.Sphere = function(opts) {
			opts = opts || {};

			parent.call(this, opts);

			this.color = opts.color || Renderer.DEFAULT_COLOR;
			this.radius = opts.radius || Renderer.DEFAULT_SPHERE_RADIUS;
			this.widthsegments = opts['width-segments'] || Renderer.DEFAULT_SPHERE_SEGMENTS_WIDTH;
			this.heightsegments = opts['height-segments'] || Renderer.DEFAULT_SPHERE_SEGMENTS_HEIGHT;
		}; // constructor

		Sphere.prototype = Object.create(parent.prototype);

		Sphere.prototype.render = function() {
			parent.prototype.render.call(this, Renderer.createSphere({
				'color': this.color,
				'radius': this.radius,
				'width-segments': this.widthsegments,
				'height-segments': this.heightsegments
			})); // render
		}; // render

		if (cb) {
			cb();
		}

	}); // load

}; // __init__

})(window.game);
