(function() {

'use strict';

var game = window.game = {
	'dev': true,
	'over': false,
	'modules': ['Ext.Three', 'Objs.Player'],
	'urlmap': {
		'base': 'http://www.mphennum.com/work/breakout/'
	},
	'elemap': {
		'$head': document.getElementsByTagName('head')[0],
		'$body': document.getElementsByTagName('body')[0]
	},
	'objs': []
};

var objs = game.objs;
game.start = function() {
	var elapsed;
	var prev;
	var now = (new Date()).getTime();

	var loop = function() {
		prev = now;
		now = (new Date()).getTime();
		elapsed = now - prev;
		//game.log(elapsed);
		for (var i = 0; i < objs.length; ++i) {
			objs.update(elapsed);
		}

		if (!game.over) {
			setTimeout(loop, 1);
		}
	}; // loop

	loop();
}; // start

game.load = function(modules, cb) {
	if (modules instanceof Array) {
		var remaining = modules.length;
		var ready = function() {
			if (!--remaining && cb) {
				cb();
			}
		}; // ready

		for (var i = 0; i < modules.length; ++i) {
			game.load(modules[i], ready);
		}

		return;
	}

	var done = false;
	var ready = function() {
		if (done) {
			return;
		}

		done = true;
		if (cb) {
			cb();
		}
	}; // ready

	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.async = 'true';
	script.onload = ready;
	script.onreadystatechange = function() {
		if (this.readyState === 'loaded' || this.readyState === 'complete') {
			ready();
		}
	}; // onreadystatechange

	modules = modules.toLowerCase().replace(/\./g, '/');
	script.src = game.urlmap.base + 'js/' + modules + '.js';
	game.elemap.$head.appendChild(script);
}; // load

game.log = function() {
	if (game.dev) {
		console.log.apply(console, arguments);
	}
}; // log

// init
game.load(game.modules, game.start);

})();
