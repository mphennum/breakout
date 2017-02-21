(function(game) {

'use strict';

var Renderer = game.Renderer = {};

Renderer.__init__ = function(cb) {
	delete Renderer.__init__;

	game.load(/*'Ext.THREE', */function() {

		var THREE = window.THREE;

		var scene;
		var renderer;
		var camera;

		Renderer.DEFAULT_FOV = 45;
		Renderer.DEFAULT_NEAR = 0.1;
		Renderer.DEFAULT_FAR = 250; // old was 1000

		Renderer.DEFAULT_COLOR = 0xFFFFFF;

		Renderer.DEFAULT_X = 0;
		Renderer.DEFAULT_Y = 0;
		Renderer.DEFAULT_Z = 0;

		Renderer.DEFAULT_CUBE_WIDTH = 1;
		Renderer.DEFAULT_CUBE_HEIGHT = 1;
		Renderer.DEFAULT_CUBE_DEPTH = 1;
		Renderer.DEFAULT_CUBE_SEGMENTS = 1;

		Renderer.DEFAULT_SPHERE_RADIUS = 1;
		Renderer.DEFAULT_SPHERE_SEGMENTS_WIDTH = 3;
		Renderer.DEFAULT_SPHERE_SEGMENTS_HEIGHT = 2;

		Renderer.init = function(opts) {
			opts = opts || {};

			scene = new THREE.Scene();

			renderer = new THREE.WebGLRenderer({'antialias': true});
			renderer.setSize(opts.width || window.innerWidth, opts.height || window.innerHeight);
			game.elemap.$body.appendChild(renderer.domElement);

			// shadows

			renderer.shadowMap.enabled = true;
			//renderer.shadowMapSoft = true;
			renderer.shadowMap.soft = true;
			renderer.shadowMap.type = THREE.PCFSoftShadowMap;

			renderer.shadowCameraNear = opts['shadow-near'] || Renderer.DEFAULT_NEAR;
			renderer.shadowCameraFar = opts['shadow-far'] || Renderer.DEFAULT_FAR;
			renderer.shadowCameraFov = opts['shadow-fov'] || Renderer.DEFAULT_FOV;

			renderer.shadowMapBias = 0.002;
			renderer.shadowMapDarkness = 0.5;
			renderer.shadowMapWidth = 1024;
			renderer.shadowMapHeight = 1024;

			// resize
			game.onresize(function(width, height) {
				renderer.setSize(width, height);
			}); // onresize
		}; // init

		Renderer.render = function() {
			renderer.render(scene, camera);
		}; // render

		Renderer.add = function(mesh) {
			scene.add(mesh);
		}; // add

		Renderer.remove = function(mesh) {
			scene.remove(mesh);
		}; // add

		Renderer.createCamera = function(opts) {
			opts = opts || {};

			camera = new THREE.PerspectiveCamera(
				opts.fov || Renderer.DEFAULT_FOV,
				(opts.width || window.innerWidth) / (opts.height || window.innerHeight),
				opts.near || Renderer.DEFAULT_NEAR,
				opts.far || Renderer.DEFAULT_FAR
			);

			if (!opts.width && !opts.height) {
				game.onresize(function(width, height) {
					camera.aspect = width / height;
					camera.updateProjectionMatrix();
				}); // onresize
			}

			return camera;
		}; // renderCamera

		Renderer.createLight = function(opts) {
			opts = opts || {};

			var light = new THREE.DirectionalLight(opts.color || Renderer.DEFAULT_COLOR, opts.intensity || 2);

			light.castShadow = (opts.shadow !== false);
			//light.shadowDarkness = opts['shadow-darkness'] || 0.5;

			//light.shadowCameraVisible = !!opts['shadow-camera'];
			var far = Renderer.DEFAULT_FAR * 1.5;
			light.shadow.camera.top = opts['shadow-camera-top'] || far;
			light.shadow.camera.bottom = opts['shadow-camera-bottom'] || -far;
			light.shadow.camera.left = opts['shadow-camera-left'] || -far;
			light.shadow.camera.right = opts['shadow-camera-right'] || far;

			return light;
		}; // createLight

		Renderer.createCube = function(opts) {
			opts = opts || {};

			//var material = new THREE.MeshLambertMaterial({
			var material = new THREE.MeshToonMaterial({'color': opts.color || Renderer.DEFAULT_COLOR});

			var cube = new THREE.Mesh(
				new THREE.BoxGeometry(
					opts.width || Renderer.DEFAULT_CUBE_WIDTH,
					opts.height || Renderer.DEFAULT_CUBE_HEIGHT,
					opts.depth || Renderer.DEFAULT_CUBE_DEPTH,
					opts['width-segments'] || Renderer.DEFAULT_CUBE_SEGMENTS,
					opts['height-segments'] || Renderer.DEFAULT_CUBE_SEGMENTS,
					opts['depth-segments'] || Renderer.DEFAULT_CUBE_SEGMENTS
				),
				material
			);

			return cube;
		}; // createCube

		Renderer.createSphere = function(opts) {
			opts = opts || {};

			//var material = new THREE.MeshLambertMaterial({
			var material = new THREE.MeshToonMaterial({'color': opts.color || Renderer.DEFAULT_COLOR});

			var sphere = new THREE.Mesh(
				new THREE.SphereGeometry(
					opts.radius || Renderer.DEFAULT_SPHERE_RADIUS,
					opts['width-segments'] || Renderer.DEFAULT_SPHERE_SEGMENTS_WIDTH,
					opts['height-segments'] || Renderer.DEFAULT_SPHERE_SEGMENTS_HEIGHT
				),
				material
			);

			return sphere;
		}; // createSphere

		if (cb) {
			cb();
		}

	}); // load

}; // __init__

})(window.game);
