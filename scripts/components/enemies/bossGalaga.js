class BossGalaga extends Enemy {
    constructor(spriteSheet1, spriteSheet2, position, screenWidth, screenHeight) {
        const sprite = new AnimatedSprite(
            spriteSheet,
            position,
            Math.floor(spriteSheet1.width / 2),
            spriteSheet.height,
            2,
            [500, 500]
        )
        this.spriteSheet1 = spriteSheet1
        this.spriteSheet2 = spriteSheet2
        this.hit = false
        super(sprite, position, screenWidth, screenHeight)
    }
}
