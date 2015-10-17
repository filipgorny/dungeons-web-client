///<reference path='./../Drawer.ts' />
///<reference path='./../Map/Tile.ts' />
class CubicTreeJsDrawer implements Drawer {
    scene: THREE.Scene;
    materials: { [name: string]: THREE.Material; } = { };
    private blockScale: number = 1;
    private map: Map;

    constructor(scene: THREE.Scene, map:Map) {
        this.scene = scene;
        this.map = map;
    }

    drawMap() {
        this.map.tiles.map((tileLine, y) => {
            tileLine.map((tile, x) => {
                this.drawTile(x, y, tile);
            });
        });
    }

    private drawTile(x: number, y: number, tile: Tile) {
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
    }

    placeCameraAtStartingPoint(camera: THREE.Camera) {
        camera.position.x = this.blockScale * this.map.startingPosition[0] + (this.blockScale / 2);
        camera.position.z = this.blockScale * this.map.startingPosition[1] + (this.blockScale / 2);
    }
}