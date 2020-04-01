class Missile {
    constructor(sprite, position) {
        this.sprite = sprite
        this.position = position
        this.moveRate = 0.2
        this.onScreen = true
    }
    
    update = (elapsedTime) => {
        this.position.y -= this.moveRate * elapsedTime
        if (!this.isOnScreen()) {
            this.onScreen = false
        }
    }

    isOnScreen = () => {
        return (this.position.y + Math.floor(this.sprite.height / 2) < 0) ? false : true
    }

    render = (context) => {
        context.save()
        context.drawImage(this.sprite,
            Math.floor(this.position.x - this.sprite.width / 2),
            Math.floor(this.position.y - this.sprite.height / 2)
        )
        context.restore()
    }
}
