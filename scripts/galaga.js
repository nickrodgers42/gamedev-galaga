class Galaga {
    constructor(assets, gameStyle, currentHighScore) {
        this.assets = assets
        this.gameStyle = gameStyle
        this.currentHighScore = currentHighScore
        this.paused = true
        this.canvas = document.getElementById('game-canvas')
        this.context = this.canvas.getContext('2d')
        this.gameFont = 'Press Start 2P'
        this.gameOver = false
        this.missileSystem = new MissileSystem(this)
        this.particleSystem = new ParticleSystem(this.context)
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
        this.lostLife = false
        this.lifeTransitionTimer = 0
        this.gameOverTransition = false

        this.audioAssets = [
            'theme-song', 
            'level-start', 
            'shoot', 
            'enemy-incoming', 
            'enemy-kill',
            'enemy-hit',
            'level-start',
            'stage-over',
            'player-kill'
        ]
        this.assets['enemy-hit'].volume = 0.3
        this.assets['level-start'].volume = 0.3
        this.assets['stage-over'].volume = 0.3
        this.assets['player-kill'].volume = 0.3
        this.enemySystem = new EnemySystem(this, this.assets, this.canvas.width, this.canvas.height, 16)
        this.playerExplosion = null
        this.playThemeSong = true
        this.renderPlayer = false
    }

    nextStage = () => {
        this.stage += 1
        this.transitionTimer = 0
        if (this.stage == 1 && this.playThemeSong) {
            this.transitionTimer = this.assets['theme-song'].duration * 1000
            this.transitioningStage = true
            this.assets['theme-song'].play()
        }
        else {
            this.transitionTimer = this.assets['level-start'].duration * 1000 + 1000
            this.transitioningStage = true
            this.assets['level-start'].play()
        }
        this.enemySystem.nextStage()
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
            if (this.transitionTimer <= 1000) {
                this.renderPlayer = true
            }
        }
        if (this.transitionTimer <= 0) {
            if (this.stars !== null && !this.stars.moving) {
                this.stars.moving = true
            }
            this.renderPlayer = true
            this.transitioningStage = false
        }
    }

    nextLife = () => {
        this.enemySystem.stopDiving()
        if (this.stars !== null) {
            this.stars.moving = false
        }
        this.lostLife = true
        this.lifeTransitionTimer = this.assets['player-kill'].duration * 1000 + 1000
        this.assets['player-kill'].play()
    }

    playerExplode = () => {
        this.renderPlayer = false
        this.particleSystem.explosion(this.player.position.copy())
        this.playerExplosion = new Explosion(
            this.assets['ship-explode'],
            this.player.position.copy(),
            Math.floor(this.assets['ship-explode'].width / 4),
            this.assets['ship-explode'].height,
            4,
            [250, 250, 250, 250]
        )
    }

    detectCollisions = () => {
        for (let i = 0; i < this.enemySystem.enemies.length; ++i) {
            const enemy = this.enemySystem.enemies[i]
            if (this.player.position.distanceTo(enemy.position) < this.player.hitboxRadius + enemy.hitboxRadius && !this.lostLife) {
                this.playerExplode()
                this.player.crash()
                this.enemySystem.crash(enemy)
                this.nextLife()
                break
            }
            for (let j = 0; j < this.missileSystem.playerMissiles.length; ++j) {
                const missile = this.missileSystem.playerMissiles[j]
                if (missile.position.distanceTo(enemy.position) < missile.hitboxRadius + enemy.hitboxRadius) {
                    this.enemySystem.hit(enemy)
                    this.missileSystem.shotsHit += 1
                    missile.detonated = true
                }
            }
            for (let j = 0; j < this.missileSystem.enemyMissiles.length; ++j) {
                const missile = this.missileSystem.enemyMissiles[j]
                if (missile.position.distanceTo(this.player.position) < missile.hitboxRadius + this.player.hitboxRadius && !this.lostLife) {
                    this.playerExplode()
                    this.player.crash()
                    this.nextLife()
                    missile.detonated = true
                }
            }
        }
    }

    updateLifeTransitionTimer = (elapsedTime) => {
        this.lifeTransitionTimer -= elapsedTime
        if (this.lifeTransitionTimer <= 1000) {
            this.renderPlayer = true
            if (this.stars !== null) {
                this.stars.moving = true
            }
        } 
        if (this.lifeTransitionTimer <= 0) {
            this.lostLife = false
            if (this.player.lives !== 0) {
                this.enemySystem.startDiving()
            }
            else {
                this.gameOverTransition = true
                this.transitionTimer = this.assets['stage-over'].duration * 1000
                this.assets['stage-over'].play()
            }
        }
    }

    updateGameOverTransition = (elapsedTime) => {
        this.transitionTimer -= elapsedTime
        if (this.transitionTimer <= 0) {
            this.gameOver = true
        }
    }

    update = (elapsedTime) => {
        if (!this.paused) {
            if (this.enemySystem.stageComplete) {
                this.nextStage()
            }
            if (this.stars !== null) {
                this.stars.update(elapsedTime)
            }
            if (this.transitioningStage) {
                this.updateTransition(elapsedTime)
            }
            this.missileSystem.update(elapsedTime)
            this.particleSystem.update(elapsedTime)
            this.enemySystem.update(elapsedTime)
            if (this.lostLife) {
                this.updateLifeTransitionTimer(elapsedTime)
            }
            if (this.gameOverTransition) {
                this.updateGameOverTransition(elapsedTime)
            }
            this.detectCollisions()
            if (this.playerExplosion !== null) {
                this.playerExplosion.update(elapsedTime)
                if (this.playerExplosion.complete) {
                    this.playerExplosion = null
                }
            }
            this.updateOneUp(elapsedTime)
        }
    }

    updateOneUp = (elapsedTime) => {
        const oneUpDelta = (this.oneUp.on) ? 1 : -1
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
        if (!this.gameOverTransition) {
            this.missileSystem.render(this.context)
            this.enemySystem.render(this.context)
        }
        if (this.player.lives !== 0) {
            if (this.transitioningStage) {
                this.renderStageText()
            }
            if (this.renderPlayer) {
                this.player.render(this.context)
            }
        }
        else {
            if (this.gameOverTransition) {
                this.renderShotCount()
            }
        }
        if (this.lostLife && this.lifeTransitionTimer <= 2000) {
            this.renderReadyText()
        }
        if (this.playerExplosion !== null && this.gameStyle['Style'] !== 'GameDev') {
            this.playerExplosion.render(this.context, 0)
        }
        if (this.gameStyle['Style'] == 'GameDev') {
            this.particleSystem.render()
        }
        if (this.transitioningStage && this.stage == 1) {
            this.renderScore()
        }
        else {
            this.renderGameStatus()
        }
    }

    setFont = (context) => {
        context.fillStyle = '#00FFFF'
        context.strokeStyle = '#00FFFF'
        const fontSize = 8
        const fontStr = `${fontSize}px "${this.gameFont}"`
        context.font = document.fonts.check(fontStr) ? fontStr : `${fontStr}px monsopace`
        context.textBaseline = 'top'
        context.textBaseline = 'left'
    }

    renderShotCount = () => {
        this.context.save()
        this.setFont(this.context)
        const fontSize = 8
        let firedStr = `SHOTS FIRED ${this.missileSystem.shotsFired}`
        let hitStr = `NUMBER OF HITS ${this.missileSystem.shotsHit}`
        let accStr = `ACCURACY ${
            (this.missileSystem.shotsFired !== 0) ?
            (this.missileSystem.shotsHit / this.missileSystem.shotsFired).toFixed(2)
            :
            0
        }`
            
        this.context.fillText(
            firedStr,
            Math.floor(this.canvas.width / 2 - this.context.measureText(firedStr).width / 2),
            Math.floor(this.canvas.height / 2 - fontSize)
        )
        this.context.fillText(
            hitStr,
            Math.floor(this.canvas.width / 2 - this.context.measureText(hitStr).width / 2),
            Math.floor(this.canvas.height / 2 + fontSize)
        )
        this.context.fillText(
            accStr,
            Math.floor(this.canvas.width / 2 - this.context.measureText(accStr).width / 2),
            Math.floor(this.canvas.height / 2 + fontSize * 3)
        )
        this.context.restore()
    }

    renderReadyText = () => {
        this.context.save()
        this.context.fillStyle = '#00FFFF'
        this.context.strokeStyle = '#00FFFF'
        const fontSize = 8
        const fontStr = `${fontSize}px "${this.gameFont}"`
        this.context.font = document.fonts.check(fontStr) ? fontStr : `${fontStr}px monsopace`
        this.context.textBaseline = 'top'
        this.context.textBaseline = 'left'
        let readyStr = 'READY'
        if (this.player.lives == 0) {
            readyStr = 'GAME OVER'
        }
        this.context.fillText(
            readyStr,
            Math.floor(this.canvas.width / 2 - this.context.measureText(readyStr).width / 2),
            Math.floor(this.canvas.height / 2) - fontSize
        )
        this.context.restore()
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
        let stageStr = `STAGE ${this.stage}`
        if (this.stage % 3 == 0) {
            stageStr = `CHALLENGING STAGE`
        }
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
        if (this.oneUp.on) {
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
            for (const indicator of Object.keys(this.levelIndicators).reverse()) {
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
        if (!this.transitioningStage && !this.lostLife) {
            this.player.fire()
        }
    }
}
