class Point2d {
    constructor(x=0, y=0) {
        this.x = x
        this.y = y
    }

    copy = () => {
        return new Point2d(this.x, this.y)
    }

    coords = () => {
        return [this.x, this.y]
    }

    mult = (x) => {
        const returnPoint = this.copy()
        if (x instanceof Point2d) {
            returnPoint.x *= x.x
            returnPoint.y *= x.y
        }
        else {
            returnPoint.x *= x
            returnPoint.y *= x
        }
        return returnPoint
    }

    add = (x) => {
        const returnPoint = this.copy()
        if (x instanceof Point2d) {
            returnPoint.x += x.x
            returnPoint.y += x.y
        }
        return returnPoint
    }

    set = (x, y) => {
        if (x instanceof Point2d) {
            this.x = x.x
            this.y = x.y
        }
        else {
            this.x = x
            this.y = y
        }
    }

    distanceTo = (x, y=0) => {
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
        return Math.sqrt(xDist * xDist + yDist * yDist)
    }

    midpointTo = (x, y=0) => {
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

    slopeTo = (x) => {
        if (!(x instanceof Point2d)) {
            return
        }
        return (x.y - this.y) / (x.x - this.x)
    }
}
