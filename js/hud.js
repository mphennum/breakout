(function(game) {

'use strict';

var HUD = game.HUD = {};

HUD.__init__ = function(cb) {

	HUD.init = function(opts) {
		opts = opts || {};
	}; // init

	HUD.update = function(elapsed) {

	}; // update

	if (cb) {
		cb();
	}
}; // __init__

})(window.game);
