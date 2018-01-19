var scene, camera, renderer, mesh, clock;
var meshFloor, ambientLight, light;

var crate, crateTexture, crateNormalMap, crateBumpMap;

var keyboard = {};
var player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.01 };
var USE_WIREFRAME = false;

var loadingScreen = {
	scene: new THREE.Scene(),
	camera: new THREE.PerspectiveCamera(90, 1280/720, 0.1, 100),
	box: new THREE.Mesh(
		new THREE.BoxGeometry(0.5,0.5,0.5),
		new THREE.MeshBasicMaterial({ color:0x4444ff })
	)
};
var loadingManager = null;
var RESOURCES_LOADED = false;

// Models index
var models = {
	sunflower: {
		obj:"models/sunflower.obj",
		mtl:"models/sunflower.mtl",
		mesh: null,
		castShadow: true
	},
	sword: {
		obj:"models/sword.obj",
		mtl:"models/sword.mtl",
		mesh: null,
		castShadow: true
	},
	wall: {
		obj:"models/simplewall.obj",
		mtl:"models/simplewall.mtl",
		mesh: null,
	},
	rock: {
		obj:"models/rock.obj",
		mtl:"models/rock.mtl",
		mesh: null,
	},
	human: {
		obj:"models/HUMAN.obj",
		mtl:"models/HUMAN.mtl",
		mesh: null,
		castShadow: true
	}
};

// Meshes index
var meshes = {};


function init(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000);
	clock = new THREE.Clock();
	
	
	loadingScreen.box.position.set(0,0,5);
	loadingScreen.camera.lookAt(loadingScreen.box.position);
	loadingScreen.scene.add(loadingScreen.box);
	
	loadingManager = new THREE.LoadingManager();
	loadingManager.onProgress = function(item, loaded, total){
		console.log(item, loaded, total);
	};
	loadingManager.onLoad = function(){
		console.log("loaded all resources");
		RESOURCES_LOADED = true;
		onResourcesLoaded();
	};
	
	meshFloor = new THREE.Mesh(
		new THREE.PlaneGeometry(30,30, 10,10),
		new THREE.MeshPhongMaterial({color:0xffffff, wireframe:USE_WIREFRAME})
	);
	meshFloor.rotation.x -= Math.PI / 2;
	meshFloor.receiveShadow = true;
	scene.add(meshFloor);
	
	
	ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);
	
	light = new THREE.PointLight(0xffffff, 0.8, 18);
	light.position.set(-3,10,-3);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 100;
	scene.add(light);
	
	
	var textureLoader = new THREE.TextureLoader(loadingManager);
	crateTexture = textureLoader.load("crate0/crate0_diffuse.jpg");
	crateBumpMap = textureLoader.load("crate0/crate0_bump.jpg");
	crateNormalMap = textureLoader.load("crate0/crate0_normal.jpg");
	
	crate = new THREE.Mesh(
		new THREE.BoxGeometry(3,3,3),
		new THREE.MeshPhongMaterial({
			color:0xffffff,
			map:crateTexture,
			bumpMap:crateBumpMap,
			normalMap:crateNormalMap
		})
	);
	scene.add(crate);
	crate.position.set(2.5, 3/2, 2.5);
	crate.receiveShadow = true;
	crate.castShadow = true;
	
	// Load models
	// REMEMBER: Loading in Javascript is asynchronous, so you need
	// to wrap the code in a function and pass it the index. If you
	// don't, then the index '_key' can change while the model is being
	// downloaded, and so the wrong model will be matched with the wrong
	// index key.
	for( var _key in models ){
		(function(key){
			
			var mtlLoader = new THREE.MTLLoader(loadingManager);
			mtlLoader.load(models[key].mtl, function(materials){
				materials.preload();
				
				var objLoader = new THREE.OBJLoader(loadingManager);
				
				objLoader.setMaterials(materials);
				objLoader.load(models[key].obj, function(mesh){
					
					mesh.traverse(function(node){
						if( node instanceof THREE.Mesh ){
							if('castShadow' in models[key])
								node.castShadow = models[key].castShadow;
							else
								node.castShadow = true;
							
							if('receiveShadow' in models[key])
								node.receiveShadow = models[key].receiveShadow;
							else
								node.receiveShadow = true;
						}
					});
					models[key].mesh = mesh;
					
				});
			});
			
		})(_key);
	}
	
	
	camera.position.set(0, player.height, -5);
	camera.lookAt(new THREE.Vector3(0,player.height,0));
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(1280, 720);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	
	document.body.appendChild(renderer.domElement);
	
	animate();
}

// Runs when all resources are loaded
function onResourcesLoaded(){
	
	// Clone models into meshes.
	meshes["sunflower1"] = models.sunflower.mesh.clone();
	meshes["sunflower2"] = models.sunflower.mesh.clone();
	meshes["sunflower3"] = models.sunflower.mesh.clone();
	meshes["sunflower4"] = models.sunflower.mesh.clone();
	meshes["sunflower5"] = models.sunflower.mesh.clone();
	
	meshes["wall1"] = models.wall.mesh.clone();
	meshes["wall2"] = models.wall.mesh.clone();
	meshes["wall3"] = models.wall.mesh.clone();
	meshes["wall4"] = models.wall.mesh.clone();
	meshes["wall5"] = models.wall.mesh.clone();
	meshes["wall6"] = models.wall.mesh.clone();
	meshes["wall7"] = models.wall.mesh.clone();
	meshes["wall8"] = models.wall.mesh.clone();
	meshes["wall9"] = models.wall.mesh.clone();
	meshes["wall10"] = models.wall.mesh.clone();
	meshes["wall11"] = models.wall.mesh.clone();
	meshes["wall12"] = models.wall.mesh.clone();
	
	meshes["rock1"] = models.rock.mesh.clone();
	meshes["rock2"] = models.rock.mesh.clone();
	meshes["rock3"] = models.rock.mesh.clone();
	meshes["rock4"] = models.rock.mesh.clone();
	meshes["rock5"] = models.rock.mesh.clone();
	meshes["rock6"] = models.rock.mesh.clone();
	meshes["rock7"] = models.rock.mesh.clone();
	meshes["rock8"] = models.rock.mesh.clone();
	
	meshes["HUMAN1"] = models.human.mesh.clone();
	
	// Reposition individual meshes, then add meshes to scene
	meshes["sunflower1"].position.set(9, 3, 8);
	meshes["sunflower1"].rotation.set(0, Math.PI, 0);
	meshes["sunflower1"].scale.set(0.5,0.5,0.5);
	scene.add(meshes["sunflower1"]);
	
	meshes["sunflower2"].position.set(4, 3, 8);
	meshes["sunflower2"].rotation.set(0, Math.PI, 0);
	meshes["sunflower2"].scale.set(0.5,0.5,0.5);
	scene.add(meshes["sunflower2"]);
	
	meshes["sunflower3"].position.set(-1, 3, 8);
	meshes["sunflower3"].rotation.set(0, Math.PI, 0);
	meshes["sunflower3"].scale.set(0.5,0.5,0.5);
	scene.add(meshes["sunflower3"]);
	
	meshes["sunflower4"].position.set(-6, 3, 8);
	meshes["sunflower4"].rotation.set(0, Math.PI, 0);
	meshes["sunflower4"].scale.set(0.5,0.5,0.5);
	scene.add(meshes["sunflower4"]);
	
	meshes["sunflower5"].position.set(-11, 3, 8);
	meshes["sunflower5"].rotation.set(0, Math.PI, 0);
	meshes["sunflower5"].scale.set(0.5,0.5,0.5);
	scene.add(meshes["sunflower5"]);
	
	meshes["wall1"].position.set(-15, -1, 3);
	meshes["wall1"].rotation.set(0, Math.PI/2, 0);
	meshes["wall1"].scale.set(1,1,1);
	scene.add(meshes["wall1"]);	
	
	meshes["wall2"].position.set(-15, -1, -4.5);
	meshes["wall2"].rotation.set(0, Math.PI/2, 0);
	meshes["wall2"].scale.set(1,1,1);
	scene.add(meshes["wall2"]);	
	
	meshes["wall3"].position.set(-15, -1, -12);
	meshes["wall3"].rotation.set(0, Math.PI/2, 0);
	meshes["wall3"].scale.set(1,1,1);
	scene.add(meshes["wall3"]);	
	
	meshes["wall4"].position.set(-15, -1, 10.5);
	meshes["wall4"].rotation.set(0, Math.PI/2, 0);
	meshes["wall4"].scale.set(1,1,1);
	scene.add(meshes["wall4"]);	
	
	meshes["wall5"].position.set(15, -1, 3);
	meshes["wall5"].rotation.set(0, Math.PI/2, 0);
	meshes["wall5"].scale.set(1,1,1);
	scene.add(meshes["wall5"]);	
	
	meshes["wall6"].position.set(15, -1, -4.5);
	meshes["wall6"].rotation.set(0, Math.PI/2, 0);
	meshes["wall6"].scale.set(1,1,1);
	scene.add(meshes["wall6"]);	
	
	meshes["wall7"].position.set(15, -1, -12);
	meshes["wall7"].rotation.set(0, Math.PI/2, 0);
	meshes["wall7"].scale.set(1,1,1);
	scene.add(meshes["wall7"]);	
	
	meshes["wall8"].position.set(15, -1, 10.5);
	meshes["wall8"].rotation.set(0, Math.PI/2, 0);
	meshes["wall8"].scale.set(1,1,1);
	scene.add(meshes["wall8"]);	
	
	meshes["wall9"].position.set(11, -1, 14);
	meshes["wall9"].rotation.set(0, 0, 0);
	meshes["wall9"].scale.set(1,1,1);
	scene.add(meshes["wall9"]);	
	
	meshes["wall10"].position.set(3.5, -1, 14);
	meshes["wall10"].rotation.set(0, 0, 0);
	meshes["wall10"].scale.set(1,1,1);
	scene.add(meshes["wall10"]);	
	
	meshes["wall11"].position.set(-4, -1, 14);
	meshes["wall11"].rotation.set(0, 0, 0);
	meshes["wall11"].scale.set(1,1,1);
	scene.add(meshes["wall11"]);

	meshes["wall12"].position.set(-11, -1, 14);
	meshes["wall12"].rotation.set(0, 0, 0);
	meshes["wall12"].scale.set(1,1,1);
	scene.add(meshes["wall12"]);	
	
	meshes["rock1"].position.set(-13, 0, 8);
	meshes["rock1"].rotation.set(0, 0, 0);
	meshes["rock1"].scale.set(0.5,0.5,0.5);
	scene.add(meshes["rock1"]);	
	
	meshes["rock2"].position.set(-1, 0, 7);
	meshes["rock2"].rotation.set(0, 0, 0);
	meshes["rock2"].scale.set(0.5,0.5,0.5);
	scene.add(meshes["rock2"]);	
	
	meshes["rock3"].position.set(-10, 0, -4);
	meshes["rock3"].rotation.set(0, 0, 0);
	meshes["rock3"].scale.set(0.5,0.5,0.5);
	scene.add(meshes["rock3"]);	
	
	meshes["rock4"].position.set(-5, 0, -6);
	meshes["rock4"].rotation.set(0, 0, 0);
	meshes["rock4"].scale.set(0.5,0.5,0.5);
	scene.add(meshes["rock4"]);	
	
	meshes["rock5"].position.set(-5, 0, 9);
	meshes["rock5"].rotation.set(0, 0, 0);
	meshes["rock5"].scale.set(0.5,0.5,0.5);
	scene.add(meshes["rock5"]);
	
	meshes["rock6"].position.set(0, 0, -4);
	meshes["rock6"].rotation.set(0, 0, 0);
	meshes["rock6"].scale.set(0.5,0.5,0.5);
	scene.add(meshes["rock6"]);
	
	meshes["rock7"].position.set(8, 0, -2);
	meshes["rock7"].rotation.set(0, 0, 0);
	meshes["rock7"].scale.set(0.5,0.5,0.5);
	scene.add(meshes["rock7"]);
	
	meshes["rock8"].position.set(12, 0, -3);
	meshes["rock8"].rotation.set(0, 0, 0);
	meshes["rock8"].scale.set(0.5,0.5,0.5);
	scene.add(meshes["rock8"]);
	
	meshes["HUMAN1"].position.set(0, 0, 0);
	meshes["HUMAN1"].rotation.set(0, 0, 0);
	meshes["HUMAN1"].scale.set(1,1,1);
	scene.add(meshes["HUMAN1"]);
	
	//PLAYER WEAPON NGIHUY
	meshes["playerweapon"] = models.sword.mesh.clone();
	meshes["playerweapon"].position.set(0,0,0);
	meshes["playerweapon"].scale.set(0.004,0.004,0.004);
	meshes["playerweapon"].rotation.set(Math.PI/3, Math.PI/2, 0);
	scene.add(meshes["playerweapon"]);
	
}

function animate(){
	
	// Play the loading screen until resources are loaded.
	if( RESOURCES_LOADED == false ){
		requestAnimationFrame(animate);
		
		loadingScreen.box.position.x -= 0.05;
		if( loadingScreen.box.position.x < -10 ) loadingScreen.box.position.x = 10;
		loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);
		
		renderer.render(loadingScreen.scene, loadingScreen.camera);
		return;
	}
	
	requestAnimationFrame(animate);
	
	var time = Date.now() * 0.0005;
	var delta = clock.getDelta();
	
	if(keyboard[87]){ // W key
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[83]){ // S key
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[65]){ // A key
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
	}
	if(keyboard[68]){ // D key
		camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
	}
	
	if(keyboard[37]){ // left arrow key
		camera.rotation.y -= player.turnSpeed;
	}
	if(keyboard[39]){ // right arrow key
		camera.rotation.y += player.turnSpeed;
	}
	
	meshes["playerweapon"].position.set(
		camera.position.x - Math.sin(camera.rotation.y + Math.PI/4) * 0.75,
		camera.position.y - 0.1 + Math.sin(time*4 + camera.position.x + camera.position.y)*0.01,
		camera.position.z + Math.cos(camera.rotation.y + Math.PI/4) * 0.75
	);
	
	meshes["playerweapon"].rotation.set(
		camera.rotation.x,
		camera.rotation.y,
		camera.rotation.z
	);
	
	renderer.render(scene, camera);
}

function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;

