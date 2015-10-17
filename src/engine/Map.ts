class Map {
    tiles: Tile[][];
    startingPosition: number[];

    constructor() {
        this.tiles = [];
        this.startingPosition = [0, 0];
    }

    defineTile(x: number, y: number, tile: Tile) {
        if (!(this.tiles[x])) {
            this.tiles[x] = [];
        }

        this.tiles[x][y] = tile;
    }
}