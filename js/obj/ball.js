(function(game) {

'use strict';

var Obj = game.Obj = game.Obj || {};
var Ball = Obj.Ball = {};

Ball.__init__ = function(cb) {
	delete Ball.__init__;

	game.load(['Renderer', 'Obj', 'Obj.Sphere'], function() {

		var Renderer = game.Renderer;
		Obj = game.Obj;

		var parent = Obj.Sphere;

		Ball = Obj.Ball = function(opts) {
			opts = opts || {};

			opts.radius = opts.radius || 4;

			parent.call(this, opts);

			this.dir = opts.dir || Math.PI; // down
			this.setSpeed(opts.speed || 2);
		}; // constructor

		Ball.prototype = Object.create(parent.prototype);

		Ball.prototype.setSpeed = function(speed) {
			this.speed = speed || this.speed;
			this.speedx = this.speed * Math.sin(this.dir);
			this.speedy = this.speed * Math.cos(this.dir);
		}; // setSpeed

		Ball.prototype.setSpeedX = function(speedx) {
			//x = speed * sin(dir) ... y = speed * cos(dir)
			//x / speed = sin(dir)
			this.dir = Math.asin(speedx / this.speed);
			this.setSpeed();
		}; // setSpeedX

		Ball.prototype.setSpeedY = function(speedy) {
			this.dir = Math.acos(speedy / this.speed);
			this.setSpeed();
		}; // setSpeedY

		Ball.prototype.update = function(elapsed) {
			this.move(this.speedx, this.speedy, 0);
		}; // update

		Ball.prototype.handleCollision = function(obj) {
			if (obj instanceof Obj.Player) {
				this.moveToLast();
				this.setSpeedY(-this.speedy);
				//#TODO change speed x based on which side of paddle ball was hit
			} else if (obj instanceof Obj.Wall) {
				//game.log('wall collision');
				if (obj.bottom) { // bottom wall
					this.remove();
				} else {
					if (this.y < obj.y - (obj.height / 2)) {// || this.y > obj.y) { // top wall
						this.moveToLast();
						this.setSpeedY(-this.speedy);
					} else { //if (this.x < obj.x || this.x > obj.x) { // left or right walls
						this.moveToLast();
						this.setSpeedX(-this.speedx);
					}
				}
			} else if (obj instanceof Obj.Brick) {
				if (this.y < obj.y - (obj.height / 2) || this.y > obj.y + (obj.height / 2)) { // from bottom or top
					this.moveToLast();
					this.setSpeedY(-this.speedy);
					obj.remove();
				} else {// if (this.x < obj.x || this.x > obj.x) { // from left or right
					this.moveToLast();
					this.setSpeedX(-this.speedx);
					obj.remove();
				}
			}
		}; // handleCollision

		if (cb) {
			cb();
		}

	}); // load

}; // __init__

})(window.game);
