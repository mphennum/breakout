(function(game) {

'use strict';

var Obj = game.Obj = game.Obj || {};
var Light = Obj.Light = {};

Light.__init__ = function(cb) {
	delete Light.__init__;

	game.load(['Renderer', 'Obj'], function() {

		var Renderer = game.Renderer;
		var parent = Obj = game.Obj;

		Light = Obj.Light = function(opts) {
			opts = opts || {};

			opts.x = opts.x || Renderer.DEFAULT_X;
			opts.x = opts.x || Renderer.DEFAULT_Y;
			opts.z = opts.z || 3;

			parent.call(this, opts);

			this.color = opts.color || Renderer.DEFAULT_COLOR;
			this.intensity = opts.intensity;
			this.shadow = opts.shadow;
			this.shadowdarkness = opts['shadow-darkness'];
			this.shadowcamera = opts['shadow-camera'];
			this.shadowcameratop = opts['shadow-camera-top'];
			this.shadowcamerabottom = opts['shadow-camera-bottom'];
			this.shadowcameraleft = opts['shadow-camera-left'];
			this.shadowcameraright = opts['shadow-camera-right'];
		}; // constructor

		Light.prototype = Object.create(parent.prototype);

		Light.prototype.render = function() {
			parent.prototype.render.call(this, Renderer.createLight({
				'color': this.color,
				'intensity': this.intensity,
				'shadow': this.shadow,
				'shadow-darkness': this.shadowdarkness,
				'shadow-camera': this.shadowcamera,
				'shadow-camera-top': this.shadowcameratop,
				'shadow-camera-bottom': this.shadowcamerabottom,
				'shadow-camera-left': this.shadowcameraleft,
				'shadow-camera-right': this.shadowcameraright
			})); // render
		}; // render

		if (cb) {
			cb();
		}

	}); // load
}; // __init__

game.load('Obj', function() {

}); // load

})(window.game);
