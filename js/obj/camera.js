(function(game) {

'use strict';

var Obj = game.Obj;

var Camera = Obj.Camera = function(opts) {
	opts = opts || {};

	Obj.call(this, opts);

	this.render(game.Renderer.createCamera({
		'fov': opts.fov,
		'width': opts.width,
		'height': opts.height,
		'near': opts.near,
		'far': opts.far
	})); // render

	this.move(opts.x, opts.y, opts.z);
}; // constructor

Camera.prototype = Object.create(Obj.prototype);

/*Camera.prototype.update = function(elapsed) {

};*/ // update

})(window.game);
