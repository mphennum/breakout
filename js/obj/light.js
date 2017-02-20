(function(game) {

'use strict';

var Obj = game.Obj = game.Obj || {};
var Light = Obj.Light = {};

Light.__init__ = function(cb) {
	delete Light.__init__;

	game.load(['Renderer', 'Obj'], function() {

		Obj = game.Obj;

		Light = Obj.Light = function(opts) {
			opts = opts || {};

			Obj.call(this, opts);

			this.render(game.Renderer.createLight({
				'color': opts.color,
				'intensity': opts.intensity,
				'shadow': opts.shadow,
				'shadow-darkness': opts['shadow-darkness'],
				'shadow-camera': opts['shadow-camera'],
				'shadow-camera-top': opts['shadow-camera-top'],
				'shadow-camera-bottom': opts['shadow-camera-bottom'],
				'shadow-camera-left': opts['shadow-camera-left'],
				'shadow-camera-right': opts['shadow-camera-right']
			})); // render

			this.move(opts.x, opts.y, opts.z);
		}; // constructor

		Light.prototype = Object.create(Obj.prototype);

		if (cb) {
			cb();
		}

	}); // load
}; // __init__

game.load('Obj', function() {

}); // load

})(window.game);
