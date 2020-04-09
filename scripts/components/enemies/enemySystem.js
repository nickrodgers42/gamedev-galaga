class EnemySystem {
    constructor(game, assets, screenWidth, screenHeight, enemySize) {
        this.enemySize = enemySize
        this.game = game
        this.assets = assets
        this.screenWidth = screenWidth
        this.screenHeight = screenHeight
        this.enemies = []
        this.enemyGrid = new EnemyGrid(
            new Point2d(0, this.enemySize + 2), 
            this.enemySize, 
            6, 10, 
            this.screenWidth, 
            this.screenHeight
        )

        this.stageTimer = 0
        this.stageSequencesStarted = 0
        this.enemyPathMaker = new EnemyPathMaker(this.screenWidth, this.screenHeight, enemySize)
        this.testPath = this.enemyPathMaker.getPath('bee-incoming-1', 10)
        this.testPath.push(this.enemyGrid.getCell(0, 0).center)
        this.gridState = 'right'
        this.gridMoveRate = 0.015
        this.testBee = new Bee(this.assets['bee'], new Point2d(), this.screenWidth, this.screenHeight)
        this.levelEnemiesInitialized = false
    }

    makeEnemy = (enemyName) => {
        let enemy = null
        if (enemyName == 'bee') {
            enemy = new Bee(this.assets['bee'], new Point2d(), this.screenWidth, this.screenHeight)
        }
        else if (enemyName == 'butterfly') {
            enemy = new Butterfly(this.assets['butterfly'], new Point2d(), this.screenWidth, this.screenHeight)
        }
        else if (enemyName == 'boss') {

        }
        this.enemies.push(enemy)
        return enemy
    }

    makeBee = () => this.makeEnemy('bee')

    makeButterfly = () => this.makeEnemy('butterfly')

    updateStageSequence = (elapsedTime) => {
        this.stageTimer += elapsedTime
        if (this.stageSequencesStarted == 0 && this.stageTimer > 500) {
            this.stageSequencesStarted += 1
            const beePath = this.enemyPathMaker.getPath('bee-incoming-1', 10)
            const butterflyPath = this.enemyPathMaker.getPath('butterfly-incoming-1', 10)
            const beeCells = [[4,4], [5,5], [5,4], [4,5]]
            const butterflyCells = [[2, 4], [3, 5], [3,4], [2,5]]
            for (let i = 0; i < beeCells.length; ++i) {
                const bee = this.makeBee()
                bee.moveAlongPath([
                    new PathPoint(beePath[0].x, beePath[0].y - this.enemySize * i),
                    ...beePath,
                    this.enemyGrid.getCell(...beeCells[i]).center
                ], () => this.enemyGrid.getCell(...beeCells[i]).enemy = bee)

                const butterfly = this.makeButterfly()
                butterfly.moveAlongPath([
                    new PathPoint(butterflyPath[0].x, butterflyPath[0].y - this.enemySize * i),
                    ...butterflyPath,
                    this.enemyGrid.getCell(...butterflyCells[i]).center
                ], () => this.enemyGrid.getCell(...butterflyCells[i]).enemy = butterfly)
            }
        }
    }

    updateGridPosition = (elapsedTime) => {
        let delta = (this.gridState == 'right') ? 1: -1
        this.enemyGrid.x += delta * elapsedTime * this.gridMoveRate
        if (this.enemyGrid.x + this.enemyGrid.width + 2>= this.screenWidth) {
            this.gridState = 'left'
        }
        else if (this.enemyGrid.x <= 2) {
            this.gridState = 'right'
        }
    }

    update = (elapsedTime) => {
        this.updateStageSequence(elapsedTime)
        for (let i = 0; i < this.enemies.length; ++i) {
            this.enemies[i].update(elapsedTime)
        }
        if (!this.testBee.movingAlongPath) {
            this.testBee.moveAlongPath(this.testPath)
        }
        this.testBee.update(elapsedTime)
        this.updateGridPosition(elapsedTime)
        this.enemyGrid.update(elapsedTime)
    }

    render = (context) => {
        context.save()
        this.enemyGrid.render(context)
        for (let i = 0; i < this.enemies.length; ++i) {
            this.enemies[i].render(context)
        }
        // context.strokeStyle='red'
        // context.lineWidth = 2
        // context.beginPath()
        // context.moveTo(...this.testPath[0].coords())
        // for(let i = 1; i < this.testPath.length; ++i) {
        //     context.lineTo(...this.testPath[i].coords())
        // }
        // this.testBee.render(context)
        context.stroke()
        context.restore()
    }
}
