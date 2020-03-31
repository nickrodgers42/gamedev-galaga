class Screen {
    constructor(controller) {
        this.controller = controller
        this.buttons = []
    }

    addButton = (buttonId, eventListener) => {
        const button = document.getElementById(buttonId)
        button.addEventListener('click', eventListener)
        this.buttons.push(button)
    }
}
