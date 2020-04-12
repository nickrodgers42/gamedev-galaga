class AnimatedSprite extends Sprite {
    constructor(spriteSheet, center, width, height, numFrames, timing) {
        super(spriteSheet, center, width, height)
        this.numFrames = numFrames
        this.timing = timing
        this.subImageWidth = Math.floor(this.sprite.width / this.numFrames) 
        this.currentFrame = 0
        this.currentCount = 0
    }

    update = (elapsedTime) => {
        this.currentCount += elapsedTime
        while (this.currentCount >= this.timing[this.currentFrame]) {
            this.currentCount -= this.timing[this.currentFrame]
            this.currentFrame += 1
            this.currentFrame %= this.numFrames
        }
    }

    render = (context, rotation) => {
        context.save()
        context.translate(this.center.x, this.center.y)
        context.rotate(rotation)

        context.drawImage(
            this.sprite,
            this.currentFrame * this.subImageWidth,
            0,
            this.subImageWidth,
            this.sprite.height,
            Math.floor(0 - this.width / 2),
            Math.floor(0 - this.height / 2),
            this.width,
            this.height
        )

        context.restore()
    }
}

class Explosion extends AnimatedSprite {
    constructor(spriteSheet, center, width, height, numFrames, timing) {
        super(spriteSheet, center, width, height, numFrames, timing)
        this.complete = false
        this.duration = timing.reduce((acc, val) => acc + val)
        this.totalTime = 0 
    }

    update = (elapsedTime) => {
        this.currentCount += elapsedTime
        while (this.currentCount >= this.timing[this.currentFrame]) {
            this.currentCount -= this.timing[this.currentFrame]
            this.currentFrame += 1
            this.currentFrame %= this.numFrames
        }
        this.totalTime += elapsedTime
        if (this.totalTime >= this.duration) {
            this.complete = true
        }
    }
}
