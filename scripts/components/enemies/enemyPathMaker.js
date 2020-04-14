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
            ),
            'boss-incoming-1': new Spline (
                [
                    [0, this.screenHeight - this.enemySize * 2.5, 0, 20],
                    [this.screenCenter.x - this.enemySize * 1.5, this.screenHeight / 2 + this.enemySize * 1.5, 0, -128],
                    [this.enemySize * 1.5, this.screenHeight / 2 + this.enemySize * 1.5, 0, 128],
                    [this.screenCenter.x - this.enemySize * 1.5, this.screenHeight / 2 + this.enemySize * 1.5, 0, -128],
                ]
            ),
            'bee-diving-left': new Spline (
                [
                    [this.enemySize, this.screenHeight / 2 - this.enemySize * 2, 0, -50],
                    [0, this.screenHeight / 2 - this.enemySize * 2, 0, 50],
                    [this.screenCenter.x + this.enemySize * 1.5, this.screenCenter.y + this.enemySize, 0, 100],
                    [this.screenCenter.x + this.enemySize * 1.5, this.screenHeight - this.enemySize * 4, 0, 250],
                    [this.enemySize, this.screenHeight - this.enemySize * 4, 0, -250]
                ]
            ),
            'butterfly-diving-left-start': new Spline(
                [
                    [this.enemySize, this.enemySize * 3.5, 0, -50],
                    [0, this.enemySize * 3.5, 0, 50],
                    [this.screenCenter.x - this.enemySize * 2, this.screenCenter.y, 0, 50],
                    [this.screenCenter.x - this.enemySize * 4, this.screenCenter.y + this.enemySize * 2, 0, 50],
                    [this.screenCenter.x + this.enemySize, this.screenHeight - this.enemySize * 2, 0, 50],
                    [this.screenCenter.x - this.enemySize, this.screenHeight, 0, 50]
                ]
            ),
            'butterfly-diving-left-end': new Spline(
                [
                    [this.screenCenter.x / 2, 0, 0, 0],
                    [this.screenCenter.x / 2 - this.enemySize, this.enemySize * 2.5, -50, -100]
                ]
            ),
            'boss-diving-left-start': new Spline(
                [
                    [this.screenCenter.x / 2, this.enemySize * 2.5, 0, -50],
                    [this.screenCenter.x / 2 + this.enemySize, this.enemySize * 2.5, 0, 50],
                    [this.screenCenter.x / 2 + this.enemySize, this.screenCenter.y - this.enemySize * 2.5, 0, 100],
                    [this.screenCenter.x / 2 - this.enemySize * 2, this.screenCenter.y - this.enemySize * 2.5, 0, -100],
                    [this.screenCenter.x / 2 + this.enemySize, this.screenCenter.y - this.enemySize * 2.5, 0, 100],
                    [0, this.screenHeight - this.enemySize * 2, 0, 200],
                    [0, this.screenHeight, 0, 0]
                ]
            ),
            'boss-diving-left-end': new Spline(
                [
                    [this.screenCenter.x / 2, 0, 0, 0],
                    [this.screenCenter.x / 2 + this.enemySize, this.enemySize * 2.5, 50, -100]
                ]
            ),
            'boss-capture-left-start': new Spline(
                [
                    [this.screenCenter.x / 2, this.enemySize * 2.5, 0, -50],
                    [this.screenCenter.x / 2 + this.enemySize * 2, this.enemySize * 2.5, 0, 50],
                    [this.screenCenter.x /  2 - this.enemySize, this.screenHeight / 2 + this.enemySize * 2.5, 0, 100]
                ]
            ),
            'boss-capture-left-middle': new Spline(
                [
                    [this.screenCenter.x / 2 - this.enemySize, this.screenHeight / 2 + this.enemySize * 2.5, 0, 100],
                    [this.screenCenter.x / 2 - this.enemySize, this.screenHeight, 0, 0]
                ]
            ),
            'boss-capture-left-end': new Spline(
                [
                    [this.screenCenter.x / 2, 0, 0, 0],
                    [this.screenCenter.x / 2 + this.enemySize, this.enemySize * 2.5, 50, -100]
                ]
            ),
            'boss-incoming-2-outer': new Spline(
                [
                    [0, this.screenHeight - this.enemySize * 2.5, 0, 20],
                    [this.screenCenter.x - this.enemySize * 1.5, this.screenHeight / 2 + this.enemySize * 1.5, 0, -128],
                    [this.enemySize * 1.5, this.screenHeight / 2 + this.enemySize * 1.5, 0, 128],
                    [this.screenCenter.x - this.enemySize * 1.5, this.screenHeight / 2 + this.enemySize * 1.5, 0, -128],
                ]
            ),
            'boss-incoming-2-inner': new Spline(
                [
                    [0, this.screenHeight - this.enemySize * 3.5, 0, 20],
                    [this.screenCenter.x - this.enemySize * 2.5, this.screenHeight / 2 + this.enemySize * 1.5, 0, -64],
                    [this.enemySize * 2.5, this.screenHeight / 2 + this.enemySize * 1.5, 0, 64],
                    [this.screenCenter.x - this.enemySize * 2.5, this.screenHeight / 2 + this.enemySize * 1.5, 0, -64],
                ]
            ),
            'bee-incoming-2-outer': new Spline(
                [
                    [this.screenCenter.x + this.enemySize * 1.5, 0, 0, 100],
                    [this.enemySize * 1.5, this.screenHeight / 2, 0, 200],
                    [this.screenCenter.x - this.enemySize * 1.5, this.screenHeight / 2, 0, -150]
                ]
            ),
            'bee-incoming-2-inner': new Spline(
                [
                    [this.screenCenter.x + this.enemySize * 2.5, 0, 0, 100],
                    [this.enemySize * 2.5, this.screenHeight / 2, 0, 100],
                    [this.screenCenter.x - this.enemySize * 2.5, this.screenHeight / 2, 0, -100]
                ]
            ),
            'bee-diving-left-loop-start': new Spline (
                [
                    [this.enemySize, this.screenHeight / 2 - this.enemySize * 2, 0, -50],
                    [0, this.screenHeight / 2 - this.enemySize * 2, 0, 50],
                    [this.screenCenter.x + this.enemySize * 1.5, this.screenCenter.y + this.enemySize, 0, 100],
                    [this.screenCenter.x + this.enemySize * 1.5, this.screenHeight - this.enemySize * 4, 0, 250],
                    [this.enemySize, this.screenHeight - this.enemySize * 4, 0, -250],
                    [this.screenCenter.x + this.enemySize * 1.5, this.screenHeight - this.enemySize * 4, 0, 250],
                    [this.screenCenter.x + this.enemySize * 1.5, this.screenHeight, 0, 0]
                ]
            ),
            'bee-diving-left-loop-end': new Spline(
                [
                    [this.screenCenter.x / 2, 0, 0, 0],
                    [this.screenCenter.x / 2 - this.enemySize, this.enemySize * 2.5, -50, -100]
                ]
            ),
            'bee-incoming-challenge-left': new Spline(
                [
                    [this.screenCenter.x  + this.enemySize * 1.5, 0, 0, 500],
                    [this.screenCenter.x - this.enemySize * 1.5, this.screenHeight - this.enemySize * 5.5, -60, 100],
                    [this.enemySize * 1.5, this.screenHeight - this.enemySize * 5.5, 0, -100],
                    [this.screenWidth, this.screenCenter.y - this.enemySize * 0.5, 0, 100]
                ]
            ),
            'boss-incoming-challenge-left': new Spline(
                [
                    [0, this.screenHeight - this.enemySize * 2.5, -50, 50], 
                    [this.screenCenter.x + this.enemySize * 4.5, this.screenCenter.y + this.enemySize * 0.5, 0, -100],
                    [this.screenCenter.x + this.enemySize * 4.5, this.screenCenter.y - this.enemySize * 3.5, 0, -100],
                    [this.screenCenter.x + this.enemySize * 2.5, this.screenCenter.y - this.enemySize * 3.5, 0, 100],
                    [this.screenCenter.x + this.enemySize * 2.5, this.screenCenter.y + this.enemySize * 0.5, 0, 100],
                    [this.screenCenter.x + this.enemySize * 4.5, this.screenCenter.y + this.enemySize * 0.5, 50, -100],
                    [this.screenWidth, this.screenCenter.y - this.enemySize * 3.5, -100, 100]
                ]
            )
        }
        this.paths['butterfly-incoming-1'] = this.paths['bee-incoming-1'].mirrorVertically(this.screenWidth)
        this.paths['butterfly-incoming-2'] = this.paths['boss-incoming-1'].mirrorVertically(this.screenWidth)
        this.paths['bee-diving-right'] = this.paths['bee-diving-left'].mirrorVertically(this.screenWidth)
        this.paths['butterfly-diving-right-start'] = this.paths['butterfly-diving-left-start'].mirrorVertically(this.screenWidth)
        this.paths['butterfly-diving-right-end'] = this.paths['butterfly-diving-left-end'].mirrorVertically(this.screenWidth)
        this.paths['boss-diving-right-start'] = this.paths['boss-diving-left-start'].mirrorVertically(this.screenWidth)
        this.paths['boss-diving-right-end'] = this.paths['boss-diving-left-end'].mirrorVertically(this.screenWidth)
        this.paths['boss-capture-right-start'] = this.paths['boss-capture-left-start'].mirrorVertically(this.screenWidth)
        this.paths['boss-capture-right-middle'] = this.paths['boss-capture-left-middle'].mirrorVertically(this.screenWidth)
        this.paths['boss-capture-right-end'] = this.paths['boss-capture-left-end'].mirrorVertically(this.screenWidth)
        this.paths['butterfly-incoming-3-outer'] = this.paths['boss-incoming-2-outer'].mirrorVertically(this.screenWidth)
        this.paths['butterfly-incoming-3-inner'] = this.paths['boss-incoming-2-inner'].mirrorVertically(this.screenWidth)
        this.paths['bee-incoming-3-outer'] = this.paths['bee-incoming-2-outer'].mirrorVertically(this.screenWidth)
        this.paths['bee-incoming-3-inner'] = this.paths['bee-incoming-2-inner'].mirrorVertically(this.screenWidth)
        this.paths['bee-diving-right-loop-start'] = this.paths['bee-diving-left-loop-start'].mirrorVertically(this.screenWidth)
        this.paths['bee-diving-right-loop-end'] = this.paths['bee-diving-left-loop-end'].mirrorVertically(this.screenWidth)
        this.paths['bee-incoming-challenge-right'] = this.paths['bee-incoming-challenge-left'].mirrorVertically(this.screenWidth)
        this.paths['boss-incoming-challenge-right'] = this.paths['boss-incoming-challenge-left'].mirrorVertically(this.screenWidth)
    }

    getPath = (pathName, numSamples) => {
        return this.paths[pathName].getPath(numSamples)
    }
    
    shiftPath = (path, newStart) => {
        const deltaX = newStart.x - path[0].x
        const deltaY = newStart.y - path[0].y
        for (let i = 0; i < path.length; ++i) {
            path[i].x += deltaX,
            path[i].y += deltaY
        }
    }
}
