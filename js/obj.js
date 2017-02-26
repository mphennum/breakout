(function(game) {

'use strict';

var Obj = game.Obj = {};

Obj.__init__ = function(cb) {
	delete Obj.__init__;

	game.load('Renderer', function() {

		var Renderer = game.Renderer;

		Obj = game.Obj = function(opts) {
			opts = opts || {};

			this.collidable = !!opts.collidable;

			this.lastx = this.x = opts.x || Renderer.DEFAULT_X;
			this.lasty = this.y = opts.y || Renderer.DEFAULT_Y;
			this.lastz = this.z = opts.z || Renderer.DEFAULT_Z;

			this.mesh = null;
			this.boundingbox = null;
		}; // constructor

		/*Object.prototype.update = function(elapsed) {

		};*/ // update

		Obj.prototype.intersects = function(obj) {
			return this.boundingbox.intersectsBox(obj.boundingbox);
		}; // intersects

		Obj.prototype.render = function(mesh) {
			this.mesh = mesh || null;

			if (mesh && this.collidable) {
				this.boundingbox = Renderer.computeBoundingBox(this);
			}

			game.add(this);

			this.move(this.x, this.y, this.z);
		}; // render

		Obj.prototype.remove = function() {
			game.remove(this);
		}; // remove

		Obj.prototype.move = function(x, y, z) {
			var mesh = this.mesh;

			if (x) {
				this.lastx = this.x;
				this.x += x;
				mesh.translateX(x);
			}

			if (y) {
				this.lasty = this.y;
				this.y += y;
				mesh.translateY(y);
			}

			if (z) {
				this.lastz = this.z;
				this.z += z;
				mesh.translateZ(z);
			}

			if (this.collidable) {
				this.boundingbox.translate(new THREE.Vector3(x || 0, y || 0, z || 0));
			}
		}; // move

		Obj.prototype.moveToLast = function() {
			this.move(this.lastx - this.x, this.lasty - this.y, this.lastz - this.z);
		}; // moveToLast

		if (cb) {
			cb();
		}

	}); // load

}; // __init__

})(window.game);
