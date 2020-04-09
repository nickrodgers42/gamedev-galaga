class ControlPoint {
    constructor(x, y, xComponent, yComponent) {
        if (x instanceof Point2d && y instanceof Point2d) {
            this.point = x
            this.tangent = y
        }
        else {
            this.point = new Point2d(x, y)
            this.tangent = new Point2d(xComponent, yComponent)
        }
    }

    get x() {
        return this.point.x
    }
    get y() {
        return this.point.y
    }
    get xp() {
        return this.tangent.x
    }
    get yp() {
        return this.tangent.y
    }
}

class Spline {
    constructor(controlPoints) {
        this.controlPoints = []
        for (let i = 0; i < controlPoints.length; ++i) {
            if (controlPoints[i] instanceof ControlPoint) {
                this.controlPoints.push(controlPoints[i])
            }
            else {
                this.controlPoints.push(new ControlPoint(...controlPoints[i]))
            }
        }
    }

    getX = (u, controlPoint1, controlPoint2) => {
        const uu = u * u
        const uuu = uu * u
        const p0 = controlPoint1
        const p1 = controlPoint2
        let xVal = p0.x * (2 * uuu - 3 * uu + 1)
        xVal += p1.x * (-2 * uuu + 3 * uu)
        xVal += p0.xp * (uuu -2 * uu + u)
        xVal += p1.xp * (uuu - uu)
        return xVal
    }

    getXp = (u, controlPoint1, controlPoint2) => {
        const uu  = u * u
        const p0 = controlPoint1
        const p1 = controlPoint2
        let xVal = p0.x * (6 * uu - 6 * u)
        xVal += p1.x * (-6 * uu + 6 * u)
        xVal += p0.xp * (3 * uu - 4 * u + 1)
        xVal += p1.xp * (3 * uu - 2 * u)
        return xVal
    }

    getY = (u, controlPoint1, controlPoint2) => {
        const uu = u * u
        const uuu = uu * u
        const p0 = controlPoint1
        const p1 = controlPoint2
        let yVal = p0.y * (2 * uuu - 3 * uu + 1)
        yVal += p1.y * (-2 * uuu + 3 * uu)
        yVal += p0.yp * (uuu -2 * uu + u)
        yVal += p1.yp * (uuu - uu)
        return yVal
    }

    getYp = (u, controlPoint1, controlPoint2) => {
        const uu  = u * u
        const p0 = controlPoint1
        const p1 = controlPoint2
        let yVal = p0.y * (6 * uu - 6 * u)
        yVal += p1.y * (-6 * uu + 6 * u)
        yVal += p0.yp * (3 * uu - 4 * u + 1)
        yVal += p1.yp * (3 * uu - 2 * u)
        return yVal
    }

    getPath = (numSamples) => {
        const path = []
        for (let i = 0; i < this.controlPoints.length - 1; ++i) {
            for (let u = 0; u <= 1; u += 1 / numSamples) {
                const args = [u, this.controlPoints[i], this.controlPoints[i + 1]]
                const point = new Point2d(
                    this.getX(...args),
                    this.getY(...args)
                )
                point.rotation = Math.atan2(this.getYp(...args), this.getXp(...args)) + Math.PI / 2
                path.push(point)
            }
        }
        return path
    }

    mirrorVertically = (width) => {
        const newControlPoints = []
        const center = Math.floor(width / 2)
        for (let i = 0; i < this.controlPoints.length; ++i) {
            const controlPoint = this.controlPoints[i]
            newControlPoints.push(
                new ControlPoint(
                    center + (center - controlPoint.x),
                    controlPoint.y,
                    -controlPoint.xp,
                    controlPoint.yp
                )
            )
        }
        return new Spline(newControlPoints)
    }
}
