(function() {

'use strict';

var game = window.game = {
	'dev': true,
	'over': false,
	'modules': ['Ext.Three', 'Renderer', 'Objs.Camera', 'Objs.Player'],
	'urlmap': {
		'base': 'http://www.mphennum.com/work/breakout/'
	},
	'elemap': {
		'$head': document.getElementsByTagName('head')[0],
		'$body': document.getElementsByTagName('body')[0],
		'$canvas': null
	},
	'objmap': {}
};

var objmap = game.objmap;
game.start = function() {
	var elapsed;
	var prev;
	var now = (new Date()).getTime();

	var loop = function() {
		prev = now;
		now = (new Date()).getTime();
		elapsed = now - prev;
		//game.log(elapsed);
		for (var k in objmap) {
			objmap[k].update(elapsed);
		}

		if (!game.over) {
			setTimeout(loop, 1);
		}
	}; // loop

	loop();
}; // start

var idchars = 'abcdefghijklmnopqrstuvwxyz0123456789';
var idcharslen = idchars.length;
var lastid = null;
var idcharmap = {};
for (var i = 0; i < idcharslen; ++i) {
	idcharmap[idchars[i]] = i;
}

game.genID = function() {
	if (lastid === null) {
		lastid = idchars[0];
		return lastid;
	}

	var id = lastid;
	var i = id.length - 1;
	for (; i > -1; --i) {
		var pos = idcharmap[id[i]] + 1;
		if (pos < idcharslen) {
			id = id.substr(0, i) + idchars[pos] + id.substr(i + 1);
			break;
		}

		//console.log('no break');
		id = id.substr(0, i) + idchars[0] + id.substr(i + 1);
	}

	if (i === -1) {
		id += idchars[0];
	}

	lastid = id;
	return id;
}; // genID

game.add = function(obj) {
	if (obj.update) {
		obj.id = game.genID();
		objmap[obj.id] = obj;
	}

	if (obj.mesh) {
		game.renderer.scene.add(obj.mesh);
	}
}; // add

game.remove = function(obj) {
	if (obj.id) {
		delete objmap[obj.id];
	}

	if (obj.mesh) {
		game.renderer.scene.remove(obj.mesh);
	}
}; // remove

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
