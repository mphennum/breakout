(function(JSON) {

'use strict';

var game = window.game = {
	'dev': true,
	'over': false,
	'modulemap': {}, // 'Renderer': 'game', ...
	'manifestmap': {}, // 'game': ['Renderer', ...]
	'urlmap': {
		'base': 'http://www.mphennum.com/work/breakout/'
	},
	'elemap': {
		'$head': document.getElementsByTagName('head')[0],
		'$body': document.getElementsByTagName('body')[0]
	},
	'objmap': {}
};

var Obj;
var Renderer;
var objmap = game.objmap;
var $head = game.elemap.$head;

game.start = function() {
	game.log('game.start');
	var timer;
	window.onresize = function() {
		clearTimeout(timer);
		timer = setTimeout(function(event) {
			for (var i = 0; i < resizecbs.length; ++i) {
				resizecbs[i](window.innerWidth, window.innerHeight);
			}
		}, 99);
	}; // onresize

	Obj = game.Obj;

	Renderer = game.Renderer;
	Renderer.init();

	var camera = new Obj.Camera();
	var light = new Obj.Light();

	// loop

	var prev;
	var elapsed;

	var loop = function(ms) {
		elapsed = ms - prev;

		for (var k in objmap) {
			objmap[k].update(elapsed);
		}

		Renderer.render();

		prev = ms;
		requestAnimationFrame(loop);
	}; // loop

	prev = window.performance.now();
	setTimeout(loop.bind(prev), 1);
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
		Renderer.add(obj.mesh);
	}/* else if (obj.children) {
		for (var i = 0, children = obj.children; i < children.length; ++i) {
			Renderer.add(children[i]);
		}
	}*/
}; // add

game.remove = function(obj) {
	if (obj.id) {
		delete objmap[obj.id];
	}

	if (obj.mesh) {
		Renderer.remove(obj.mesh);
	}/* else if (obj.children) {
		for (var i = 0, children = obj.children; i < children.length; ++i) {
			Renderer.remove(children[i]);
		}
	}*/
}; // remove

// load

var loadedmap = {};
var loadingmap = {};
var initializedmap = {};

var modulemap = game.modulemap;
var manifestmap = game.manifestmap;

var loadImage = function(file, cb) {
	var img = document.createElement('img');
	img.addEventListener('load', cb);
	img.src = 'img/' + file.replace(/\./g, '/').toLowerCase() + '.png';
}; // loadImage

var loadJSON = function(module, cb) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'json/' + module.replace(/\./g, '/').toLowerCase() + '.json', true);

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
	if (/renderer/.test(url)) {
		game.log('loadJS', url);
	}

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
	game.log('initModule', module);
	var ready = function(ns) {
		var done = function() {
			initializedmap[module] = true;
			if (!loadingmap[module]) {
				game.log('length of undefined?', loadingmap);
			}
			for (var i = 0, cbs = loadingmap[module]; i < cbs.length; ++i) {
				cbs[i]();
			}

			delete loadingmap[module];
		};

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

	if (module === 'Renderer') {
		game.log('ns', module.split('.'), ns);
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
	var manifest = manifestmap[pkg]; // || undefined

	if (manifest) {
		for (var i = 0; i < manifest.length; ++i) {
			loadingmap[manifest[i]] = [];
		}
	}

	if (cb) {
		loadingmap[module] = [cb];
	}

	loadJS('js/' + pkg.replace(/\./g, '/').toLowerCase() + '.js', function() {
		if (manifest) {
			for (var i = 0; i < manifest.length; ++i) {
				var mod = manifest[i];
				loadedmap[mod] = true;
				if (loadingmap[mod]) {
					if (loadingmap[mod].length) {
						initModule(mod);
					} else {
						delete loadingmap[mod];
					}
				}
			}
		} else {
			loadedmap[module] = true;
			initModule(module);
		}
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

	loadJS('js/' + ext.replace(/\./g, '/').toLowerCase() + '.js', function() {
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

var resizecbs = [];
game.onresize = function(cb) {
	resizecbs[resizecbs.length] = cb;
}; // onresize

game.log = function() {
	if (game.dev) {
		console.log.apply(console, arguments);
	}
}; // log

// init
game.load(['Renderer', 'Obj.Camera', 'Obj.Light', 'Obj.Player'/*, 'Obj.Ball', 'Obj.Brick', 'Obj.Wall', 'Obj.Background'*/], game.start);

})(window.JSON);
