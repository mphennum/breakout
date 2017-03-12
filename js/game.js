(function(JSON) {

'use strict';

var game = window.game = {};

var baseurl;
var opts = {};
var script = null;
var scripts = document.getElementsByTagName('script');
for (var i = 0; i < scripts.length; ++i) {
	var src = scripts[i].src;
	if (src.substr(-7) === 'game.js') {
		script = scripts[i];

		try {
			baseurl = src.substr(0, src.length - 10);

			var html = script.innerHTML.trim();
			if (html) {
				opts = JSON.parse(html);
			}
		} catch (e) {
			console.error('unable to parse game options');
		}

		break;
	}
}

var $head = document.getElementsByTagName('head')[0];
var $body = document.getElementsByTagName('body')[0];
var $parent = opts.parent && document.querySelector(opts.parent) || $body;

game.dev = true;
game.over = false;
game.paused = false;
game.bricks = 0;
game.score = 0;
game.modulemap = {}; // 'Renderer': 'game', ...
game.manifestmap = {}; // 'game': ['Renderer', ...]

baseurl = baseurl || 'http://www.mphennum.com/work/breakout/';
game.urlmap = {
	'base': baseurl
};

game.elemap = {
	'$head': $head,
	'$body': $body,
	'$parent': $parent
};

game.objmap = {}; // objs that must be rendered / updated
game.collidemap = {}; // objs that can collide with eachother

game.bounds = {
	'x': [-160, 160],
	'y': [-100, 100],
	'z': [-1, 1]
};

game.fps = 0;

var Obj;
var Ctrl;
var HUD;
var Renderer;
var objmap = game.objmap;
var collidemap = game.collidemap;
var bounds = game.bounds;

game.start = function() {
	Obj = game.Obj;
	Ctrl = game.Ctrl;

	Renderer = game.Renderer;
	Renderer.init({'parent': $parent});

	var camera = new Obj.Camera();
	camera.render();

	var light = new Obj.Light();
	light.render();

	var player = game.player = new Obj.Player({'y': bounds.y[0] + 4});
	player.render();

	var ball = game.ball = new Obj.Ball({'player': player});
	ball.render();

	HUD = game.HUD;
	HUD.init({'parent': $parent, 'player': player});

	// walls

	var walls = [
		new Obj.Wall({
			'y': bounds.y[1],
			'width': bounds.x[1] - bounds.x[0] + 2,
			'height': 2,
			'depth': 2
		}),
		new Obj.Wall({
			'y': bounds.y[0],
			'width': bounds.x[1] - bounds.x[0] + 2,
			'height': 2,
			'depth': 2,
			'isbottom': true
		}),
		new Obj.Wall({
			'x': bounds.x[0],
			'width': 2,
			'height': bounds.y[1] - bounds.y[0] + 2,
			'depth': 2
		}),
		new Obj.Wall({
			'x': bounds.x[1],
			'width': 2,
			'height': bounds.y[1] - bounds.y[0] + 2,
			'depth': 2
		})
	];

	for (var i = 0; i < walls.length; ++i) {
		walls[i].render();
	}

	// bricks

	var Brick = Obj.Brick;
	var bricky = bounds.y[1] - Brick.DEFAULT_HEIGHT * 20;
	var brickcols = Math.floor((bounds.x[1] - bounds.x[0] - Brick.DEFAULT_WIDTH) / (Brick.DEFAULT_WIDTH + 0.5));
	var brickrowcolors = [0xAA33AA, 0xAA2233, 0xAAAA33, 0x22AA33, 0x33AAAA, 0x2233AA];

	for (var ri = 0; ri < brickrowcolors.length; ++ri) {
		var color = brickrowcolors[ri];
		var brickx = bounds.x[1] - brickcols * (Brick.DEFAULT_WIDTH + 0.5) - 2;
		for (var ci = 0; ci < brickcols; ++ci) {
			var brick = new Brick({
				'color': color,
				'x': brickx,
				'y': bricky,
				'val': brickrowcolors.length - ri
			});

			brick.render();

			brickx += Brick.DEFAULT_WIDTH + 0.5;
		}

		bricky -= Brick.DEFAULT_HEIGHT + 0.5;
	}

	// listeners

	Ctrl.listen('space', function() {
		if (game.paused) {
			game.unpause();
		} else {
			game.pause();
		}
	}); // space

	// loop

	game.pause();

	var prev;
	var elapsed;

	var frames = 0;
	var elapsedsum = 0;

	var loop = function(ms) {
		elapsed = ms - prev;

		++frames;
		elapsedsum += elapsed;

		if (elapsedsum > 500) {
			game.fps = Math.round(frames * 1000 / elapsedsum);
			frames = 0;
			elapsedsum = 0;
		}

		if (!game.paused) {
			for (var k in objmap) {
				objmap[k].update(elapsed);
			}

			var skip = 1;
			for (var k in collidemap) {
				var pos = 0;
				for (var j in collidemap) {
					if (pos++ < skip) {
						continue;
					}

					if (collidemap[k].intersects(collidemap[j])) {
						collidemap[k].handleCollision(collidemap[j]);
					}
				}

				++skip;
			}

			game.clean();
		}

		Renderer.render();
		HUD.update(elapsed);
		Ctrl.update(elapsed);

		prev = ms;
		requestAnimationFrame(loop);
	}; // loop

	// prevent negative elapsed times in some browsers
	var preloop = function(ms) {
		elapsed = ms - prev;
		requestAnimationFrame((elapsed <= 0) ? preloop : loop);
	}; // preloop

	prev = window.performance.now();
	//setTimeout(loop.bind(prev), 1);
	requestAnimationFrame(preloop);
}; // start

// events

var handlermap = {};

game.trigger = function(type, opts) {
	var handlers = handlermap[type];
	if (handlers) {
		var event = {'type': type};
		if (opts) {
			for (var k in opts) {
				event[k] = opts[k];
			}
		}

		for (var i = 0; i < handlers.length; ++i) {
			handlers[i](event);
		}
	}
}; // trigger

game.listen = function(type, cb) {
	if (type instanceof Array) {
		for (var i = 0; i < type.length; ++i) {
			game.listen(type[i], cb);
		}

		return;
	}

	var handlers = handlermap[type] = handlermap[type] || [];
	handlers[handlers.length] = cb;
}; // listen

var resizetimer;
window.onresize = function() {
	clearTimeout(resizetimer);
	resizetimer = setTimeout(function(event) {
		game.trigger('resize', {'width': window.innerWidth, 'height': window.innerHeight});
	}, 99);
}; // onresize

game.pause = function() {
	game.paused = true;
	game.trigger('pause');
}; // pause

game.unpause = function() {
	game.paused = false;
	game.trigger('unpause');
}; // unpause

// world

game.add = function(obj) {
	if (obj.update) {
		objmap[obj.mesh.id] = obj;
	}

	if (obj.collidable) {
		collidemap[obj.mesh.id] = obj;
	}

	Renderer.add(obj.mesh);
}; // add

var removes = [];
game.remove = function(obj) {
	removes[removes.length] = obj;
}; // remove

game.clean = function() {
	for (var i = 0; i < removes.length; ++i) {
		var obj = removes[i];
		if (obj.update) {
			delete objmap[obj.mesh.id];
		}

		if (obj.collidable) {
			delete collidemap[obj.mesh.id];
		}

		Renderer.remove(obj.mesh);
	}

	removes = [];
}; // clean

// load

var loadedmap = {};
var loadingmap = {};
var initializedmap = {};

var modulemap = game.modulemap;
var manifestmap = game.manifestmap;

var loadImage = function(file, cb) {
	var img = document.createElement('img');
	img.addEventListener('load', cb);
	img.src = baseurl + 'img/' + file.replace(/\./g, '/').toLowerCase() + '.png';
}; // loadImage

var loadJSON = function(module, cb) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', baseurl + 'json/' + module.replace(/\./g, '/').toLowerCase() + '.json', true);

	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			var parts = module.split('.');
			var part = game;
			for (var i = 0, n = parts.length - 1; i < n; ++i) {
				part = part[parts[i]] = part[parts[i]] || {};
			}

			part[parts[i]] = JSON.parse(xhr.responseText);

			if (cb) {
				cb();
			}
		}
	}; // onreadystatechange

	xhr.send(null);
}; // loadJSON

var loadJS = function(url, cb) {
	if (loadedmap[url]) {
		if (cb) {
			cb();
		}

		return;
	}

	if (loadingmap[url]) {
		if (cb) {
			loadingmap[url][loadingmap[url].length] = cb;
		}

		return;
	}

	loadingmap[url] = cb ? [cb] : [];

	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.async = 'true';
	script.src = url;

	var done = false;
	var ready = function() {
		if (done) {
			return;
		}

		done = true;

		loadedmap[url] = true;
		for (var i = 0, cbs = loadingmap[url]; i < cbs.length; ++i) {
			cbs[i]();
		}

		delete loadingmap[url];

		$head.removeChild(script);
	}; // ready

	script.onload = ready;
	script.onreadystatechange = function() {
		if (!done && this.readyState === 'loaded' || this.readyState === 'complete') {
			ready();
		}
	}

	$head.appendChild(script);
}; // loadJS

var initModule = function(module) {
	var ready = function(ns) {
		var done = function() {
			initializedmap[module] = true;

			for (var i = 0, cbs = loadingmap[module]; i < cbs.length; ++i) {
				cbs[i]();
			}

			delete loadedmap[module];
			delete loadingmap[module];
		}; // done

		if (ns && ns.__init__) {
			ns.__init__(done);
		} else {
			done();
		}
	}; // ready

	var ns = game;
	for (var i = 0, parts = module.split('.'); i < parts.length; ++i) {
		ns = ns[parts[i]];
	}

	ready(ns);
}; // initModule

var loadJSModule = function(module, cb) {
	if (module === 'game') {
		if (cb) {
			cb();
		}

		return;
	}

	if (initializedmap[module]) {
		if (cb) {
			cb();
		}

		return;
	}

	if (loadedmap[module]) {
		loadingmap[module] = loadingmap[module] || [];
		if (cb) {
			loadingmap[module][loadingmap[module].length] = cb;
		}

		initModule(module);
		return;
	}

	if (loadingmap[module]) {
		if (cb) {
			loadingmap[module][loadingmap[module].length] = cb;
		}

		return;
	}

	var pkg = modulemap[module] || module;
	var modules = manifestmap[pkg]; // || undefined

	if (modules) {
		for (var i = 0; i < modules.length; ++i) {
			loadingmap[modules[i]] = [];
		}
	}

	if (cb) {
		loadingmap[module] = [cb];
	}

	loadJS(baseurl + 'js/' + pkg.replace(/\./g, '/').toLowerCase() + '.js', function() {
		if (modules) {
			for (var i = 0; i < modules.length; ++i) {
				var mod = modules[i];
				loadedmap[mod] = true;
				if (loadingmap[mod]) {
					if (loadingmap[mod].length) {
						initModule(mod);
					} else {
						delete loadingmap[mod];
					}
				}
			}

			return;
		}

		loadedmap[module] = true;
		initModule(module);
	}); // loadJS
}; // loadJSModule

var loadJSExt = function(ext, cb) {
	if (loadedmap[ext]) {
		if (cb) {
			cb();
		}

		return;
	}

	if (loadingmap[ext]) {
		if (cb) {
			loadingmap[ext][loadingmap[ext].length] = cb;
		}

		return;
	}

	loadingmap[ext] = cb ? [cb] : [];

	loadJS(baseurl + 'js/' + ext.replace(/\./g, '/').toLowerCase() + '.js', function() {
		loadedmap[ext] = true;
		for (var i = 0, cbs = loadingmap[ext]; i < cbs.length; ++i) {
			cbs[i]();
		}

		delete loadingmap[ext];
	}); // loadJS
}; // loadJSExt

game.load = function(module, cb) {
	if (arguments.length < 2) {
		cb = module;
		module = 'game';
	}

	if (module instanceof Array) {
		var remaining = module.length;
		var ready = function() {
			if (!--remaining && cb) {
				cb();
			}
		}; // ready

		for (var i = 0; i < module.length; ++i) {
			game.load(module[i], ready);
		}

		return;
	}

	var type = module.split('.')[0];
	if (type === 'Ext') { // js ext
		loadJSExt(module, cb);
	} else if (type === 'JSON') { // json files (maps, etc)
		loadJSON(module, cb);
	} else if (type === 'IMG') { // image files
		loadImage(module, cb);
	} else { // js module
		loadJSModule(module, cb);
	}
}; // load

// other

game.rand = function(min, max, decimal) {
	if (min instanceof Array) {
		return min[Math.rand(0, min.length - 1)];
	}

	if (decimal) {
		return (min + (Math.random() * (max - min)))
	}

	return Math.floor(Math.random() * (max - min + 1)) + min;
}; // rand

/*
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
*/

game.yield = function(cb) {
	setTimeout(cb, 1);
}; // yield

game.log = function() {
	if (game.dev) {
		console.log.apply(console, arguments);
	}
}; // log

// init
game.load('Ext.THREE', function() {
	game.load(['Ctrl', 'Renderer', 'HUD', 'Obj.Camera', 'Obj.Light', 'Obj.Player', 'Obj.Wall', 'Obj.Brick', 'Obj.Ball'], game.start);
}); // load

})(window.JSON);
