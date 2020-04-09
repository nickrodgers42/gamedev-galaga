class EnemySystem {
    constructor(game, assets, screenWidth, screenHeight, enemySize) {
        this.enemySize = enemySize
        this.game = game
        this.assets = assets
        this.screenWidth = screenWidth
        this.screenHeight = screenHeight
        this.enemies = []
        this.enemyGrid = new EnemyGrid(
            new Point2d(0, this.enemySize * 2), 
            this.enemySize, 
            6, 10, 
            this.screenWidth, 
            this.screenHeight
        )

        this.enemyPathMaker = new EnemyPathMaker(this.screenWidth, this.screenHeight, enemySize)
        this.gridState = 'right'
        this.gridMoveRate = 0.02
    }

    update = (elapsedTime) => {
        for (let i = 0; i < this.enemies.length; ++i) {
            this.enemies[i].update(elapsedTime)
        }

        this.enemyGrid.update(elapsedTime)
        let delta = (this.gridState == 'right') ? 1: -1
        this.enemyGrid.x += delta * elapsedTime * this.gridMoveRate
        if (this.enemyGrid.x + this.enemyGrid.width + 2>= this.screenWidth) {
            this.gridState = 'left'
        }
        else if (this.enemyGrid.x <= 2) {
            this.gridState = 'right'
        }
    }

    render = (context) => {
        context.save()
        for (let i = 0; i < this.enemies.length; ++i) {
            this.enemies[i].render(context)
        }
        this.enemyGrid.render(context)
        context.restore()
    }
}
