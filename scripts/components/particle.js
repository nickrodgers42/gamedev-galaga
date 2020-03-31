const noImage = new Image()

class Particle {
    constructor(x, y, options) {
        this.center = new Point2d(x, y)
        this.image = (options.image == null) ?
            noImage : options.image
        this.rotation = (options.rotation == null) ?
            0 : options.rotation
        this.size = (options.size == null) ?
            {x: Random.randGaussian(0, 1), y: Random.randGaussian(0, 1) }: options.size
        this.speed = (options.speed == null) ? 
            Random.randGaussian(0, 1) : options.speed
        this.lifetime = (options.lifetime == null) ?
            Random.randGaussian(0, 1) : options.lifetime
        this.direction = (options.direction == null) ?
            Random.randCircleVector() : options.direction
        this.fill = (options.fill == null) ? 
            '#FFFFFF' : options.fill
        this.stroke = (options.stroke == null) ? 
            '#000000' : options.stroke
        
    }

    update = (elapsedTime) => {
        this.center.x -= (this.speed * this.direction.x * elapsedTime)
        this.center.y -= (this.speed * this.direction.y * elapsedTime)
        this.rotation += this.speed * 0.5
        this.rotation %= 2 * Math.PI
        if (this.alive) {
            this.lifetime -= elapsedTime
            if (this.lifetime < 0) {
                this.lifetime = 0
            }
        }
    }

    get alive() {
        return (this.lifetime > 0) ? true : false
    }
}
