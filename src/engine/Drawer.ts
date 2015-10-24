///<reference path='./Map.ts' />
interface Drawer {
    drawMap();
    addObject(object: PhysicalObject);
    refresh();
}
