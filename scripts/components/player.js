class Player {
    constructor(sprite, shootSound, missileSystem, screenWidth, screenHeight) {
        this.missileSystem = missileSystem
        this.screenWidth = screenWidth
        this.screenHeight = screenHeight
        this.shootSound = shootSound
        this.lives = 3
        this.moveRate = .1
        this.maxMissilesOut = 2
        this.height = sprite.height
        this.position = new Point2d(
            Math.floor(this.screenWidth / 2),
            Math.floor(this.screenHeight - sprite.height * 1.5)
        )
        this.sprite = new Sprite(sprite, this.position)
        this.hitboxRadius = 6
    }

    update = (elapsedTime) => {}


    crash = () => {
        this.position.x = this.screenWidth / 2
    }

    render = (context) => {
        this.sprite.render(context)
        // context.save()
        // context.translate(this.position.x, this.position.y)
        // context.rotate(this.rotation)
        // context.strokeStyle = 'red'
        // context.lineWidth = 2
        // context.beginPath()
        // context.arc(0, 0,this.hitboxRadius, 0, 2 * Math.PI) 
        // context.stroke()
        // context.restore()
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
