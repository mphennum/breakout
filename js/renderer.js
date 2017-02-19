(function(game, THREE) {

'use strict';

var Renderer = game.Renderer = {};

var scene;
var renderer;

Renderer.init = function() {
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({'antialias': true});
	renderer.setSize(winow.innerWidth, window.innerHeight);
	game.$body.appendChild(renderer.domElement);

	// shadows
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowMapType = THREE.PCFSoftShadowMap;

	renderer.shadowCameraNear = 3;
	renderer.shadowCameraFar = opts.camera.far;
	renderer.shadowCameraFov = 45;

	renderer.shadowMapBias = 0.002;
	renderer.shadowMapDarkness = 0.5;
	renderer.shadowMapWidth = 1024;
	renderer.shadowMapHeight = 1024;
}; // init

Renderer.add = function(mesh) {
	scene.add(mesh);
}; // add

Renderer.remove = function(mesh) {
	scene.remove(mesh);
}; // add

})(window.game, window.THREE);
