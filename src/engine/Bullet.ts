class Bullet implements PhysicalObject {
    name: string;
    position: {
        x: number
        y: number
    } = {
        x: 0,
        y: 0
    };

    size: number = 0.5;
    angle: number;
    speed: number;

    constructor(name: string, x: number = 0, y: number = 0, angle: number = 0, speed: number = 0) {
        this.name = name;

        this.position.x = x;
        this.position.y = y;
        this.angle = angle;
        this.speed = speed;
    }
}
