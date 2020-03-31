class Player {
    constructor(sprite) {
        this.lives = 3
        this.coolDown = 100
        this.sprite = sprite
    }

    update = (elapsedTime) => {}
    render = (elapsedTime) => {}

    moveLeft = (elapsedTime) => {}
    moveRight = (elapsedTime) => {}
    fire = (elapsedTime) => {}
}
