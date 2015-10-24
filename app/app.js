var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var player = new Player(new Character("zombie"));

var mapCreator = new DnmapFileMaps(player);

var game = new Game(scene, camera);

game.initialize(mapCreator, player);

(function render() {
    requestAnimationFrame( render );

    renderer.render( scene, camera );

    game.process();
})();
