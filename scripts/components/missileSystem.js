class MissileSystem {
    constructor(game) {
        this.game = game
        this.playerMissiles = []
        this.enemyMissiles = []
        this.shotsFired = 0
        this.shotsHit = 0
    }

    get numPlayerMissiles() {
        return this.playerMissiles.length
    }

    firePlayerMissile = (position) => {
        this.playerMissiles.push(new Missile(
            this.game.assets['player-missile'],
            position.copy(),
            this.game.canvas.width,
            this.game.canvas.height
        ))
        this.shotsFired += 1
    }

    fireEnemyMissile = (position) => {
        this.enemyMissiles.push(new EnemyMissile(
            this.game.assets['enemy-missile'],
            position.copy(),
            this.game.canvas.width,
            this.game.canvas.height,
            this.game.player.position
        ))
    }

    updateMissiles = (elapsedTime, missiles) => {
        const keepMissiles = []
        for (let i = 0; i < missiles.length; ++i) {
            missiles[i].update(elapsedTime)
            if (missiles[i].onScreen && !missiles[i].detonated) {
                keepMissiles.push(missiles[i])
            }
        }
        return keepMissiles
    }

    update = (elapsedTime) => {
        this.playerMissiles = this.updateMissiles(elapsedTime, this.playerMissiles)
        this.enemyMissiles = this.updateMissiles(elapsedTime, this.enemyMissiles)
    }

    renderMissiles = (context, missiles) => {
        for (let i = 0; i < missiles.length; ++i) {
            missiles[i].render(context)
        }
    }

    render = (context) => {
        this.renderMissiles(context, this.playerMissiles)
        this.renderMissiles(context, this.enemyMissiles)
    }
}
