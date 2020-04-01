class Point2d {
    constructor(x=0, y=0) {
        this.x = x
        this.y = y
    }

    copy = () => {
        return new Point2d(this.x, this.y)
    }

    distanceTo(x, y=0) {
        const otherPoint = new Point2d()
        if (x instanceof Point2d) {
            otherPoint.x = x.x
            otherPoint.y = x.y
        }
        else {
            otherPoint.x = x
            otherPoint.y = y
        }
        const xDist = this.x - otherPoint.x
        const yDist = this.y - otherPoint.y
        return Math.sqrt(xDist * xDist - yDist * yDist)
    }

    midpointTo(x, y=0) {
        const otherPoint = new Point2d()
        if (x instanceof Point2d) {
            otherPoint.x = x.x
            otherPoint.y = x.y
        }
        else {
            otherPoint.x = x
            otherPoint.y = y
        }
        return new Point2d(
            Math.floor((this.x + otherPoint.x) / 2),
            Math.floor((this.y + otherPoint.y) / 2)
        )
    }
}
