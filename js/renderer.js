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

			renderer.shadowCameraNear = opts['shadow-near'] || 1;
			renderer.shadowCameraFar = opts['shadow-far'] || 1000;
			renderer.shadowCameraFov = opts['shadow-fov'] || 45;

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
				opts.fov || 45,
				(opts.width || window.innerWidth) / (opts.height || window.innerHeight),
				opts.near || 1,
				opts.far || 1000
			);

			game.onresize(function(width, height) {
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
			}); // onresize

			return camera;
		}; // renderCamera

		Renderer.createLight = function(opts) {
			opts = opts || {};

			var light = new THREE.DirectionalLight(opts.color || 0xFFFFFF, opts.intensity || 1);

			light.castShadow = (opts.shadow !== false);
			//light.shadowDarkness = opts['shadow-darkness'] || 0.5;

			//light.shadowCameraVisible = !!opts['shadow-camera'];
			light.shadow.camera.top = opts['shadow-camera-top'] || 150;
			light.shadow.camera.bottom = opts['shadow-camera-bottom'] || 150;
			light.shadow.camera.left = opts['shadow-camera-left'] || 150;
			light.shadow.camera.right = opts['shadow-camera-right'] || 150;

			return light;
		}; // createLight

		Renderer.createCube = function(opts) {
			opts = opts || {};

			//var material = new THREE.MeshLambertMaterial({
			var material = new THREE.MeshToonMaterial({
				'color': opts.color || 0xFFFFFF
			});

			var cube = new THREE.Mesh(
				new THREE.BoxGeometry(
					opts.width || 1,
					opts.height || 1,
					opts.depth || 1,
					opts['width-segments'] || 1,
					opts['height-segments'] || 1,
					opts['depth-segments'] || 1
				),
				material
			);

			return cube;
		}; // createCube

		Renderer.createSphere = function(opts) {
			opts = opts || {};

			//var material = new THREE.MeshLambertMaterial({
			var material = new THREE.MeshToonMaterial({
				'color': opts.color || 0xFFFFFF
			});

			var sphere = new THREE.Mesh(
				new THREE.SphereGeometry(
					opts.radius || 1,
					opts['width-segments'] || 3,
					opts['height-segments'] || 2
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
