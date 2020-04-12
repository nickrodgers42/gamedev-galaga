class Missile {
    constructor(sprite, position) {
        this.position = position
        this.sprite = new Sprite(sprite, this.position)
        this.moveRate = 0.2
        this.onScreen = true
        this.hitboxRadius = 2
        this.detonated = false
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
        this.sprite.render(context)
    }
}
