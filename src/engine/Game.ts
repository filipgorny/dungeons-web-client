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
        "D": "rotateRight",
        " ": "shoot"
    };

    private keysPressed: {} = {};

    private drawer: Drawer;

    private ready: boolean = false;

    constructor(scene: THREE.Scene, camera: THREE.Camera) {
        this.scene = scene;
        this.camera = camera;
    }

    initialize(mapCreator: MapCreator, player: Player) {
        this.player = player;

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

        mapCreator.createMap("mockworld", (map) => {
            this.map = map;
            this.player.character.position.x = this.map.startingPosition[0];
            this.player.character.position.y = this.map.startingPosition[1];

            this.drawer = new CubicTreeJsDrawer(this.scene, map);

            this.drawer.drawMap();

            this.world = new World(this.map, this.player);

            var character = new Character("spider", 3, 4);
            this.world.characters.push(character);
            this.drawer.addObject(character);

            this.ready = true;
        });
    }

    process() {
        if (!this.ready) {
            return;
        }

        for (var key in this.keysPressed) {
            if (this.keysPressed[key]) {

                if (key == "rotateLeft" || key == "rotateRight") {
                    var direction = (key == "rotateRight") ? -1 : 1;

                    this.acceleration['rotation'] += 0.2 * direction * this.speed['rotation'];
                }

                if (key == "moveUp" || key == "moveDown") {
                    var direction = (key == "moveUp") ? -1 : 1;

                    this.acceleration['x'] += Math.sin(this.camera.rotation.y) * direction * this.speed['walk'];
                    this.acceleration['z'] += Math.cos(this.camera.rotation.y) * direction * this.speed['walk'];
                }

                if (key == "shoot") {
                    var bullet = this.player.character.shot();
                    this.world.bullets.push(bullet);
                    this.drawer.addObject(bullet);
                }
            }
        }

        this.player.character.wantToMove.x += this.acceleration['x'];
        this.player.character.wantToMove.y += this.acceleration['z'];

        if (this.world) {
            this.world.move();
        }

        this.player.character.rotation += this.acceleration['rotation'];

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

        this.camera.position.x = this.player.character.position.x;
        this.camera.position.z = this.player.character.position.y;
        this.camera.rotation.y = this.player.character.rotation;

        this.drawer.refresh();
    }
}