class GameLoop {
    constructor(
        controller, 
        inputHandler, 
        controlMap, 
        gameStyle, 
        assets,
        storageController
    ) {
        this.controller = controller
        this.inputHandler = inputHandler
        this.controlMap = controlMap
        this.gameStyle = gameStyle
        this.assets = assets
        this.storageController = storageController
        this.game = null
        this.previousTime = performance.now()
        requestAnimationFrame(this.gameLoop)
    }

    runGame = () => {
        if (this.game === null) {
            this.game = new Galaga(this.assets, this.gameStyle, this.getCurrentHighScore())
        }
        this.registerGameControls()
        if (this.game !== null) {
            this.game.play()
        }
    }

    pauseGame = () => {
        if (this.game !== null) {
            this.game.pause()
        }
        this.controller.showScreen('pause-screen')
    }

    gameOver = () => {
        if (this.game !== null) {
            this.controller.score = this.game.score
        }
        else {
            this.controller.score = 0
        }
        this.game = null
        this.controller.showScreen('game-over')
    }

    getCurrentHighScore = () => {
        const scores = this.storageController.get('scores')
        if (scores.length == 0) {
            return 0
        }
        const highScore = scores.reduce((acc, val) => {
            if (Number(val.score) > Number(acc.score)) {
                acc = val
            }
            return acc
        })
        return Math.round(highScore.score)
    }

    registerGameControls = () => {
        if (this.game !== null) {
            this.inputHandler.unregisterAllCommands()
            this.inputHandler.registerCommand(
                this.controlMap['Move Left'],
                this.game.playerMoveLeft
            )
            this.inputHandler.registerCommand(
                this.controlMap['Move Right'],
                this.game.playerMoveRight
            )
            this.inputHandler.registerCommand(
                this.controlMap['Fire'],
                this.game.playerFire,
                true
            )
            this.inputHandler.registerCommand(
                this.controlMap['Pause'],
                (elapsedTime) => this.pauseGame(),
                true
            )
        }
    }

    processInput = (elapsedTime) => {
        this.inputHandler.update(elapsedTime)
    }

    update = (elapsedTime) => {
        if (this.game !== null) {
            this.game.update(elapsedTime)
            if (this.game.gameOver) {
                this.gameOver()
            }
        }
    }

    render = () => {
        if (this.game !== null) {
            this.game.render()
        }
    }

    gameLoop = (time) => {
        const elapsedTime = time - this.previousTime
        this.previousTime = time
        this.processInput(elapsedTime)
        this.update(elapsedTime)
        this.render()
        requestAnimationFrame(this.gameLoop)
    }
}
