class EnemyPathMaker {
    constructor(screenWidth, screenHeight, beeWidth) {
        this.screenWidth = screenWidth
        this.screenHeight = screenHeight
        this.beeWidth = beeWidth
        this.paths = {
            'bee-incoming-1': new BezierPath(
                [
                    new BezierCurve(
                        new Point2d(this.screenWidth / 2 + this.beeWidth * 1.5, 0),
                        new Point2d(this.screenWidth / 2 + this.beeWidth * 1.5, this.screenHeight / 6),
                        new Point2d(this.beeWidth * 1.5, this.screenHeight / 6),
                        new Point2d(this.beeWidth * 1.5, this.screenHeight / 2)
                    ),
                    new BezierCurve(
                        new Point2d(this.beeWidth * 1.5, this.screenHeight / 2),
                        new Point2d(this.beeWidth * 1.5, this.screenHeight * 0.66),
                        new Point2d(this.screenWidth / 2 - this.beeWidth * 1.5, this.screenHeight * 0.66),
                        new Point2d(this.screenWidth / 2 - this.beeWidth * 1.5, this.screenHeight / 2)
                    )
                ],
                [
                    10, 10
                ],
            )
        }
        this.paths['butterfly-incoming-1'] = this.paths['bee-incoming-1'].mirrorVertically(this.screenWidth)
    }

    makePath = (pathName) => {
        return this.paths[pathName].getPath()
    }
}
