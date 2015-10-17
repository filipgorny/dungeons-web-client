interface MapCreator {
    createMap(name: string, resolve: (map: Map) => void): void;
}