class Missile {
    constructor(sprite, position, screenWidth, screenHeight) {
        this.position = position
        this.screenWidth = screenWidth
        this.screenHeight = screenHeight
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
        if (this.position.x < 0 || 
            this.position.x > this.screenWidth || 
            this.position.y < 0 ||
            this.position.y > this.screenHeight) 
        {
            return false
        }
        return true
    }

    render = (context) => {
        this.sprite.render(context)
    }
}

class EnemyMissile extends Missile {
    constructor(sprite, position, screenWidth, screenHeight, playerPosition) {
        super(sprite, position, screenWidth, screenHeight)
        let radians = Math.atan2(
            -this.position.y + playerPosition.y,
            -this.position.x + playerPosition.x
        )
        this.moveRate = 0.1
        radians += Math.PI
        radians = Math.max((11 * Math.PI) / 8, radians)
        radians = Math.min((13 * Math.PI) / 8, radians)
        this.direction = new Point2d(-Math.cos(radians), -Math.sin(radians))
    }

    update = (elapsedTime) => {
        this.position.y += this.direction.y * elapsedTime * this.moveRate
        this.position.x += this.direction.x * elapsedTime * this.moveRate
        if (!this.isOnScreen()) {
            this.onScreen = false
        }
    }
}
