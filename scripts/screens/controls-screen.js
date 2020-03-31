class ControlsScreen extends Screen {
    constructor(controller, inputHandler, controlMap) {
        super(controller)
        this.inputHandler = inputHandler
        this.controlMap = controlMap
        this.defaultControls = JSON.parse(JSON.stringify(this.controlMap))
        this.controlBeingMapped = null
        this.buttonIds = {}
    }
    
    goBack = () => {
        if (this.controlBeingMapped == null) {
            this.controller.goBack()
        }
        else {
            this.setControl(this.controlBeingMapped, this.defaultControls[this.controlBeingMapped])
        }
    }

    setControl = (control, key) => {
        const keyInUseIndex = Object.values(this.controlMap).indexOf(key)
        if (keyInUseIndex > -1) {
            const controlToChange = Object.keys(this.controlMap).find(control => this.controlMap[control] === key)
            this.controlMap[control] = key
            this.controlBeingMapped = null
            this.remapControl(controlToChange)
        }
        else {
            this.controlMap[control] = key
        }
        this.updateButtons()
    }

    resetControls = () => {
        if (this.controlBeingMapped == null) {
            for (const control in this.controlMap) {
                this.controlMap[control] = this.defaultControls[control]
            }
            this.controlBeingMapped = null
            this.updateButtons()
        }
    }

    init = () => {
        this.addButton('controls-back', this.controller.goBack)
        for (const control in this.controlMap) {
            const controlId = control.split(' ').join('-')
            this.buttonIds[control] = controlId
        }
    }

    remapControl = async (control) => {
        if (this.controlBeingMapped == null || this.controlBeingMapped == control) {
            this.controlBeingMapped = control
            this.controlMap[control] = 'Awaiting Input...'
            this.updateButtons()
            this.controller.selectedButtonIndex = null
            const key = await this.inputHandler.captureNextKeyPress()
            console.log(control, key, this.controlBeingMapped)
            this.setControl(control, key)
            this.controlBeingMapped = null
            this.updateButtons()
        }
    }

    updateButtons = () => {
        const assignControlsDiv = document.getElementById('assign-controls-div')
        let innerHTML = ``
        for (const control in this.controlMap) {
            innerHTML += `<div>
                <div><p>${control}</p></div>
                <div><button
                    class="control-button"
                    id="${this.buttonIds[control]}-remap-button"
                >
                    ${(this.controlMap[control] === ' ') ? 
                        'Space' : this.controlMap[control]}
                </button></div>
                </div>`
        }
        assignControlsDiv.innerHTML = innerHTML
        this.buttons = []
        for (const control in this.buttonIds) {
            const id = this.buttonIds[control]
            this.addButton(id + '-remap-button', () => this.remapControl(control))
        }
        this.addButton('controls-reset', this.resetControls)
        this.addButton('controls-back', this.controller.goBack)
        this.controller.buttons = this.buttons
    }

    run = () => {
        this.updateButtons()
    }
}
