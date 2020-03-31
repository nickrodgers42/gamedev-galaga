class Galaga {
    constructor(assets, gameStyle) {
        this.level = 1
        this.assets = assets
        this.gameStyle = gameStyle
        this.canvas = document.getElementById('game-canvas')
        this.context = this.canvas.getContext('2d')
        this.ship = new Ship(assets['ship'])
        this.stars = (this.gameStyle['Style'] == 'GameDev') ? null : new Stars(100, this.canvas.width, this.canvas.height)
    }

    play = () => {}
    pause = () => {}

    update = (elapsedTime) => {
        if (this.gameStyle['Style'] !== 'GameDev') {
            this.stars.update(elapsedTime)
        }
    }

    render = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        if (this.gameStyle['Style'] !== 'GameDev') {
            this.stars.render(this.context)
        }
    }

    shipMoveLeft = (elapsedTime) => {
        this.ship.moveLeft(elapsedTime)
    }

    shipMoveRight = (elapsedTime) => {
        this.ship.moveRight(elapsedTime)
    }

    shipFire = (elapsedTime) => {
        this.ship.fire(elapsedTime)
    }
}
