class EnemyPathMaker {
    constructor(screenWidth, screenHeight, enemySize) {
        this.screenWidth = screenWidth
        this.screenHeight = screenHeight
        this.enemySize = enemySize
        this.screenCenter = new Point2d(this.screenWidth / 2, this.screenHeight / 2)
        this.paths = {
            'bee-incoming-1': new Spline(
                [
                    [this.screenCenter.x  + this.enemySize * 1.5, 0, 0, 100],
                    [this.enemySize * 1.5, this.screenHeight / 2, 0, 200],
                    [this.screenCenter.x - this.enemySize * 1.5, this.screenHeight / 2, 0, -150]
                ]
            )
        }
        this.paths['butterfly-incoming-1'] = this.paths['bee-incoming-1'].mirrorVertically(this.screenWidth)
    }

    getPath = (pathName, numSamples) => {
        return this.paths[pathName].getPath(numSamples)
    }
}
