class Galaga {
    constructor(assets, gameStyle) {
        this.level = 1
        this.paused = true
        this.assets = assets
        this.gameStyle = gameStyle
        this.canvas = document.getElementById('game-canvas')
        this.context = this.canvas.getContext('2d')
        this.player = new Player(this.assets['ship'])
        this.stars = (this.gameStyle['Style'] == 'GameDev') ? null : new Stars(100, this.canvas.width, this.canvas.height)
        this.levelIndicators = {
            50: assets['indicator-50'],
            30: assets['indicator-30'],
            20: assets['indicator-20'],
            10: assets['indicator-10'],
            5: assets['indicator-5'],
            1: assets['indicator-1']
        }
    }

    play = () => {
        this.paused = false
    }

    pause = () => {}

    update = (elapsedTime) => {
        if (this.gameStyle['Style'] !== 'GameDev') {
            this.stars.update(elapsedTime)
        }
    }

    render = () => {
        this.drawBackground()
        this.renderGameStatus()
    }

    drawBackground = () => {
        if (this.gameStyle['Style'] !== 'GameDev') {
            this.context.save()
            this.context.fillStyle = '#000000'
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
            this.context.restore()
            this.stars.render(this.context)
        }
        else {
            this.context.save()
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.context.fillStyle = 'rgba(0, 0, 0, 0.5)'
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
            this.context.restore()
        }
    }

    renderGameStatus = () => {
        this.renderPlayerLives()
        this.renderScore()
        this.renderLevelMarker()
    }

    renderPlayerLives = () => {
        const shipSprite = this.assets['life']
        let x = 1
        const y = this.canvas.height - shipSprite.height - 1
        for (let i = 0; i < this.player.lives - 1; ++i) {
            this.context.drawImage(shipSprite, x, y)
            x += shipSprite.width
        }
    }

    renderScore = () => {}

    renderLevelMarker = () => {
        const markersNeeded = []
        let x = this.canvas.width - 2
        const y = this.canvas.height - this.levelIndicators[1].height - 2
        let remainingLevels = this.level
        while (remainingLevels > 0) {
            for (const indicator in this.levelIndicators) {
                if (remainingLevels - indicator >= 0) {
                    markersNeeded.push(indicator)
                    x -= this.levelIndicators[indicator].width
                    remainingLevels -= indicator
                    break
                }
            }
        }
        for (let i = 0; i < markersNeeded.length; ++i) {
            this.context.drawImage(
                this.levelIndicators[markersNeeded[i]],
                x, y
            )
            x += this.levelIndicators[markersNeeded[i]].width;
        }
    }

    shipMoveLeft = (elapsedTime) => {
        this.ship.moveLeft(elapsedTime)
    }

    shipMoveRight = (elapsedTime) => {
        this.ship.moveRight(elapsedTime)
    }

    shipFire = (elapsedTime) => {
        this.ship.fire(elapsedTime)
    }
}
