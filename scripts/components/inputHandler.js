class InputHandler {
    constructor() {
        this.keys = {}
        this.handlers = {}
        this.releasedKeys = {}
        this.releaseHandlers = {}
        window.addEventListener('keydown', this.keyPress)
        window.addEventListener('keyup', this.keyRelease)
    }

    registerCommand = (key, handler, singlePress=false) => {
        if (singlePress) {
            this.handlers[key] = (elapsedTime) => {
                handler(elapsedTime)
                delete this.keys[key]
            }
        }
        else {
            this.handlers[key] = handler
        }
    }

    registerKeyReleaseCommand = (key, handler) => {
        this.releaseHandlers[key] = handler
    }

    unregisterCommand = (key) => {
        delete this.handlers[key]
    }

    unregisterAllCommands = () => {
        this.handlers = {}
    }

    captureNextKeyPress = () => {
        return new Promise(resolve => {
            window.addEventListener('keydown', (event) => {
                resolve(event.key)
            }, {once: true})        
        })
    }

    keyPress = (event) => {
        this.keys[event.key] = event.timeStamp
    }

    keyRelease = (event) => {
        this.releasedKeys[event.key] = event.timeStamp
        delete this.keys[event.key]
    }

    update = (elapsedTime) => {
        for (const key in this.keys) {
            if (this.handlers[key]) {
                this.handlers[key](elapsedTime)
            }
        }
        for (const key in this.releasedKeys) {
            if (this.releaseHandlers[key]) {
                this.releaseHandlers[key]()
            }
            delete this.releasedKeys[key]
        }
    }
}
