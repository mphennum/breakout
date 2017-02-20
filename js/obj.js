(function(game) {

'use strict';

var Obj = game.Obj = function(opts) {
	//opts = opts || {};

	this.mesh = null;
}; // constructor

//Obj.prototype.resize = function(w, h) {}; // resize

Obj.prototype.render = function(mesh) {
	this.mesh = mesh || null;
	game.add(this);
}; // render

Obj.prototype.move = function(x, y, z) {
	var pos = this.mesh.position;

	if (x) {
		pos.x += x;
	}

	if (y) {
		pos.y += y;
	}

	if (z) {
		pos.z += z;
	}
}; // move

Obj.prototype.intersects = function(obj) {
	return false;
}; // intersects

})(window.game);
