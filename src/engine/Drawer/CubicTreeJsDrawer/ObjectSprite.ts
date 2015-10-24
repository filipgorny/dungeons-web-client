class ObjectSprite {
    object: PhysicalObject;
    sprite: THREE.Sprite;

    constructor(object: PhysicalObject, sprite: THREE.Sprite) {
        this.object = object;
        this.sprite = sprite;
    }
}
