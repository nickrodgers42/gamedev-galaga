class BezierPath {
    constructor(curves, samples) {
        this.curves = curves
        this.samples = samples
    }

    getPath = () => {
        const path = []
        for (let i = 0; i < this.curves.length; ++i) {
            for (let j = 0; j <= 1; j += 1 / this.samples[i]) {
                path.push(this.curves[i].calculateCurvePoint(j))
            }
        }
        return path
    }

    getSlope = () => {
        const slope = []
        for (let i = 0; i < this.curves.length; ++i) {
            for (let j = 0; j <= 1; j += 1 / this.samples[i]) {
                slope.push(this.curves[i].calculateSlope(j))
            }
        }
        return slope
    }

    mirrorVertically = (width) => {
        const newCurves = []
        const center = Math.floor(width / 2)
        for (let i = 0; i < this.curves.length; ++i) {
            const newPoints = []
            for (let j = 0; j < this.curves[i].points.length; ++j) {
                const point = this.curves[i].points[j]
                newPoints.push(
                    new Point2d(
                        center + (center - point.x),     
                        point.y
                    )
                )
            }
            newCurves.push(new BezierCurve(...newPoints))
        }
        return new BezierPath(newCurves, [...this.samples])
    }
}
