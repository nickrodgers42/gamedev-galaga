class GameOver extends Screen {
    constructor(controller, storageController) {
        super(controller)
        this.storageController = storageController
    }
    
    init = () => {
        this.addButton('score-save-button', this.saveScore)
    }

    saveScore = () => {
        const nameInput = document.getElementById('player-name-input')
        if (nameInput.value.trim() != '') {
            this.storageController.add('scores', {
                name: nameInput.value.trim(),
                score: this.controller.score.toFixed(2)
            })
            this.controller.showScreen('main-menu')
        }
    }

    run = () => {
        const scoreDiv = document.getElementById('player-score')
        scoreDiv.innerHTML = this.controller.score.toFixed(2)
        this.controller.registerMenuInputs()
        this.controller.buttons = this.buttons
    }
}
