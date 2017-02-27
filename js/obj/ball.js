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

		var PI = Math.PI;
		var TAU = PI * 2;

		Ball = Obj.Ball = function(opts) {
			opts = opts || {};

			opts.radius = opts.radius || 4;

			parent.call(this, opts);

			this.dir = opts.dir || PI; // 0 is up, PI is down
			this.setSpeed(opts.speed || 2);
		}; // constructor

		Ball.prototype = Object.create(parent.prototype);

		Ball.prototype.isball = true;

		Ball.prototype.setDir = function(dir) {
			if (dir > TAU) {
				dir -= TAU;
			} else if (dir < TAU) {
				dir += TAU;
			}

			this.dir = dir;
			this.speedx = this.speed * Math.sin(dir);
			this.speedy = this.speed * Math.cos(dir);
		}; // setDir

		Ball.prototype.setSpeed = function(speed) {
			this.speed = speed || this.speed;
			this.speedx = this.speed * Math.sin(this.dir);
			this.speedy = this.speed * Math.cos(this.dir);
		}; // setSpeed

		// never set abs(speedx) > speed
		Ball.prototype.setSpeedX = function(speedx) {
			this.dir = Math.asin(speedx / this.speed);
			if (this.speedy < 0) {
				this.dir += PI;
			}

			this.speedx = speedx;
			this.speedy = this.speed * Math.cos(this.dir);
		}; // setSpeedX

		// never set abs(speedy) > speed
		Ball.prototype.setSpeedY = function(speedy) {
			this.dir = Math.acos(speedy / this.speed);
			if (this.speedx < 0) {
				this.dir += PI;
			}

			this.speedy = speedy;
			this.speedx = this.speed * Math.sin(this.dir);
		}; // setSpeedY

		Ball.prototype.update = function(elapsed) {
			this.move(this.speedx, this.speedy, 0);
		}; // update

		Ball.prototype.handleCollision = function(obj) {
			if (obj.isplayer) {
				this.moveToLast();
				this.setSpeedY(-this.speedy);
				this.setSpeedX(.95 * ((this.x - obj.x) / obj.width) * this.speed);
			} else if (obj.iswall) {
				if (obj.isbottom) { // bottom wall
					this.remove();
				} else if (this.y < obj.y - (obj.height / 2)) {// || this.y > obj.y) { // top wall
					this.moveToLast();
					this.setSpeedY(-this.speedy);
				} else { //if (this.x < obj.x || this.x > obj.x) { // left or right walls
					this.moveToLast();
					this.setSpeedX(-this.speedx);
				}
			} else if (obj.isbrick) {
				if (this.y < obj.y - (obj.height / 2) || this.y > obj.y + (obj.height / 2)) { // from bottom or top
					this.moveToLast();
					this.setSpeedY(-this.speedy);
				} else {// if (this.x < obj.x || this.x > obj.x) { // from left or right
					this.moveToLast();
					this.setSpeedX(-this.speedx);
				}

				obj.remove();
			}
		}; // handleCollision

		if (cb) {
			cb();
		}

	}); // load

}; // __init__

})(window.game);
