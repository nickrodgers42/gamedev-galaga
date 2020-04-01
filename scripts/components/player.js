class Player {
    constructor(sprite, screenWidth, screenHeight) {
        this.lives = 3
        this.screenWidth = screenWidth
        this.screenHeight = screenHeight
        this.position = new Point2d()
        this.sprite = sprite
    }

    update = (elapsedTime) => {}

    render = (elapsedTime) => {

    }

    moveLeft = (elapsedTime) => {}
    moveRight = (elapsedTime) => {}
    fire = (elapsedTime) => {}
}
