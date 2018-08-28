$(document).click( (event) => {
    var text = $(event.target).text();
    console.log(text);
    console.log(event.target)

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    console.log("mouse down: ",  mouse.x, mouse.y)
    //find intersection with the raycaster

    var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
    projector.unprojectVector( vector, camera );
    var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position).normalize() );

    //create an array containing all objects in the scene with which the ray intersects
    var intersects = ray.intersectObjects( surfaceClickableTargets );

    if( intersects.length > 0){
      console.log("Hit @ " + toString(intersects[0].point));

      //change the color of the closest face
      intersects[0].face.color.setRGB(0.8 * Math.random() + 0.2, 0, 0);
      intersects[0].object.geometry.colorsNeedUpdate = true;
    }
});

window.addEventListener( 'keydown', function( event ){
  switch(event.keyCode) {
    case 81: // Q
      transformControl.setSpace( transformControl.space === "local" ? "world" : "local" );
      break;
    case 17: // ctrl

      break;
    case 83: //s: scale
      console.log("scale mode");
      transformControl.setMode("scale");
      break;

    case 87: //w: translate
      console.log("translating mode");
      transformControl.setMode("translate");
      break;

    case 82: // r: rotate
      console.log("rotation mode");
      transformControl.setMode("rotate");
      break;
  }
});
