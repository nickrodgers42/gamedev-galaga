class EnemyTimer {
    constructor(max, min) {
        this.time = 0
        this.minTime = min
        this.maxTime = max
        this.currentMax = Math.floor(
            Math.random() * (this.maxTime - this.minTime) + this.minTime
        )
        this.ready = false
    }

    update = (elapsedTime) => {
        this.time += elapsedTime
        if (this.time > this.currentMax) {
            this.ready = true
        }
    }

    restart = () => {
        this.time = 0
        this.ready = false
        this.currentMax = Math.floor(
            Math.random() * (this.maxTime - this.minTime) + this.minTime
        )
    }
}

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

        this.beeDiveTimer = new EnemyTimer(1000, 5000)
        this.butterflyDiveTimer = new EnemyTimer(1000, 5000)
        this.bossDiveTimer = new EnemyTimer(3000, 8000)
        this.bossCaptureTimer = new EnemyTimer(5000, 10000)

        this.stageTimer = 0
        this.stageSequencesStarted = 0
        this.stageSequenceLoaded = false
        this.enemyPathMaker = new EnemyPathMaker(this.screenWidth, this.screenHeight, enemySize)
        this.testPath = this.enemyPathMaker.getPath('butterfly-diving-left-start', 20)
        // this.showTestPath = true
        // this.testPath.push(this.enemyGrid.getCell(0, 0).center)
        this.gridState = 'right'
        this.gridMoveRate = 0.015
        this.testBee = new Bee(this.assets['bee'], new Point2d(), this.screenWidth, this.screenHeight)
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
        if (enemy && enemy.sprite instanceof AnimatedSprite && enemy.sprite.numFrames == 2) {
            enemy.sprite.currentFrame = this.enemyGrid.frame
            enemy.sprite.currentCount = this.enemyGrid.frameTimer
        }
        this.enemies.push(enemy)
        return enemy
    }

    makeBee = () => this.makeEnemy('bee')

    makeButterfly = () => this.makeEnemy('butterfly')

    makeBoss = () => this.makeEnemy('boss')

    makeSequence = (cells, enemies, path, hideDirection, status='formation') => {
        for (let i = 0; i < cells.length; ++i) {
            const cell = this.enemyGrid.getCell(...cells[i])
            const enemy = enemies[i]
            enemy.moveAlongPath([
                new PathPoint(
                    path[0].x + this.enemySize * hideDirection.x * i,
                    path[0].y + this.enemySize * hideDirection.y * i,
                ),
                ...path,
                cell.center
            ], () => {
                cell.enemy = enemy
                enemy.status = status
                enemy.gridCell = new Point2d(...cells[i])
            })
        }
    }

    enemyDive = (enemy, pathName, numSamples, callback, returnToGrid=true) => {
        const returnCell = this.enemyGrid.getCell(...enemy.gridCell.coords())
        returnCell.enemy = null
        enemy.status = 'diving'
        const path = this.enemyPathMaker.getPath(pathName, numSamples)
        this.enemyPathMaker.shiftPath(path, enemy.position)
        if (returnToGrid) {
            path.push(returnCell.center)
        }
        enemy.moveAlongPath(path, callback)
    }

    updateStageSequence = (elapsedTime) => {
        this.stageTimer += elapsedTime
        if (this.stageSequencesStarted == 0 && this.stageTimer > 500) {
            this.stageTimer == 0
            this.stageSequencesStarted += 1
            const beeCells = [[4,4], [5,5], [5,4], [4,5]]
            const butterflyCells = [[2, 4], [3, 5], [3,4], [2,5]]
            this.makeSequence(
                beeCells,
                Array.from(Array(beeCells.length), (x, index) => x = this.makeBee()),
                this.enemyPathMaker.getPath('bee-incoming-1', 10),
                new Point2d(0, -1)
            )
            this.makeSequence(
                butterflyCells,
                Array.from(Array(butterflyCells.length), (x, index) => this.makeButterfly()),
                this.enemyPathMaker.getPath('butterfly-incoming-1', 10),
                new Point2d(0, -1)
            )
        }
        else if (this.stageSequencesStarted == 1 && this.stageTimer > 5000) {
            this.stageTimer = 0
            this.stageSequencesStarted += 1
            const bossButterflyCells = [
                [1, 3], [2, 3], [1,4], [2,6], [1,5], [3, 3], [1,6], [3,6]
            ]
            this.makeSequence(
                bossButterflyCells,
                Array.from(Array(bossButterflyCells.length),
                    (x, index) => (index % 2 == 0) ? this.makeBoss() : this.makeButterfly()
                ),
                this.enemyPathMaker.getPath('boss-incoming-1', 10),
                new Point2d(-1, 0)
            )
        }
        else if (this.stageSequencesStarted == 2 && this.stageTimer > 5000) {
            this.stageSequencesStarted += 1
            this.stageTimer = 0
            const butterflyCells = [[2, 1], [2,7], [2,2], [2,8], [3,1], [3,7], [3,2], [3,8]]
            this.makeSequence(
                butterflyCells,
                Array.from(Array(butterflyCells.length), x => this.makeButterfly()),
                this.enemyPathMaker.getPath('butterfly-incoming-2', 10),
                new Point2d(1, 0)
            )
        }
        else if (this.stageSequencesStarted == 3 && this.stageTimer > 5000) {
            this.stageSequencesStarted += 1
            this.stageTimer = 0
            const cells = [[4, 2], [4, 6], [4,3], [4,7], [5, 2], [5,3], [5, 6], [5, 7]]
            this.makeSequence(
                cells,
                Array.from(Array(cells.length), x => this.makeBee()),
                this.enemyPathMaker.getPath('bee-incoming-1', 10),
                new Point2d(0, -1)
            )
        }
        else if (this.stageSequencesStarted == 4 && this.stageTimer > 5000) {
            this.stageSequencesStarted += 1
            this.stageTimer = 0
            const cells = [[4,0], [4, 1], [4, 8], [4, 9], [5, 0], [5, 1], [5, 8], [5,9]]
            this.makeSequence(
                cells,
                Array.from(Array(cells.length), x => this.makeBee()),
                this.enemyPathMaker.getPath('butterfly-incoming-1', 10),
                new Point2d(0, -1)
            )
        }
        else if (this.stageSequencesStarted == 5 && this.stageTimer > 5000) {
            this.stageTimer = 0
            this.stageSequencesStarted += 1
            this.stageSequenceLoaded = true
        }
    }

    randomOpenEnemy = (row1, col1, row2, col2) => {
        const openEnemies = this.enemyGrid.getOpenEnemies(row1, col1, row2, col2)
        if (openEnemies.length > 0) {
            return openEnemies[Math.floor(Math.random() * openEnemies.length)]
        }
        return null
    }

    updateDivingSequence = (elapsedTime) => {
        this.beeDiveTimer.update(elapsedTime)
        if (this.beeDiveTimer.ready) {
            this.beeDiveTimer.restart()
            const selectedEnemy = this.randomOpenEnemy(4, 0, 5, 9)
            if (selectedEnemy !== null) {
                const returnCell = this.enemyGrid.getCell(...selectedEnemy.gridCell.coords())
                const direction = (selectedEnemy.gridCell.y < this.enemyGrid.cols / 2) ? 'left' : 'right'
                this.enemyDive(selectedEnemy, `bee-diving-${direction}`, 10, () => {
                    returnCell.enemy = selectedEnemy
                    selectedEnemy.status = 'formation'
                })
            }
        }
        this.butterflyDiveTimer.update(elapsedTime)
        if (this.butterflyDiveTimer.ready) {
            this.butterflyDiveTimer.restart()
            const selectedEnemy = this.randomOpenEnemy(2, 0, 3, 9)
            if (selectedEnemy !== null) {
                const returnCell = this.enemyGrid.getCell(...selectedEnemy.gridCell.coords())
                const direction = (selectedEnemy.gridCell.y < this.enemyGrid.cols / 2) ? 'left' : 'right'
                this.enemyDive(selectedEnemy, `butterfly-diving-${direction}-start`, 10, () => {
                    selectedEnemy.position.y = 0
                    selectedEnemy.position.x = (direction == 'left') ? this.screenWidth / 4 : (3 * this.screenWidth) / 4
                    this.enemyDive(selectedEnemy, `butterfly-diving-${direction}-end`, 10, () => {
                        returnCell.enemy = selectedEnemy
                        selectedEnemy.status = 'formation'
                    })
                }, false)
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
        if (!this.stageSequenceLoaded) {
            this.updateStageSequence(elapsedTime)
        }
        else {
            this.updateDivingSequence(elapsedTime)
        }
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
        // this.enemyGrid.render(context)
        for (let i = 0; i < this.enemies.length; ++i) {
            this.enemies[i].render(context)
        }
        if (this.showTestPath) {
            context.strokeStyle='red'
            context.lineWidth = 2
            context.beginPath()
            context.moveTo(...this.testPath[0].coords())
            for(let i = 1; i < this.testPath.length; ++i) {
                context.lineTo(...this.testPath[i].coords())
            }
        }
        // this.testBee.render(context)
        context.stroke()
        context.restore()
    }
}
