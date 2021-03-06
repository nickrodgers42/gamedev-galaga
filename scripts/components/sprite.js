class Sprite {
    constructor(sprite, center, width=null, height=null) {
        this.sprite = sprite
        this.center = center
        this._width = width
        this._height = height
    }

    get width() {
        return (this._width === null) ? this.sprite.width : this._width
    }
    
    get height() {
        return (this._height === null) ? this.sprite.height : this._height
    }

    update = (elapsedTime) => {}

    render = (context, rotation=0) => {
        context.save()
        context.translate(this.center.x, this.center.y)
        context.rotate(rotation)
        
        context.drawImage(
            this.sprite,
            Math.floor(0 - this.width / 2),
            Math.floor(0 - this.height / 2)
        )

        context.restore()
    } 
}
