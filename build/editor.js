var camera, scene, renderer, controls;
var plane;
var mouse, raycaster, isShiftDown = false;

var rollOverMesh, rollOverMaterial;
var cubeGeo, cubeMaterial, selectedColor;

var objects = [];

init();
render();


function init() {

  // document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.set( 500, 800, 1300 );
  camera.lookAt( 0, 0, 0 );

  scene = new THREE.Scene();
  scene.add( new THREE.AmbientLight( 0x505050 ) );

  //roll-over helpers
  var rollOverGeo = new THREE.BoxBufferGeometry( 50, 50, 50 );
  rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
  rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
  scene.add( rollOverMesh );


  //cube
  cubeGeo = new THREE.BoxBufferGeometry( 50, 50, 50 );

	// grid
  var grid = new THREE.GridHelper( 1000, 20, 0x888888, 0xcccccc );
  scene.add( grid );

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
  geometry.rotateX( - Math.PI / 2 );

  plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
  scene.add( plane );

  objects.push( plane );

    //lights
  scene.add( new THREE.AmbientLight( 0x505050 ) );
  var light = new THREE.SpotLight( 0xffffff, 1.5 );
  light.position.set( 0, 500, 2000 );
  light.castShadow = true;
  light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 200, 10000 ) );
  light.shadow.bias = - 0.00022;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  scene.add( light );

  var directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
  scene.add( directionalLight );


  //renderer
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor( 0xf0f0f0 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.sortObjects = false;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  // container.appendChild( renderer.domElement );

  document.body.appendChild( renderer.domElement );

  document.body.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.body.addEventListener( 'mousedown', onDocumentMouseDown, true );
  document.body.addEventListener( 'keydown', onDocumentKeyDown, false );
  document.body.addEventListener( 'keyup', onDocumentKeyUp, false );

  window.addEventListener( 'resize', onWindowResize, false );


  controls = new THREE.TrackballControls( camera, renderer.domElement );
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  // individual pixel control
  // transformControl = new THREE.TransformControls( camera, renderer.domElement );
  // scene.add(transformControl);

  // var materialNormal = new THREE.MeshNormalMaterial();
  // var dragControls = new THREE.DragControls( objects, camera, renderer.domElement );
  // dragControls.addEventListener( 'dragstart', function ( event ) { controls.enabled = false; } );
  // dragControls.addEventListener( 'dragend', function ( event ) { controls.enabled = true; } );

  stats = new Stats();
  container.appendChild( stats.dom );


} //end of init()

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {

    console.log("mouse moved")
	event.preventDefault();

	mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( objects );

	if ( intersects.length > 0 ) {

		var intersect = intersects[ 0 ];

		rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
		rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );

	}
	render();

}

function onDocumentMouseDown( event ) {

// $('body').on('mousedown', function(event) {

    console.log("mouse down: ", event)
	event.preventDefault();

	mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( objects );

	if ( intersects.length > 0 ) {
		var intersect = intersects[ 0 ];

		// delete cube
		if ( isShiftDown ) {

			if ( intersect.object !== plane ) {
				scene.remove( intersect.object );
				objects.splice( objects.indexOf( intersect.object ), 1 );
			}

		// create cube
		} else {

            switch (selectedColor){
            //
                case 1: //white

                    cubeMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );
                    break;
                case 2: //Blue

                    cubeMaterial = new THREE.MeshPhongMaterial(
                        { color: 0x0707a8, specular: 0x111111, shininess: 200, opacity:0.5 } );
                    break;
                case 3: //yellow

                    cubeMaterial = new THREE.MeshPhongMaterial(
                        { color: 0xf5e618, specular: 0x111111, shininess: 200, opacity:0.5 } );
                    break;
                case 4: //orange

                    cubeMaterial = new THREE.MeshPhongMaterial(
                        { color: 0xfcb103, specular: 0x111111, shininess: 200, opacity:0.5 } );
                    break;

                case 5: //black
                    cubeMaterial = new THREE.MeshPhongMaterial(
                        { color: 0x000000, specular: 0x111111, shininess: 200, opacity:0.5 } );
                    break;
            }

			var voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
			voxel.position.copy( intersect.point ).add( intersect.face.normal );
			voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
			scene.add( voxel );

			objects.push( voxel );
		}
		render();
	}

}

function onDocumentKeyDown( event ) {

    console.log("shift key pressed")
	switch ( event.keyCode ) {
		case 16: isShiftDown = true; break;

	}

}

function onDocumentKeyUp( event ) {

	switch ( event.keyCode ) {
		case 16: isShiftDown = false; break;

	}

}


function animate() {
  requestAnimationFrame( animate );

  render();
  stats.update();
}

function render() {

  update();
  controls.update();
  renderer.render( scene, camera );
}


function update() {

}
