class Character implements PhysicalObject {
    name: string;

    position: {
        x: number
        y: number
    } = {
        x: 0,
        y: 0
    };

    wantToMove: {
        x: number
        y: number
    } = {
        x: 0,
        y: 0
    };

    size: number = 1;
    rotation: number = 0;

    constructor(name: string, x: number = 0, y: number = 0) {
        this.name = name;
        this.position.x = x;
        this.position.y = y;
    }

    shot(): Bullet {
        var bullet = new Bullet("plasma", this.position.x, this.position.y, this.rotation, -0.1);

        return bullet;
    }
}