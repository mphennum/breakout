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
			this.speed = speed;
			this.speedx = speed * Math.sin(this.dir);
			this.speedy = speed * Math.cos(this.dir);
		}; // setSpeed

		Ball.prototype.update = function(elapsed) {
			//this.move(game.rand(-0.01, 0.01, true), game.rand(-0.01, 0.01, true), game.rand(-0.01, 0.01, true));
			//this.move(0.1, 0, 0);
			this.move(this.speedx, this.speedy, 0);
		}; // update

		Ball.prototype.reverseSpeedX = function() {
			this.speedx = -this.speedx;
			this.dir = Math.asin(this.speedx / this.speed);
			this.speedy += game.rand(-this.speed * 0.1, this.speed * 0.1, true);
		}; // reverseSpeedX

		Ball.prototype.reverseSpeedY = function() {
			this.speedy = -this.speedy;
			this.dir = Math.asin(this.speedy / this.speed);
			this.speedx += game.rand(-this.speed * 0.1, this.speed * 0.1, true);
		}; // reverseSpeedY

		Ball.prototype.handleCollision = function(obj) {
			if (obj instanceof Obj.Player) {
				this.moveToLast();
				//this.speedy = -this.speedy;
				this.reverseSpeedY();
			} else if (obj instanceof Obj.Wall) {
				//game.log('wall collision');
				if (obj.bottom) { // bottom wall
					this.remove();
				} else {
					if (this.y < obj.y - (obj.height / 2)) {// || this.y > obj.y) { // top wall
						//game.log('from bottom or top');
						this.moveToLast();
						//this.speedy = -this.speedy;
						this.reverseSpeedY();
					} else { //if (this.x < obj.x || this.x > obj.x) { // left or right walls
						//game.log('from left or right');
						this.moveToLast();
						//this.speedx = -this.speedx;
						this.reverseSpeedX();
					}
				}
			} else if (obj instanceof Obj.Brick) {
				if (this.y < obj.y - (obj.height / 2) || this.y > obj.y + (obj.height / 2)) { // from bottom or top
					//game.log('from bottom or top');
					this.moveToLast();
					//this.speedy = -this.speedy;
					this.reverseSpeedY();
					obj.remove();
				} else {// if (this.x < obj.x || this.x > obj.x) { // from left or right
					//game.log('from left or right');
					this.moveToLast();
					//this.speedx = -this.speedx;
					this.reverseSpeedX();
					obj.remove();
				}
			}
			/*game.log('Ball collision');
			game.log('this.mesh.position', this.mesh.position);
			game.log('this.boundingbox', this.boundingbox);
			game.log('obj.mesh.position', obj.mesh.position);
			game.log('obj.boundingbox', obj.boundingbox);
			game.log('is player', obj instanceof Obj.Player);*/
		}; // handleCollision

		if (cb) {
			cb();
		}

	}); // load

}; // __init__

})(window.game);
