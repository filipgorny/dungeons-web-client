class World {
    player: Player;
    map: Map;
    characters: Character[] = [];
    bullets: Bullet[] = [];

    constructor(map: Map, player: Player) {
        this.player = player;
        this.map = map;

        this.characters.push(player.character);
    }

    move() {
        this.moveCharacters();
        this.moveBullets();
    }

    private moveCharacters() {
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
            } else {
                character.wantToMove.x = character.position.x;
                character.wantToMove.y = character.position.y;
            }
        }
    }

    private moveBullets() {
        this.bullets.map((bullet, index) => {
            var canMove = false;
            var wantsToGo = {
                x: bullet.position.x + Math.sin(bullet.angle) * bullet.speed,
                y: bullet.position.y + Math.cos(bullet.angle) * bullet.speed
            };

            var line = this.map.tiles[Math.round(wantsToGo.y)];

            if (line) {
                var tile = line[Math.round(wantsToGo.x)];

                if (tile && !(tile instanceof BlockTile)) {
                    canMove = true;
                }
            }

            if (canMove) {
                bullet.position.x = wantsToGo.x;
                bullet.position.y = wantsToGo.y;
            } else {
                bullet.speed = 0;
            }
        });
    }
}