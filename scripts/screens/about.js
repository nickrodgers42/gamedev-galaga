class About extends Screen {
    constructor(controller) {
        super(controller)
    }
    
    init = () => {
        this.addButton('about-back', this.controller.goBack)
    }

    run = () => {
        this.controller.buttons = this.buttons
    }
}
