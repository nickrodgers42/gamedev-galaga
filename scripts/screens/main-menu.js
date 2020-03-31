class MainMenu extends Screen {
    constructor(controller, inputHandler) {
        super(controller)
        this.inputHandler = inputHandler
    }
    
    init = () => {
        this.addButton('new-game-button', () => this.controller.showScreen('game-screen'))
        this.addButton('high-scores-button', () => this.controller.showScreen('high-scores'))
        this.addButton('controls-button', () => this.controller.showScreen('controls'))
        this.addButton('about-button', () => this.controller.showScreen('about'))
    }

    run = () => {
        this.controller.registerMenuInputs()
        this.controller.buttons = this.buttons
    }
}
