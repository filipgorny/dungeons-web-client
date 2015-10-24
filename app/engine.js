var Bullet = (function () {
    function Bullet(name, x, y, angle, speed) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (angle === void 0) { angle = 0; }
        if (speed === void 0) { speed = 0; }
        this.position = {
            x: 0,
            y: 0
        };
        this.size = 0.5;
        this.name = name;
        this.position.x = x;
        this.position.y = y;
        this.angle = angle;
        this.speed = speed;
    }
    return Bullet;
})();

var Character = (function () {
    function Character(name, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.position = {
            x: 0,
            y: 0
        };
        this.wantToMove = {
            x: 0,
            y: 0
        };
        this.size = 1;
        this.rotation = 0;
        this.name = name;
        this.position.x = x;
        this.position.y = y;
    }
    Character.prototype.shot = function () {
        var bullet = new Bullet("plasma", this.position.x, this.position.y, this.rotation, -0.1);
        return bullet;
    };
    return Character;
})();

var Map = (function () {
    function Map() {
        this.tiles = [];
        this.startingPosition = [0, 0];
    }
    Map.prototype.defineTile = function (x, y, tile) {
        if (!(this.tiles[x])) {
            this.tiles[x] = [];
        }
        this.tiles[x][y] = tile;
    };
    return Map;
})();

///<reference path='./Map.ts' />

var Game = (function () {
    function Game(scene, camera) {
        this.acceleration = {
            x: 0,
            z: 0,
            rotation: 0
        };
        this.accelerationSlowDownSpeed = {
            x: 0.003,
            y: 0.003,
            rotation: 0.002
        };
        this.speed = {
            walk: 0.05,
            rotation: 0.3
        };
        this.keyMap = {
            "W": "moveUp",
            "S": "moveDown",
            "A": "rotateLeft",
            "D": "rotateRight",
            " ": "shoot"
        };
        this.keysPressed = {};
        this.ready = false;
        this.scene = scene;
        this.camera = camera;
    }
    Game.prototype.initialize = function (mapCreator, player) {
        var _this = this;
        this.player = player;
        document.addEventListener("keydown", function (event) {
            var keyCharacter = String.fromCharCode(event['keyCode']);
            if (_this.keyMap[keyCharacter]) {
                _this.keysPressed[_this.keyMap[keyCharacter]] = true;
            }
        });
        document.addEventListener("keyup", function (event) {
            var keyCharacter = String.fromCharCode(event['keyCode']);
            if (_this.keyMap[keyCharacter]) {
                _this.keysPressed[_this.keyMap[keyCharacter]] = false;
            }
        });
        mapCreator.createMap("mockworld", function (map) {
            _this.map = map;
            _this.player.character.position.x = _this.map.startingPosition[0];
            _this.player.character.position.y = _this.map.startingPosition[1];
            _this.drawer = new CubicTreeJsDrawer(_this.scene, map);
            _this.drawer.drawMap();
            _this.world = new World(_this.map, _this.player);
            var character = new Character("spider", 3, 4);
            _this.world.characters.push(character);
            _this.drawer.addObject(character);
            _this.ready = true;
        });
    };
    Game.prototype.process = function () {
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
    };
    return Game;
})();



var Player = (function () {
    function Player(character) {
        this.character = character;
    }
    return Player;
})();

var World = (function () {
    function World(map, player) {
        this.characters = [];
        this.bullets = [];
        this.player = player;
        this.map = map;
        this.characters.push(player.character);
    }
    World.prototype.move = function () {
        this.moveCharacters();
        this.moveBullets();
    };
    World.prototype.moveCharacters = function () {
        for (var k in this.characters) {
            var character = this.characters[k];
            var canMove = false;
            var line = this.map.tiles[Math.round(character.wantToMove.y)];
            if (line) {
                var tile = line[Math.round(character.wantToMove.x)];
                if (tile && !(tile instanceof BlockTile)) {
                    canMove = true;
                }
            }
            if (canMove) {
                character.position.x = character.wantToMove.x;
                character.position.y = character.wantToMove.y;
            }
            else {
                character.wantToMove.x = character.position.x;
                character.wantToMove.y = character.position.y;
            }
        }
    };
    World.prototype.moveBullets = function () {
        var _this = this;
        this.bullets.map(function (bullet, index) {
            var canMove = false;
            var wantsToGo = {
                x: bullet.position.x + Math.sin(bullet.angle) * bullet.speed,
                y: bullet.position.y + Math.cos(bullet.angle) * bullet.speed
            };
            var line = _this.map.tiles[Math.round(wantsToGo.y)];
            if (line) {
                var tile = line[Math.round(wantsToGo.x)];
                if (tile && !(tile instanceof BlockTile)) {
                    canMove = true;
                }
            }
            if (canMove) {
                bullet.position.x = wantsToGo.x;
                bullet.position.y = wantsToGo.y;
            }
            else {
                bullet.speed = 0;
            }
        });
    };
    return World;
})();

var Tile = (function () {
    function Tile(name) {
        this.name = name;
    }
    return Tile;
})();

///<reference path='./../Drawer.ts' />
///<reference path='./../Map/Tile.ts' />
var CubicTreeJsDrawer = (function () {
    function CubicTreeJsDrawer(scene, map) {
        this.materials = {};
        this.objectSprites = [];
        this.blockScale = 1;
        this.scene = scene;
        this.map = map;
    }
    CubicTreeJsDrawer.prototype.drawMap = function () {
        var _this = this;
        this.map.tiles.map(function (tileLine, y) {
            tileLine.map(function (tile, x) {
                _this.drawTile(x, y, tile);
            });
        });
    };
    CubicTreeJsDrawer.prototype.drawTile = function (x, y, tile) {
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        if (!this.materials[tile.name]) {
            this.materials[tile.name] = new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture('textures/' + tile.name + '.jpg')
            });
        }
        var cube = new THREE.Mesh(geometry, this.materials[tile.name]);
        cube.position.x = x * this.blockScale;
        cube.position.z = y * this.blockScale;
        cube.position.y = 0 - (this.blockScale * ((tile instanceof BlockTile) ? 0 : 1));
        this.scene.add(cube);
    };
    CubicTreeJsDrawer.prototype.placeCameraAtStartingPoint = function (camera) {
        camera.position.x = this.blockScale * this.map.startingPosition[0] + (this.blockScale / 2);
        camera.position.z = this.blockScale * this.map.startingPosition[1] + (this.blockScale / 2);
    };
    CubicTreeJsDrawer.prototype.addObject = function (object) {
        var material = new THREE.SpriteMaterial({ map: THREE.ImageUtils.loadTexture("sprites/" + object.name + ".png"), color: 0xffffff, fog: true });
        var sprite = new THREE.Sprite(material);
        var objectSprite = new ObjectSprite(object, sprite);
        this.scene.add(objectSprite.sprite);
        console.log(object.position);
        objectSprite.sprite.position.x = object.position.x;
        objectSprite.sprite.position.z = object.position.y;
        objectSprite.sprite.scale.y = object.size;
        objectSprite.sprite.scale.x = object.size;
        this.objectSprites.push(objectSprite);
    };
    CubicTreeJsDrawer.prototype.refresh = function () {
        this.objectSprites.map(function (objectSprite) {
            objectSprite.sprite.position.x = objectSprite.object.position.x;
            objectSprite.sprite.position.z = objectSprite.object.position.y;
        });
    };
    return CubicTreeJsDrawer;
})();

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path='./Tile.ts' />
var BlockTile = (function (_super) {
    __extends(BlockTile, _super);
    function BlockTile() {
        _super.apply(this, arguments);
    }
    return BlockTile;
})(Tile);

///<reference path='../MapCreator.ts' />
///<reference path='../Map/Tile.ts' />
///<reference path='../Map/BlockTile.ts' />
var DnmapFileMaps = (function () {
    function DnmapFileMaps() {
        this.symbolMapping = {
            '#': ['hedgerow', true],
            '.': ['leather', false]
        };
    }
    DnmapFileMaps.prototype.createMap = function (name, resolve) {
        var _this = this;
        var map = new Map();
        var client = new XMLHttpRequest();
        client.open('GET', '/maps/' + name + '.dnmap');
        client.onreadystatechange = function () {
            _this.processData(client.responseText, map);
            resolve(map);
        };
        client.send();
    };
    DnmapFileMaps.prototype.processData = function (data, map) {
        var _this = this;
        data.split("\n").map(function (line, y) {
            line.split("").map(function (character, x) {
                if (_this.symbolMapping[character]) {
                    var blockDefinition = _this.symbolMapping[character];
                    var tile = (blockDefinition[1]) ? new BlockTile(blockDefinition[0]) : new Tile(blockDefinition[0]);
                    map.defineTile(x, y, tile);
                }
                if (character == '@') {
                    map.startingPosition = [x, y];
                }
            });
        });
    };
    return DnmapFileMaps;
})();



var ObjectSprite = (function () {
    function ObjectSprite(object, sprite) {
        this.object = object;
        this.sprite = sprite;
    }
    return ObjectSprite;
})();
