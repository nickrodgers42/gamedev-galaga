class Galaga {
    constructor(assets, gameStyle, currentHighScore) {
        this.assets = assets
        this.gameStyle = gameStyle
        this.currentHighScore = currentHighScore
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
            50: this.assets['indicator-50'],
            30: this.assets['indicator-30'],
            20: this.assets['indicator-20'],
            10: this.assets['indicator-10'],
            5: this.assets['indicator-5'],
            1: this.assets['indicator-1']
        }
        this.oneUp = {
            on: true,
            counterMax: 350,
            counter: 0
        }
        this.score = 0
        this.stage = 0
        this.transitioningStage = false
        this.transitionTimer = 0
        this.audioAssets = ['theme-song', 'level-start', 'shoot']
        this.enemySystem = new EnemySystem(this, this.assets, this.canvas.width, this.canvas.height, 16)
        // this.testBee = new Bee(this.assets['bee'], new Point2d(), this.canvas.width, this.canvas.height)
    }

    nextStage = () => {
        this.stage += 1
        this.transitionTimer = 0
        if (this.stage == 1) {
            this.transitionTimer = this.assets['theme-song'].duration * 1000
            this.transitioningStage = true
            this.assets['theme-song'].play()
        }
    }

    play = () => {
        this.paused = false
    }

    pause = () => {
        for (let i = 0; i < this.audioAssets.length; ++i) {
            const audio = this.assets[this.audioAssets[i]]
            audio.currentTime = audio.duration
        }
        this.paused = true
    }

    updateTransition = (elapsedTime) => {
        this.transitionTimer -= elapsedTime
        if (this.stage == 1) {
            if (this.transitionTimer <= 2000) {
                if (this.stars && !this.stars.moving) {
                    this.stars.moving = true
                }
            }
        }
        if (this.transitionTimer <= 0) {
            this.transitioningStage = false                
        }
    }

    update = (elapsedTime) => {
        if (!this.paused) {
            if (this.stage == 0) {
                this.nextStage()
            }
            if (this.gameStyle['Style'] !== 'GameDev') {
                this.stars.update(elapsedTime)
            }
            if (this.transitioningStage) {
                this.updateTransition(elapsedTime)
            }
            this.missileSystem.update(elapsedTime)
            this.enemySystem.update(elapsedTime)
            this.updateOneUp(elapsedTime)
            // this.testBee.update(elapsedTime)
            // if (!this.testBee.movingAlongPath) {
            //     this.testBee.moveAlongPath(
            //         this.enemyPathMaker.makePath('bee-incoming-1'),
            //     )
            // }
        }
    }

    updateOneUp = (elapsedTime) => {
        const oneUpDelta = (this.oneUpOn) ? 1 : -1
        this.oneUp.counter += elapsedTime * oneUpDelta
        if (this.oneUp.counter >= this.oneUp.counterMax) {
            this.oneUp.on = false
            this.oneUp.counter = this.oneUp.counterMax
        }
        else if (this.oneUp.counter <= 0) {
            this.oneUp.on = true
            this.oneUp.counter = 0
        }
    }

    render = () => {
        this.drawBackground()
        this.missileSystem.render(this.context)
        this.enemySystem.render(this.context)
        if (this.transitioningStage) {
            this.renderStageText()
        }
        if (!(this.stage == 1 && this.transitionTimer > 1000)) {
            this.player.render(this.context)
        }
        if (this.transitioningStage && this.stage == 1) {
            this.renderScore()
        }
        else {
            this.renderGameStatus()
        }
        // this.testBee.render(this.context, true)
    }

    renderStageText = () => {
        this.context.save()
        this.context.fillStyle = '#00FFFF'
        this.context.strokeStyle = '#00FFFF'
        const fontSize = 8
        const fontStr = `${fontSize}px "${this.gameFont}"`
        this.context.font = document.fonts.check(fontStr) ? fontStr : `${fontStr}px monsopace`
        this.context.textBaseline = 'top'
        this.context.textBaseline = 'left'
        if (this.stage == 1) {
            const playerStr = 'PLAYER 1'
            this.context.fillText(
                playerStr,
                Math.floor(this.canvas.width / 2 - this.context.measureText(playerStr).width / 2),
                Math.floor(this.canvas.height / 2) - fontSize
            )
        }
        const stageStr = `STAGE ${this.stage}`
        this.context.fillText(
            stageStr,
            Math.floor(this.canvas.width / 2 - this.context.measureText(stageStr).width / 2),
            Math.floor(this.canvas.height / 2) + 2
        )
        this.context.restore()
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
            Math.floor(oneUpStrWidth * 2.25),
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
        let remainingLevels = this.stage
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
        if (!this.transitioningStage) {
            this.player.fire()
        }
    }
}
