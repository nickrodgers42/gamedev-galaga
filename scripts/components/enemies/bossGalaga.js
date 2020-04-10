class BossGalaga extends Enemy {
    constructor(spriteSheet1, spriteSheet2, position, screenWidth, screenHeight) {
        const sprite = new AnimatedSprite(
            spriteSheet1,
            position,
            Math.floor(spriteSheet1.width / 2),
            spriteSheet1.height,
            2,
            [500, 500]
        )
        super(sprite, position, screenWidth, screenHeight)
        this.spriteSheet1 = spriteSheet1
        this.spriteSheet2 = spriteSheet2
        this.hit = false
    }
}
