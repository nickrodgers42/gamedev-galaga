class Player {
    constructor(sprite, shootSound, missileSystem, screenWidth, screenHeight) {
        this.sprite = sprite
        this.missileSystem = missileSystem
        this.screenWidth = screenWidth
        this.screenHeight = screenHeight
        this.shootSound = shootSound
        this.lives = 3
        this.moveRate = .1
        this.maxMissilesOut = 2
        this.position = new Point2d(
            Math.floor(this.screenWidth / 2),
            Math.floor(this.screenHeight - this.sprite.height * 1.5)
        )
    }

    update = (elapsedTime) => {}

    render = (context) => {
        context.save()
        context.drawImage(
            this.sprite,
            Math.floor(this.position.x - this.sprite.width / 2),
            Math.floor(this.position.y - this.sprite.height / 2)
        )
        context.restore()
    }

    moveLeft = (elapsedTime) => {
        this.position.x = Math.max(
            this.sprite.width / 2,
            this.position.x - (elapsedTime * this.moveRate)
        )
    }

    moveRight = (elapsedTime) => {
        this.position.x = Math.min(
            this.screenWidth - (this.sprite.width / 2),
            this.position.x + (elapsedTime * this.moveRate)
        )
    }

    fire = () => {
        if (this.missileSystem.numPlayerMissiles < this.maxMissilesOut) {
            this.missileSystem.firePlayerMissile(this.position.copy())
            this.shootSound.currentTime = 0
            this.shootSound.play()
        }
    }
}
