class BezierCurve {
    constructor(p0, p1, p2, p3) {
        this.p0 = p0,
        this.p1 = p1, 
        this.p2 = p2,
        this.p3 = p3,
        this.points = [p0, p1, p2, p3]
    }

    calculateCurvePoint = (t) => {
        const t2 = t * t
        const t3 = t2 * t
        const u = 1 - t
        const u2 = u * u
        const u3 = u2 * u
        
        let point = this.p0.mult(u3)
        point = point.add(this.p1.mult(3 * u2 * t))
        point = point.add(this.p2.mult(3 * u * t2))
        point = point.add(this.p3.mult(t3))
        point.x = Math.floor(point.x)
        point.y = Math.floor(point.y)
        return point
    }

    calculateSlope = (t) => {
        const t2 = t * t
        const u = 1 - t
        const u2 = u * u

        let point = this.p0.mult(-3 * u2)
        point = point.add(this.p1.mult(3 * u2))
        point = point.add(this.p1.mult(-6 * t * u))
        point = point.add(this.p2.mult(-3 * t2))
        point = point.add(this.p2.mult(6 * t * u))
        point = point.add(this.p3.mult(3 * t2))
        point.x = Math.floor(point.x)
        point.y = Math.floor(point.y)
        return point.y
    }
}
