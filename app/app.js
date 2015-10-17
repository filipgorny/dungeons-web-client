var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );

// material
var material = new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture('textures/hedgerow.jpg')
});

var cube = new THREE.Mesh( geometry, material );
scene.add( cube );



function render() {
    requestAnimationFrame( render );

    renderer.render( scene, camera );
}
render();

var mapCreator = new DnmapFileMaps();

mapCreator.createMap("mockworld", function(map) {
    var drawer = new CubicTreeJsDrawer(scene, map);

    drawer.drawMap();
    drawer.placeCameraAtStartingPoint(camera);
});

document.addEventListener("keydown", function(event) {
    var keyCharacter = String.fromCharCode(event.keyCode);

    console.log("keydown", keyCharacter);

    if (keyCharacter == "A") {
        camera.rotation.y += 0.1;
    }

    if (keyCharacter == "D") {
        camera.rotation.y -= 0.1;
    }
});
