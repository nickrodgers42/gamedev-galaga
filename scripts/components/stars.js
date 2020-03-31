class Star {
    constructor(location, opacity, increasing) {
        this.location = location
        this.opacity = opacity
        this.increasing = increasing
    }
}

class Stars {
    constructor(numStars, width, height) {
        this.numStars = numStars
        this.width = width
        this.height = height
        this.stars = []
        this.moving = false
        this.twinkeRate = 0.001
        this.moveRate = 0.075
        for (let i = 0; i < this.numStars; ++i) {
            this.stars.push(new Star(
                new Point2d(
                    Random.randInt(0, this.width),
                    Random.randInt(0, this.height)
                ),
                Math.random(),
                (Math.random() >= 0.5) ? true : false
            ))
        }
    }

    update = (elapsedTime) => {
        for (let i = 0; i < this.stars.length; ++i) {
            const star = this.stars[i]
            const delta = star.increasing ? 1 : -1
            star.opacity += this.twinkeRate * delta * elapsedTime
            if (star.opacity >= 1) {
                star.opacity = 1
                star.increasing = false
            }
            if (star.opacity <= 0) {
                star.opacity = 0
                star.increasing = true
            }
            if (this.moving) {
                star.location.y += this.moveRate * elapsedTime
                star.location.y %= this.height
            }
        }
    }

    render = (context) => {
        context.save()
        for (let i = 0; i < this.stars.length; ++i) {
            const star = this.stars[i]
            context.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
            context.fillRect(
                Math.floor(star.location.x), 
                Math.floor(star.location.y), 
                1, 
                1
            )
        }
        context.restore()
    }
}
