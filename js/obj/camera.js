(function(game) {

'use strict';

var Obj = game.Obj = game.Obj || {};
var Camera = Obj.Camera = {};

Camera.__init__ = function(cb) {
	delete Camera.__init__;

	game.load(['Renderer', 'Obj'], function() {

		var Renderer = game.Renderer;
		var parent = Obj = game.Obj;

		Camera = Obj.Camera = function(opts) {
			opts = opts || {};

			parent.call(this, opts);

			this.width = opts.width || null;
			this.height = opts.height || null;

			this.fov = opts.fov || Renderer.DEFAULT_FOV;
			this.near = opts.near || Renderer.DEFAULT_NEAR;
			this.far = opts.far || Renderer.DEFAULT_FAR;
		}; // constructor

		Camera.prototype = Object.create(parent.prototype);

		Camera.prototype.render = function() {
			parent.prototype.render.call(this, Renderer.createCamera({
				'fov': this.fov,
				'width': this.width,
				'height': this.height,
				'near': this.near,
				'far': this.far
			})); // render
		}; // render

		/*Camera.prototype.update = function(elapsed) {
			//this.move(0.1, 0, 0);
			//this.move(0, 0.1, 0);
			//this.move(0, 0, 0.1);
		};*/ // update

		if (cb) {
			cb();
		}

	}); // load

}; // __init__

})(window.game);
