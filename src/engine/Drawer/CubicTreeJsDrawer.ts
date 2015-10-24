///<reference path='./../Drawer.ts' />
///<reference path='./../Map/Tile.ts' />
class CubicTreeJsDrawer implements Drawer {
    scene: THREE.Scene;
    materials: { [name: string]: THREE.Material; } = { };
    private objectSprites: ObjectSprite[] = [];
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

    addObject(object: PhysicalObject) {
        var material = new THREE.SpriteMaterial({ map: THREE.ImageUtils.loadTexture( "sprites/" + object.name + ".png" ), color: 0xffffff, fog: true });
        var sprite = new THREE.Sprite(material);

        var objectSprite = new ObjectSprite(object, sprite);

        this.scene.add(objectSprite.sprite);
console.log(object.position);
        objectSprite.sprite.position.x = object.position.x;
        objectSprite.sprite.position.z = object.position.y;

        objectSprite.sprite.scale.y = object.size;
        objectSprite.sprite.scale.x = object.size;

        this.objectSprites.push(objectSprite);
    }

    refresh() {
        this.objectSprites.map(objectSprite => {
            objectSprite.sprite.position.x = objectSprite.object.position.x;
            objectSprite.sprite.position.z = objectSprite.object.position.y;
        });
    }
}