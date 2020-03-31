class GameScreen extends Screen {
    constructor(controller, inputHandler, gameLoop, controlMap) {
        super(controller)
        this.inputHandler = inputHandler
        this.gameLoop = gameLoop
        this.controlMap = controlMap
    }
    
    init = () => {}

    run = () => {
        this.gameLoop.runGame()
    }
}
