class World {
    player: Player;
    map: Map;

    constructor(map: Map, player: Player) {
        this.player = player;
        this.map = map;
    }

    move() {
        var canMove = false;

        var line = this.map.tiles[Math.round(this.player.wantToMove.y)];

        if (line) {
            var tile = line[Math.round(this.player.wantToMove.x)];

            if (tile && !(tile instanceof BlockTile)) {
                canMove = true;
            }
        }

        if (canMove) {
            this.player.position.x = this.player.wantToMove.x;
            this.player.position.y = this.player.wantToMove.y;
        } else {
            this.player.wantToMove.x = this.player.position.x;
            this.player.wantToMove.y = this.player.position.y;
        }
    }
}