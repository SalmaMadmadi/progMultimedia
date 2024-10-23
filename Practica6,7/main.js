import * as THREE from "three";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";

var container;
var camera, scene, renderer, controls;

// raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
var intersects = [];
var diamante = new Image();

//canvas
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var canvasTexture;
var canvasOn = false;

init();
animate();
var tv, steve, bee, pig, totem, table, slime, mando;

var pos_steve = {x: -20, y:90};
var s_steve;
var i_steve = "./textures/quieto.png";


function drawCanvas()
{
  var cielo = new Image();
  cielo.src = './textures/cielo.jpg';
  cielo.onload = function() {
      ctx.drawImage(cielo, 0, 0);
  };

  var img = new Image();
  img.src = './textures/tierra.jpg';
  img.onload = function() {
    for(let i = 0; i < 5; i++)
      ctx.drawImage(img, 100*i, 120);
  };

  var arbol = new Image();
  arbol.src = './textures/arbol.png';
  arbol.onload = function() {
      ctx.drawImage(arbol, 80, 80);
  };

  s_steve = new Image();
  s_steve.src = i_steve;
  s_steve.onload = function() {
      ctx.drawImage(s_steve, pos_steve.x, pos_steve.y);
  };

  if(diamante != null)
  {
    diamante.src = './textures/diamante.png';
    diamante.onload = function() {
        ctx.drawImage(diamante, 140, 40);
    }
  }


}

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.set(0, 20, 150);


  // scene
  scene = new THREE.Scene();

  var pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(10, 100, 100);
  pointLight.castShadow = true;
  camera.add(pointLight);
  pointLight.shadow.mapSize.width = 512; // default
  pointLight.shadow.mapSize.height = 512; // default
  pointLight.shadow.camera.near = 0.5; // default
  pointLight.shadow.camera.far = 500; // default
  scene.add(pointLight);
  scene.add(camera);

  const texture = new THREE.TextureLoader().load(
    "./textures/Minecraft.jpg"
  );

  // model
  function onProgress(xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log("model " + Math.round(percentComplete, 2) + "% downloaded");
    }
  }

  function onError() {
    console.log("An error happened");
  }

  const loader = new GLTFLoader();

  loader.load("./models/tv.glb", function cargar(gltf){
    tv = gltf.scene;
    tv.position.set(30, 8, 10);
    tv.rotation.y = 100;
    tv.scale.set(5, 5, 5);
    tv.traverse(function (node) {
      //Cylinder_Screen_0 es el nodo de la pantalla
      if (node.isMesh && node.name == "Cylinder_Screen_0") {
        node.material.map = texture;
        node.name = "Pantalla";
      } else {
      node.name = "Tv";
      }
    });
    tv.castShadow = true;
    scene.add(tv);
  }, onProgress, onError);

  loader.load("./models/steve.glb", function cargar(gltf){
    steve = gltf.scene;
    steve.position.y = 15.5;
    steve.rotation.y = Math.PI / 4;
    steve.traverse(function (node) {
      node.name = "Steve";
    });
    steve.castShadow = true;
    steve.name = "Steve";
    scene.add(steve);
  }, onProgress, onError);

  loader.load("./models/bee.glb", function cargar(gltf){
    bee = gltf.scene;
    bee.position.set(20, 20, -10);
    bee.rotation.y = -10;
    bee.castShadow = true;
    bee.name = "Bee";
    scene.add(bee);

    var bajar = new TWEEN.Tween(bee.position)
    .to({x: bee.position.x, y: 30, z: bee.position.z}, 2000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onComplete(function () {
      subir.start();
    });
  
    var subir = new TWEEN.Tween(bee.position)
      .to({x: bee.position.x, y: 20, z: bee.position.z}, 2000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(function () {
        bajar.start();
    });

    bajar.start();

  }, onProgress, onError);

  loader.load("./models/pig.glb", function cargar(gltf){
    pig = gltf.scene;
    pig.position.x = -40;
    pig.position.y = -0.5;
    pig.scale.set(20, 20, 20);
    pig.castShadow = true;
    pig.name = "Pig";
    scene.add(pig);
  }, onProgress, onError);

  loader.load("./models/totem.glb", function cargar(gltf){
    totem = gltf.scene;
    totem.position.x = 20;
    totem.position.set(-5, 3, 20);
    totem.scale.set(0.1, 0.1, 0.1);
    totem.castShadow = true;
    totem.name = "Totem";
    scene.add(totem);

    var bajar = new TWEEN.Tween(totem.position)
    .to({x: totem.position.x, y: 5, z: totem.position.z}, 2000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onComplete(function () {
      subir.start();
    });

    var subir = new TWEEN.Tween(totem.position)
      .to({x: totem.position.x, y: 3, z: totem.position.z}, 2000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(function () {
        bajar.start();
    });
  
    bajar.start();
    
  }, onProgress, onError);

  loader.load("./models/table.glb", function cargar(gltf){
    table = gltf.scene;
    table.position.x = 20;
    table.position.set(30, 0, 10);
    table.rotation.set(0, -Math.PI/4,0);
    table.scale.set(10, 10, 10);
    table.castShadow = true;
    table.name = "Table";
    scene.add(table);
  }, onProgress, onError);

  loader.load("./models/slime.glb", function cargar(gltf){
    slime = gltf.scene;
    slime.position.x = 20;
    slime.position.set(30, 3, 10);
    slime.rotation.set(0, -Math.PI/4,0);
    slime.castShadow = true;
    slime.name = "Slime";
    scene.add(slime);

    var aumenta = new TWEEN.Tween(slime.scale)
    .to({x: 1, y: 1, z: 1}, 2000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onComplete(function () {
      disminuye.start();
    });

    var disminuye = new TWEEN.Tween(slime.scale)
      .to({x: 0.9, y: 0.9, z: 0.9}, 2000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(function () {
        aumenta.start();
    });

    disminuye.start();

  }, onProgress, onError);

  loader.load("./models/mando.glb", function cargar(gltf){
    mando = gltf.scene;
    mando.position.x = 20;
    mando.position.set(32, 9.8, 15);
    mando.scale.set(4,4,4);
    mando.rotation.set(0, -Math.PI/4,0);
    mando.castShadow = true;
    mando.traverse(function (node) {
      node.name = "Mando";
    });

    scene.add(mando);
  }, onProgress, onError);

    /////////////////////////////////////
   ///////        SUELO        /////////
  /////////////////////////////////////
  var floorTexture = new THREE.TextureLoader().load( "./textures/cesped.jpg" );
	floorTexture.wrapS = THREE.RepeatWrapping;
	floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.repeat.set( 100, 100 );
	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
  floor.receiveShadow = true;
	scene.add(floor);

    ///////////
	 // CIELO //
	///////////
  let materialArray = [];
  let texture_ft = new THREE.TextureLoader().load("./textures/front.png");
  let texture_bk = new THREE.TextureLoader().load("./textures/back.png");
  let texture_up = new THREE.TextureLoader().load("./textures/up.png");
  let texture_dn = new THREE.TextureLoader().load("./textures/down.png");
  let texture_rt = new THREE.TextureLoader().load("./textures/right.png");
  let texture_lf = new THREE.TextureLoader().load("./textures/left.png");

  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft, side: THREE.BackSide }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk, side: THREE.BackSide }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up, side: THREE.BackSide }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn, side: THREE.BackSide }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt, side: THREE.BackSide }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf, side: THREE.BackSide }));

	var skyBoxGeometry = new THREE.BoxGeometry( 1000, 1000, 1000 );
	var skyBox = new THREE.Mesh( skyBoxGeometry, materialArray );
	scene.add(skyBox);

  renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  controls = new TrackballControls(camera, renderer.domElement);

  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.2;

  window.addEventListener("resize", onWindowResize, false);
}

function onClic( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycaster.setFromCamera( pointer, camera );
	intersects = raycaster.intersectObjects( scene.children );
	for ( let i = 0; i < intersects.length; i ++ )
	{
    if(intersects[i].object.name == "Mando")
    {
      if(!canvasOn)
      {
        canvasTexture = new THREE.CanvasTexture(canvas);
        var canvasMaterial = new THREE.MeshBasicMaterial({map: canvasTexture});
        tv.material = canvasMaterial;
        tv.traverse(function (node) {
          if (node.isMesh && node.name == "Pantalla") {
            node.material = canvasMaterial;
          } 
        });
        canvasOn = true;

      } else {
        const caminar = new TWEEN.Tween(pos_steve)
        .to({x: pos_steve.x + 60, y: 90}, 4000) 
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          i_steve = './textures/derecha.png';
        })
        .onComplete(function () {
          i_steve = './textures/quieto.png';
          saltar.start();
        })
        .start();

        const saltar = new TWEEN.Tween(pos_steve)
        .to({x: pos_steve.x + 120, y: pos_steve.y - 20}, 4000) 
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          i_steve = './textures/salta.png';
        })
        .onComplete(function () {
          i_steve = './textures/quieto.png';
          saltar2.start();
        });

        const saltar2 = new TWEEN.Tween(pos_steve)
        .to({x: pos_steve.x + 180, y: pos_steve.y - 50}, 4000) 
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          i_steve = './textures/salta.png';
        })
        .onComplete(function () {
          i_steve = './textures/quieto.png';
          bajar.start();
        });
        
        const bajar = new TWEEN.Tween(pos_steve)
        .to({x: pos_steve.x + 230, y: 90}, 4000) 
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          i_steve = './textures/bajar.png';
        })
        .onComplete(function () {
          i_steve = './textures/quieto.png';
          bailar.start();
        });

        const bailar = new TWEEN.Tween(pos_steve)
        .to({x: pos_steve.x + 230, y: 80}, 500) 
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          i_steve = './textures/bajar.png';
        })
        .onComplete(function () {
          bailar2.start();
        });

        const bailar2 = new TWEEN.Tween(pos_steve)
        .to({x: pos_steve.x + 230, y: 90}, 500) 
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          i_steve = './textures/bajar2.png';
        })
        .onComplete(function () {
          bailar.start();
        });
      }
    }

	}
}

window.addEventListener( 'click', onClic );

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.handleResize();
}

function animate() {
  if(canvasTexture != null)
    canvasTexture.needsUpdate = true;
  requestAnimationFrame(animate);
  if(totem != null)
    totem.rotation.y += 0.005;
  if(pos_steve != null)
  {
    if(pos_steve.x > 300)
      pos_steve = {x: -20, y:90};
    if(pos_steve.y <= 50)
      diamante = null;
  }
  
  
  TWEEN.update();
  controls.update();
  
  drawCanvas();
  render();
}

function render() {
  renderer.render(scene, camera);
}

