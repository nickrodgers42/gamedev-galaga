class About extends Screen {
    constructor(controller, gameStyle) {
        super(controller)
        this.gameStyle = gameStyle
    }
    
    init = () => {
        this.addButton('about-back', this.controller.goBack)
    }

    toggleGameStyle = () => {
        if (this.gameStyle['Style'] == 'GameDev') {
            this.gameStyle['Style'] = 'Retro'
        }
        else {
            this.gameStyle['Style'] = 'GameDev'
        }
        this.updateButtons()
    }

    updateButtons = () => {
        const gameStyleDiv = document.getElementById('game-style-div')
        const innerHTML = `
            <div>
                <div>
                    <p>Style</p>
                </div>
                <div>
                    <button
                        class="control-button"
                        id="game-style-button"
                    >
                        ${this.gameStyle['Style']}
                    </button>
                </div>
            </div>
        `
        gameStyleDiv.innerHTML = innerHTML
        this.buttons = []
        this.addButton('game-style-button', this.toggleGameStyle)
        this.addButton('about-back', this.controller.goBack)
        this.controller.buttons = this.buttons
    }

    run = () => {
        this.updateButtons()
    }
}
