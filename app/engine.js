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
