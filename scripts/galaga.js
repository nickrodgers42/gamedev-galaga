class Galaga {
    constructor(assets, gameStyle, currentHighScore) {
        this.assets = assets
        this.gameStyle = gameStyle
        this.currentHighScore = currentHighScore
        this.level = 1
        this.paused = true
        this.canvas = document.getElementById('game-canvas')
        this.context = this.canvas.getContext('2d')
        this.gameFont = 'Press Start 2P'
        this.missileSystem = new MissileSystem(this)
        this.player = new Player(
            this.assets['ship'], 
            this.assets['shoot'],
            this.missileSystem,
            this.canvas.width,
            this.canvas.height
        )
        this.stars = (this.gameStyle['Style'] == 'GameDev') ? null : new Stars(100, this.canvas.width, this.canvas.height)
        this.levelIndicators = {
            50: assets['indicator-50'],
            30: assets['indicator-30'],
            20: assets['indicator-20'],
            10: assets['indicator-10'],
            5: assets['indicator-5'],
            1: assets['indicator-1']
        }
        this.oneUpOn = true
        this.oneUpCounterMax = 350
        this.oneUpCounter = 0
        this.score = 0
    }

    play = () => {
        this.paused = false
    }

    pause = () => {}

    update = (elapsedTime) => {
        if (this.gameStyle['Style'] !== 'GameDev') {
            this.stars.update(elapsedTime)
        }
        this.missileSystem.update(elapsedTime)
        this.updateOneUp(elapsedTime)
    }

    updateOneUp = (elapsedTime) => {
        const oneUpDelta = (this.oneUpOn) ? 1 : -1
        this.oneUpCounter += elapsedTime * oneUpDelta
        if (this.oneUpCounter >= this.oneUpCounterMax) {
            this.oneUpOn = false
            this.oneUpCounter = this.oneUpCounterMax
        }
        else if (this.oneUpCounter <= 0) {
            this.oneUpOn = true
            this.oneUpCounter = 0
        }
    }

    render = () => {
        this.drawBackground()
        this.missileSystem.render(this.context)
        this.player.render(this.context)
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

    renderScore = () => {
        this.context.save()
        const fontSize = 8
        const fontStr = `${fontSize}px "${this.gameFont}"`
        this.context.font = document.fonts.check(fontStr) ? fontStr : `${fontStr}px monsopace`
        this.context.fillStyle = '#FF0000'
        this.context.strokeStyle = '#FF0000'
        this.context.textBaseline = 'top'
        const oneUpStr = '1UP'
        const oneUpStrWidth = this.context.measureText(oneUpStr).width
        const highScoreStr = 'HIGH SCORE'
        if (this.oneUpOn) {
            this.context.fillText(oneUpStr, oneUpStrWidth, 1)
        }

        this.context.fillText(
            highScoreStr,
            Math.floor((this.canvas.width / 2) - (this.context.measureText(highScoreStr).width / 2)),
            1
        )
        
        this.context.fillStyle = '#FFFFFF'
        this.context.strokeStyle = '#FFFFFF'

        let scoreStr = String(this.score)
        if (this.score == 0) {
            scoreStr = '00'
        }
        let currentHighScoreStr = String(this.currentHighScore)
        if (this.score >= this.currentHighScore) {
            currentHighScoreStr = scoreStr
        }
        this.context.textAlign = 'right'
        this.context.fillText(
            scoreStr,
            Math.floor(oneUpStrWidth * 2),
            fontSize+ 2
        )
        
        this.context.fillText(
            currentHighScoreStr,
            Math.floor((this.canvas.width / 2) + oneUpStrWidth),
            fontSize + 2
        )
        this.context.restore()
    }

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

    playerMoveLeft = (elapsedTime) => {
        this.player.moveLeft(elapsedTime)
    }

    playerMoveRight = (elapsedTime) => {
        this.player.moveRight(elapsedTime)
    }

    playerFire = (elapsedTime) => {
        this.player.fire()
    }
}
