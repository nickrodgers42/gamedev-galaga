class SpriteObject {
    constructor(x, y, imageSource) {
        this.x = x
        this.y = y
        this.sprite = new Image()
        this.sprite.src = imageSource
        this.sprite.ready = false
        this.sprite.onload = () => this.sprite.ready = true
    }
}
