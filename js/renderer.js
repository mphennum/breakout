(function(game, THREE) {

'use strict';

var Renderer = game.Renderer = {};

var scene;
var renderer;

Renderer.init = function(opts) {
	opts = opts || {};
	opts.shadow = opts.shadow || {};
	opts.shadow.far = opts.shadow.far || 1000;

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({'antialias': true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	game.elemap.$body.appendChild(renderer.domElement);

	// shadows

	renderer.shadowMap.enabled = true;
	//renderer.shadowMapSoft = true;
	renderer.shadowMap.soft = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	renderer.shadowCameraNear = 3;
	renderer.shadowCameraFar = opts.shadow.far;
	renderer.shadowCameraFov = 45;

	renderer.shadowMapBias = 0.002;
	renderer.shadowMapDarkness = 0.5;
	renderer.shadowMapWidth = 1024;
	renderer.shadowMapHeight = 1024;

	// resize
	game.onresize(function(width, height) {
		renderer.setSize(width, height);
	}); // onresize
}; // init

Renderer.add = function(mesh) {
	scene.add(mesh);
}; // add

Renderer.remove = function(mesh) {
	scene.remove(mesh);
}; // add

Renderer.createCamera = function(opts) {
	opts = opts || {};
	opts.fov = opts.fov || 45;
	opts.width = opts.width || window.innerWidth;
	opts.height = opts.height || window.innerHeight;
	opts.near = opts.near || 1;
	opts.far = opts.far || 1000;

	var camera = new THREE.PerspectiveCamera(opts.fov, opts.width / opts.height, opts.near, opts.far)
	return camera;
}; // renderCamera

Renderer.resizeCamera = function(camera, width, height) {
	width = width || window.innerWidth;
	height = height || window.Height;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
}; // resizeCamera

})(window.game, window.THREE);
