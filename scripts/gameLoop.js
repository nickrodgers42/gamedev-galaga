class GameLoop {
    constructor(controller, inputHandler, controlMap) {
        this.controller = controller
        this.inputHandler = inputHandler
        this.previousTime = performance.now()
        requestAnimationFrame(this.gameLoop)
        this.controlMap = controlMap
        this.game = null
    }

    runGame = () => {
        if (this.game === null) {
            // this.game = new LanderGame()
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


    registerGameControls = () => {
        if (this.game !== null) {
            this.inputHandler.unregisterAllCommands()
            // this.inputHandler.registerCommand(
            //     this.controlMap['Thrust'],
            //     this.game.thrustLander
            // )
            // this.inputHandler.registerKeyReleaseCommand(
            //     this.controlMap['Thrust'],
            //     this.game.stopLanderThrust
            // )
            // this.inputHandler.registerCommand(
            //     this.controlMap['Rotate Left'],
            //     this.game.rotateLanderLeft
            // )
            // this.inputHandler.registerCommand(
            //     this.controlMap['Rotate Right'],
            //     this.game.rotateLanderRight
            // )
            // this.inputHandler.registerCommand(
            //     this.controlMap['Pause'],
            //     (elapsedTime) => this.pauseGame(),
            //     true
            // )
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
