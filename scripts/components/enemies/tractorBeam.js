class TractorBeam {
    constructor(spriteSheet, boss, onComplete) {
        const spriteCenter = boss.position.copy()
        spriteCenter.y += Math.floor(spriteSheet.height / 2) + boss.sprite.sprite.height / 2
        this.sprite = new AnimatedSprite(
            spriteSheet,
            spriteCenter,
            Math.floor(spriteSheet.width / 3),
            spriteSheet.height,
            3,
            [100, 100, 100]
        )
        this.height = 0
        this.origin = origin
        this.timer = 0
        this.complete = false
        this.extended = false
        this.onComplete = onComplete
    }

    update = (elapsedTime) => {
        this.sprite.update(elapsedTime)
        this.timer += elapsedTime
        if (this.timer < 1000) {
            this.height = (this.timer / 1000) * this.sprite.sprite.height
        }
        else if (this.timer < 4000) {
            this.height = this.sprite.sprite.height
            this.extended = true
        }
        else if (this.timer < 5000) {
            this.extended = false
            this.height = ((5000 - this.timer) / 1000) * this.sprite.sprite.height
        }
        else {
            this.complete = true
            this.onComplete()
        }
    }
    
    render = (context) => {
        context.save()
        context.translate(this.sprite.center.x, this.sprite.center.y)
        context.rotate(this.sprite.rotation)
        context.drawImage(
            this.sprite.sprite,
            this.sprite.currentFrame * this.sprite.subImageWidth,
            0,
            this.sprite.subImageWidth,
            this.height,
            Math.floor(0 - this.sprite.width / 2),
            Math.floor(0 - this.sprite.height / 2),
            this.sprite.width,
            this.height
        )
        context.restore()
    }
}
