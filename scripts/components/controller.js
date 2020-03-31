class Controller {
    constructor(screens, inputHandler, defaultScreen='main-menu') {
        this.screens = screens
        this.inputHandler = inputHandler
        this.defaultScreen = defaultScreen
        this.currentScreen = defaultScreen
        this.screenStack = []
        this._buttons = []
        this.selectedButtonIndex = null
        this.score = 0
    }

    get buttons() {
        return this._buttons
    }

    set buttons(buttons) {
        this._buttons = buttons
        for (const button of this.buttons) {
            button.addEventListener('mouseover', (event) => {
                let selectedButtons = document.getElementsByClassName('selected-button')
                while (selectedButtons.length > 0) {
                    selectedButtons[0].classList.remove('selected-button')
                }
                this.selectedButtonIndex = null
            })
        }
    }

    init = () => {
        for (screen in this.screens) {
            this.screens[screen].init()
        }
        this.showScreen(this.defaultScreen)
    }

    registerMenuInputs = () => {
        this.inputHandler.unregisterAllCommands()
        this.inputHandler.registerCommand(
            'ArrowDown',
            () => this.nextButton(),
            true
        )
        this.inputHandler.registerCommand(
            'ArrowUp',
            () => this.previousButton(),
            true
        )
        this.inputHandler.registerCommand(
            'Escape', 
            () => this.goBack(),
            true
        )
        this.inputHandler.registerCommand(
            'n',
            () => this.showScreen('game-screen'),
            true
        )
        this.inputHandler.registerCommand(
            'Enter',
            () => this.pressSelectedButton(),
            true
        )
    }

    showScreen = (screenId) => {
        this.transitionToScreen(screenId)
        if (screenId != this.currentScreen) {
            this.screenStack.push(this.currentScreen)
        }
        this.currentScreen = screenId
    }

    transitionToScreen = (screenId) => {
        const active = document.getElementsByClassName('active')
        while (active.length > 0) {
            active[0].classList.remove('active')
        }
        this.clearButtons()
        this.screens[screenId].run()
        document.getElementById(screenId).classList.add('active')
    }

    clearButtons = () => {
        if (this.selectedButtonIndex != null) {
            this.buttons[this.selectedButtonIndex].classList.remove('selected-button')
        }
        this.buttons = []
        this.selectedButtonIndex = null
    }

    deselectButton = () => {
        if (this.selectedButtonIndex != null) {
            this.buttons[this.selectedButtonIndex].classList.remove('selected-button')
        }
        this.selectedButtonIndex = null
    }

    nextButton = (increment=1) => {
        if (this.buttons.length > 0) {
            if (this.selectedButtonIndex == null) {
                this.selectedButtonIndex = 0
            }
            else {
                this.buttons[this.selectedButtonIndex].classList.remove('selected-button')
                increment %= this.buttons.length
                if (increment < 0) {
                    this.selectedButtonIndex = (this.selectedButtonIndex + increment + this.buttons.length) % this.buttons.length
                }
                else {
                    this.selectedButtonIndex = (this.selectedButtonIndex + increment) % this.buttons.length
                }
            }
            this.buttons[this.selectedButtonIndex].classList.add('selected-button')
        }
    }

    previousButton = () => {
        this.nextButton(-1)
    }

    pressSelectedButton = () => {
        if (this.selectedButtonIndex != null) {
            this.buttons[this.selectedButtonIndex].classList.remove('selected-button')
            this.buttons[this.selectedButtonIndex].click()
        }
    }

    goBack = () => {
        if (this.screenStack.length > 0) {
            this.currentScreen = this.screenStack.pop()
            this.transitionToScreen(this.currentScreen)
        }
        else {
            this.showScreen(this.defaultScreen)
        }
    }

    restart = () => {
        this.screenStack = []
        this.currentScreen = this.defaultScreen
        this.showScreen(this.defaultScreen)
    }
}
