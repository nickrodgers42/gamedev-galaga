class EnemySystem {
    constructor(game, assets, screenWidth, screenHeight, enemySize) {
        this.enemySize = enemySize
        this.game = game
        this.assets = assets
        this.screenWidth = screenWidth
        this.screenHeight = screenHeight
        this.enemies = []
        this.enemyGrid = []
        this.numRows = 6
        this.numCols = 10
        for (let i = 0; i < this.numRows; ++i) {
            this.enemyGrid.push([])
            for (let j = 0; j < this.numCols; ++j) {
                this.enemyGrid[i].push(new Point2d(
                    Math.floor(this.screenWidth / 2 - (this.enemySize * this.numCols) / 2 + this.enemySize * j + this.enemySize / 2), 
                    (i * this.enemySize) + (2 * this.enemySize) + 2 * i
                ))
            }
        }
        this.enemyPathMaker = new EnemyPathMaker(this.screenWidth, this.screenHeight, enemySize)
        this.gridState = 'right'
        this.gridMoveRate = 0.02
        this.gridCenter = new Point2d(
            this.screenWidth / 2,
            Math.floor((this.numRows / 2) * this.enemySize + (2 * this.numRows / 2)+ (2 * this.enemySize) - this.enemySize / 2)
        )
    }

    update = (elapsedTime) => {
        for (let i = 0; i < this.enemies.length; ++i) {
            this.enemies[i].update(elapsedTime)
        }
        if (this.gameState == 'breathe') {

        }
        else {
            let delta = (this.gridState == 'right') ? 1 : -1
            this.gridCenter.x += delta * elapsedTime * this.gridMoveRate
            if (this.gridCenter.x + (this.numCols / 2) * this.enemySize > this.screenWidth) {
                this.gridState = 'left'
                delta = (this.gridState == 'right') ? 1 : -1
                this.gridCenter.x += delta * elapsedTime * this.gridMoveRate
            }
            else if (this.gridCenter.x - (this.numCols / 2) * this.enemySize < 0) {
                this.gridState = 'right'
                delta = (this.gridState == 'right') ? 1 : -1
                this.gridCenter.x += delta * elapsedTime * this.gridMoveRate
            }
        }
        for (let i = 0; i < this.numRows; ++i) {
            for (let j = 0; j < this.numCols; ++j) {
                if (this.gridState == 'breathe') {

                }
                else {
                    const delta = (this.gridState == 'right') ? 1 : -1
                    this.enemyGrid[i][j].x += delta * this.gridMoveRate * elapsedTime
                }
            }
        }
    }

    render = (context) => {
        context.save()
        for (let i = 0; i < this.enemies.length; ++i) {
            this.enemies[i].render(context)
        }
        context.fillStyle = '#00FFFF'
        for (let i = 0; i < this.numRows; ++i) {
            for (let j = 0; j < this.numCols; ++j) {
                context.fillRect(
                    this.enemyGrid[i][j].x - this.enemySize / 2,
                    this.enemyGrid[i][j].y - this.enemySize / 2,
                    this.enemySize,
                    this.enemySize
                )
            }
        }
        context.fillStyle = '#FF0000'
        context.fillRect(
            this.gridCenter.x - this.enemySize / 2,
            this.gridCenter.y - this.enemySize / 2,
            this.enemySize,
            this.enemySize
        )
        context.restore()
    }
}
