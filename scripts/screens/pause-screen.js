class PauseScreen extends Screen {
    constructor(controller, inputHandler, gameLoop) {
        super(controller)
        this.inputHandler = inputHandler
        this.gameLoop = gameLoop
    }
    
    init = () => {}

    returnToMainMenu = () => {
        this.gameLoop.game = null
        this.controller.restart()
    }

    run = () => {
        this.controller.registerMenuInputs()
        this.inputHandler.registerCommand(
            'Escape',
            (elapsedTime) => this.controller.goBack(),
            true
        )
        this.addButton('pause-resume', this.controller.goBack)
        this.addButton('pause-quit', this.returnToMainMenu)
        this.controller.buttons = this.buttons
    }
}
