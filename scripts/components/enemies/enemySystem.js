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
        this.testPath = this.enemyPathMaker.getPath('bee-incoming-1', 20)
        // this.testPath.push(this.enemyGrid.getCell(0, 0).center)
        this.gridState = 'right'
        this.gridMoveRate = 0.015
        this.testBee = new Bee(this.assets['bee'], new Point2d(), this.screenWidth, this.screenHeight)
        this.levelEnemiesInitialized = false
    }

    makeEnemy = (enemyName) => {
        let enemy = null
        if (enemyName == 'bee') {
            enemy = new Bee(
                this.assets['bee'], 
                new Point2d(), 
                this.screenWidth, 
                this.screenHeight
            )
        }
        else if (enemyName == 'butterfly') {
            enemy = new Butterfly(
                this.assets['butterfly'], 
                new Point2d(), 
                this.screenWidth, 
                this.screenHeight
            )
        }
        else if (enemyName == 'boss') {
            enemy = new BossGalaga(
                this.assets['boss-1'], 
                this.assets['boss-2'], 
                new Point2d(), 
                this.screenWidth, 
                this.screenHeight
            )
        }
        this.enemies.push(enemy)
        return enemy
    }

    makeBee = () => this.makeEnemy('bee')

    makeButterfly = () => this.makeEnemy('butterfly')

    makeBoss = () => this.makeEnemy('boss')
    
    updateStageSequence = (elapsedTime) => {
        this.stageTimer += elapsedTime
        if (this.stageSequencesStarted == 0 && this.stageTimer > 500) {
            this.stageTimer == 0
            this.stageSequencesStarted += 1
            const beePath = this.enemyPathMaker.getPath('bee-incoming-1', 10)
            const butterflyPath = this.enemyPathMaker.getPath('butterfly-incoming-1', 10)
            const beeCells = [[4,4], [5,5], [5,4], [4,5]]
            const butterflyCells = [[2, 4], [3, 5], [3,4], [2,5]]
            for (let i = 0; i < beeCells.length; ++i) {
                const bee = this.makeBee()
                const beeCell = this.enemyGrid.getCell(...beeCells[i])
                bee.moveAlongPath([
                    new PathPoint(beePath[0].x, beePath[0].y - this.enemySize * i),
                    ...beePath,
                    beeCell.center
                ], () => this.enemyGrid.setEnemy(beeCell, bee))

                const butterfly = this.makeButterfly()
                const butterflyCell = this.enemyGrid.getCell(...butterflyCells[i])
                butterfly.moveAlongPath([
                    new PathPoint(butterflyPath[0].x, butterflyPath[0].y - this.enemySize * i),
                    ...butterflyPath,
                    butterflyCell.center
                ], () => this.enemyGrid.setEnemy(butterflyCell, butterfly))
            }
        }
        else if (this.stageSequencesStarted == 1 && this.stageTimer > 5000) {
            this.stageTimer = 0
            this.stageSequencesStarted += 1
            const bossPath = this.enemyPathMaker.getPath('boss-incoming-1', 10)
            const bossCells = [[1, 3], [1,4], [1,5], [1,6]]
            const butterflyCells = [[2, 3], [2,6], [3, 3], [3,6]]
            for (let i = 0; i < bossCells.length + butterflyCells.length; ++i) {
                if (i % 2 == 0) {
                    const boss = this.makeBoss()
                    const cell = this.enemyGrid.getCell(...bossCells[Math.floor(i / 2)])
                    boss.moveAlongPath([
                        new PathPoint(bossPath[0].x - this.enemySize * i, bossPath[0].y),
                        ...bossPath,
                        cell.center
                    ], () => this.enemyGrid.setEnemy(cell, boss))
                }
                else {
                    const butterfly = this.makeButterfly()
                    const cell = this.enemyGrid.getCell(...butterflyCells[Math.floor(i / 2)])
                    butterfly.moveAlongPath([
                        new PathPoint(bossPath[0].x - this.enemySize * i, bossPath[0].y),
                        ...bossPath,
                        cell.center
                    ], () => this.enemyGrid.setEnemy(cell, butterfly))
                }
            }
        }
        else if (this.stageSequencesStarted == 2 && this.stageTimer > 5000) {
            this.stageSequencesStarted += 1
            this.stageTimer = 0
            const butterflyPath = this.enemyPathMaker.getPath('butterfly-incoming-2', 10)
            const butterflyCells = [[2, 1], [2,7], [2,2], [2,8], [3,1], [3,7], [3,2], [3,8]]
            for (let i = 0; i < butterflyCells.length; ++i) {
                const butterfly = this.makeButterfly()
                const cell = this.enemyGrid.getCell(...butterflyCells[i])
                butterfly.moveAlongPath([
                    new PathPoint(butterflyPath[0].x + this.enemySize * i, butterflyPath[0].y),
                    ...butterflyPath,
                    cell.center
                ], () => this.enemyGrid.setEnemy(cell, butterfly))
            }
        }
        else if (this.stageSequencesStarted == 3 && this.stageTimer > 5000) {
            this.stageSequencesStarted += 1
            this.stageTimer = 0
            const path = this.enemyPathMaker.getPath('bee-incoming-1', 10)
            const cells = [[4, 2], [4, 6], [4,3], [4,7], [5, 2], [5,3], [5, 6], [5, 7]]
            for (let i = 0; i < cells.length; ++i) {
                const bee = this.makeBee()
                const cell = this.enemyGrid.getCell(...cells[i])
                bee.moveAlongPath([
                    new PathPoint(path[0].x, path[0].y - this.enemySize * i),
                    ...path,
                    cell.center
                ], () => this.enemyGrid.setEnemy(cell, bee))
            }
        }
        else if (this.stageSequencesStarted == 4 && this.stageTimer > 5000) {
            this.stageSequencesStarted += 1
            this.stageTimer = 0
            const path = this.enemyPathMaker.getPath('butterfly-incoming-1', 10)
            const cells = [[4,0], [4, 1], [4, 8], [4, 9], [5, 0], [5, 1], [5, 8], [5,9]]
            for (let i = 0; i < cells.length; ++i) {
                const bee = this.makeBee()
                const cell = this.enemyGrid.getCell(...cells[i])
                bee.moveAlongPath([
                    new PathPoint(path[0].x, path[0].y - this.enemySize * i),
                    ...path,
                    cell.center
                ], () => this.enemyGrid.setEnemy(cell, bee))
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
