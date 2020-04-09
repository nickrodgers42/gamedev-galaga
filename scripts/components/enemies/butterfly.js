class Butterfly extends Enemy {
    constructor(spriteSheet, position, screenWidth, screenHeight) {
        const sprite = new AnimatedSprite(
            spriteSheet,
            position,
            Math.floor(spriteSheet.width / 2),
            spriteSheet.height,
            2,
            [500, 500]
        )
        super(sprite, position, screenWidth, screenHeight)
    }
}
