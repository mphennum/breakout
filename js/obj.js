(function(game) {

'use strict';

var Obj = game.Obj = {};

Obj.__init__ = function(cb) {
	delete Obj.__init__;

	game.load('Renderer', function() {

		var Renderer = game.Renderer;

		Obj = game.Obj = function(opts) {
			opts = opts || {};

			this.x = opts.x || Renderer.DEFAULT_X;
			this.y = opts.y || Renderer.DEFAULT_Y;
			this.z = opts.z || Renderer.DEFAULT_Z;

			this.mesh = null;
		}; // constructor

		//Obj.prototype.resize = function(w, h) {}; // resize

		Obj.prototype.render = function(mesh) {
			this.mesh = mesh || null;
			game.add(this);

			this.move(this.x, this.y, this.z);
		}; // render

		Obj.prototype.move = function(x, y, z) {
			var pos = this.mesh.position;

			if (x) {
				this.x += x;
				pos.x += x;
			}

			if (y) {
				this.y += y;
				pos.y += y;
			}

			if (z) {
				this.z += z;
				pos.z += z;
			}
		}; // move

		Obj.prototype.intersects = function(obj) {
			return false;
		}; // intersects

		if (cb) {
			cb();
		}

	}); // load

}; // __init__

})(window.game);
