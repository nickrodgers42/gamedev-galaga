class EnemyGridCell {
    constructor(center, enemy) {
        this.center = center
        this.enemy = enemy
    }

    get x() {
        return this.center.x
    }
    get y() {
        return this.center.y
    }

    hasEnemy = () => {
        return this.enemy !== null
    }
}

class EnemyGrid {
    constructor(topLeft, cellSize, rows, cols, canvasWidth, canvasHeight) {
        this.topLeft = topLeft
        this.spacing = 2 
        this.rows = rows
        this.cols = cols
        this.cellSize = cellSize
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.cells = []
        this.initCells()
        this.frame = 0
        this.numFrames = 2
        this.frameTimer = 0
        this.frameTimerMax = 500
    }

    initCells = () => {
        for (let i = 0; i < this.rows; ++i) {
            this.cells.push([])
            for (let j = 0; j < this.cols; ++j) {
                this.cells[i].push(
                    new EnemyGridCell (
                        this.getCenter(i, j),
                        null
                    )
                )
            }
        }
    }

    get width() {
        return this.cols * this.cellSize + (this.cols - 1) * this.spacing
    }

    get height() {
        return this.rows * this.cellSize + (this.rows - 1) * this.spacing
    }

    get x() {
        return this.topLeft.x
    }

    get y() {
        return this.topLeft.y
    }

    set x(newX) {
        this.topLeft.x = newX
    }

    set y(newY) {
        this.topLeft.y = newY
    }

    getCenter = (row, col) => {
        return new PathPoint(
            this.topLeft.x + col * this.cellSize + col * this.spacing + this.cellSize / 2,
            this.topLeft.y + row * this.cellSize + row * this.spacing + this.cellSize / 2
        )
    }

    getCell = (row, col) => {
        return this.cells[row][col]
    }

    setEnemy = (cell, enemy) => {
        cell.enemy = enemy
    }

    update = (elapsedTime) => {
        this.frameTimer += elapsedTime
        while (this.frameTimer > this.frameTimerMax) {
            this.frameTimer -= this.frameTimerMax
            this.frame += 1
            this.frame %= this.numFrames
        }
        for (let i = 0; i < this.rows; ++i) {
            for (let j = 0; j < this.cols; ++j) {
                const cell = this.cells[i][j]
                cell.center.set(...this.getCenter(i, j).coords())
                if (cell.hasEnemy()) {
                    cell.enemy.position.set(cell.center)
                }
            }
        }
    }

    render = (context) => {
        context.save()
        context.fillStyle = '#00FFFF'
        for (let i = 0; i < this.rows; ++i) {
            for (let j = 0;j < this.cols; ++j) {
                context.fillRect(
                    Math.floor(this.cells[i][j].x - this.cellSize / 2),
                    Math.floor(this.cells[i][j].y - this.cellSize / 2),
                    this.cellSize,
                    this.cellSize
                )
            }
        }
        context.restore()
    }
}
