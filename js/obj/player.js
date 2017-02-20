(function(game) {

'use strict';

var Obj = game.Obj;
var Cube = Obj.Cube;

var Player = Obj.Player = function(opts) {
	Cube.call(this, opts);
}; // constructor

Player.prototype = Object.create(Cube.prototype);

Player.prototype.update = function(elapsed) {

}; // update

})(window.game);
