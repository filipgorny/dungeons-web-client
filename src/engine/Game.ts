class Game {
    private scene: THREE.Scene;
    private camera: THREE.Camera;

    private player: Player;
    private map: Map;
    private world: World;

    private acceleration: {} = {
        x: 0,
        z: 0,
        rotation: 0
    };

    private accelerationSlowDownSpeed: {} = {
        x: 0.003,
        y: 0.003,
        rotation: 0.002
    };

    private speed: {} = {
        walk: 0.05,
        rotation: 0.3
    };

    private keyMap = {
        "W": "moveUp",
        "S": "moveDown",
        "A": "rotateLeft",
        "D": "rotateRight"
    };

    private keysPressed: {} = {};

    constructor(scene: THREE.Scene, camera: THREE.Camera) {
        this.scene = scene;
        this.camera = camera;

        console.log(this.camera.position);
    }

    initialize(mapCreator: MapCreator, player: Player) {
        this.player = player;

        mapCreator.createMap("mockworld", (map) => {
            this.map = map;
            this.player.position.x = this.map.startingPosition[0];
            this.player.position.y = this.map.startingPosition[1];

            var drawer = new CubicTreeJsDrawer(this.scene, map);

            drawer.drawMap();

            this.world = new World(this.map, this.player);
        });

        document.addEventListener("keydown", (event) => {
            var keyCharacter = String.fromCharCode(event['keyCode']);

            if (this.keyMap[keyCharacter]) {
                this.keysPressed[this.keyMap[keyCharacter]] = true;
            }
        });

        document.addEventListener("keyup", (event) => {
            var keyCharacter = String.fromCharCode(event['keyCode']);

            if (this.keyMap[keyCharacter]) {
                this.keysPressed[this.keyMap[keyCharacter]] = false;
            }
        });
    }

    process() {
        for (var key in this.keysPressed) {
            if (this.keysPressed[key]) {

                if (key == "rotateLeft" || key == "rotateRight") {
                    var direction = (key == "rotateRight") ? -1 : 1;
                    //this.camera.rotation.y += 0.1;
                    this.acceleration['rotation'] += 0.2 * direction * this.speed['rotation'];
                }

                if (key == "moveUp" || key == "moveDown") {
                    var direction = (key == "moveUp") ? -1 : 1;

                    //this.camera.position.x += Math.sin(this.camera.rotation.y) * direction;
                    //this.camera.position.z += Math.cos(this.camera.rotation.y) * direction;

                    this.acceleration['x'] += Math.sin(this.camera.rotation.y) * direction * this.speed['walk'];
                    this.acceleration['z'] += Math.cos(this.camera.rotation.y) * direction * this.speed['walk'];
                }
            }
        }

        this.player.wantToMove.x += this.acceleration['x'];
        this.player.wantToMove.y += this.acceleration['z'];

        if (this.world) {
            this.world.move();
        }

        this.player.rotation += this.acceleration['rotation'];

        var slowDownProperties = ['x', 'z', 'rotation'];

        for (var k in slowDownProperties) {
            var property = slowDownProperties[k];

            if (this.acceleration[property] != 0) {
                var sign = (this.acceleration[property] > 0) ? -1 : 1;

                this.acceleration[property] += ((this.acceleration[property] > 0) ? 1 : -1) * this.accelerationSlowDownSpeed[property];

                if (((this.acceleration[property] > 0) ? -1 : 1) - sign == 0) {
                    this.acceleration[property] = 0;
                }

                if (isNaN(this.acceleration[property])) {
                    this.acceleration[property] = 0;
                }
            }
        }

        this.camera.position.x = this.player.position.x;
        this.camera.position.z = this.player.position.y;
        this.camera.rotation.y = this.player.rotation;
    }
}