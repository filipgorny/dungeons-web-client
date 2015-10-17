///<reference path='../MapCreator.ts' />
///<reference path='../Map/Tile.ts' />
///<reference path='../Map/BlockTile.ts' />
class DnmapFileMaps implements MapCreator {
    private symbolMapping = {
        '#': ['hedgerow', true],
        '.': ['leather', false]
    };

    createMap(name: string, resolve: (map: Map) => void): void {
        var map = new Map();

        var client = new XMLHttpRequest();

        client.open('GET', '/maps/' + name + '.dnmap');
        client.onreadystatechange = () => {
            this.processData(client.responseText, map);

            resolve(map);
        };

        client.send();
    }

    processData(data, map: Map) {
        data.split("\n").map((line, y) => {
            line.split("").map((character, x) => {
                if (this.symbolMapping[character]) {
                    var blockDefinition = this.symbolMapping[character];

                    var tile = (blockDefinition[1]) ? new BlockTile(blockDefinition[0]) : new Tile(blockDefinition[0]);

                    map.defineTile(x, y, tile);
                }

                if (character == '@') {
                    map.startingPosition = [x, y];
                }
            })
        });
    }
}