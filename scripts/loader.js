class Game {
    constructor() {
        this.assets = {}
        this.screens = {}
        this.defaultControls = {
            'Fire': ' ',
            'Move Left': 'ArrowLeft',
            'Move Right': 'ArrowRight',
            'Pause': 'Escape'
        }
        this.gameStyle = {
            'Style': 'Retro'
        }
        this.init = () => {
            this.storageController = new StorageController('gamedev-galaga')
            this.inputHandler = new InputHandler()
            this.controller = new Controller(this.screens, this.inputHandler, 'main-menu')
            this.gameLoop = new GameLoop(
                this.controller, 
                this.inputHandler, 
                this.defaultControls, 
                this.gameStyle, 
                this.assets,
                this.storageController
            )

            this.screens['main-menu'] = new MainMenu(this.controller, this.inputHandler)
            this.screens['controls'] = new ControlsScreen(this.controller,this.inputHandler, this.defaultControls)
            this.screens['high-scores'] = new HighScores(this.controller, this.storageController)
            this.screens['about'] = new About(this.controller, this.gameStyle)
            this.screens['game-screen'] = new GameScreen(this.controller, this.inputHandler, this.gameLoop, this.defaultControls)
            this.screens['pause-screen'] = new PauseScreen(this.controller, this.inputHandler, this.gameLoop)
            this.screens['game-over'] = new GameOver(this.controller, this.storageController)
            this.controller.init()
        }
    }
}

class Loader {
    constructor(game, assets, scripts) {
        this.game = game
        this.assets = assets
        this.scripts = scripts
    }

    loadAll = () => {
        console.log('Loading Assets...')
        this.loadAssets(
            this.assets,
            (source, asset) => {
                this.game.assets[source.key] = asset
            },
            error => console.error(error),
            () => {
                console.log('Game assets loaded.')
                console.log('Loading Scripts...')
                this.loadScripts(
                    this.scripts,
                    () => {
                        console.log('Scripts loaded.')
                        this.game.init()
                        this.game.loaded = true
                    }
                )
            }
        )
    }

    loadScripts = (scripts, onComplete) => {
        if (scripts.length <= 0) {
            onComplete()
            return
        }
        const entry = scripts[0]
        require(entry.scripts, () => {
            console.log(entry.message)
            if (entry.onComplete) {
                entry.onComplete()
            }
            scripts.shift()
            this.loadScripts(scripts, onComplete)
        })
    }

    loadAssets = (assets, onSuccess, onError, onComplete) => {
        if (assets.length <= 0) {
            onComplete()
            return
        }
        const assetEntry = assets[0]
        this.loadAsset(
            assetEntry.source,
            (asset) => {
                onSuccess(assetEntry, asset)
                assets.shift()
                this.loadAssets(assets, onSuccess, onError, onComplete)
            },
            (error) => {
                onError(error)
                assets.shift()
                this.loadAssets(assets, onSuccess, onError, onComplete)
            }
        )
    }

    loadAsset = (source, onSuccess, onError) => {
        const xhr = new XMLHttpRequest()
        const fileExtension = source.substr(source.lastIndexOf('.') + 1)

        if (fileExtension) {
            xhr.open('GET', source, true)
            xhr.responseType = 'blob'

            xhr.onload = () => {
                let asset = null
                if (xhr.status === 200) {
                    if (fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'gif') {
                        asset = new Image()
                    }
                    else if (fileExtension === 'mp3') {
                        asset = new Audio()
                    }
                    else {
                        if (onError) {
                            onError(`Unknown file extension ${fileExtension}`)
                        }
                    }
                    asset.onload = () => {
                        window.URL.revokeObjectURL(asset.src)
                    }
                    asset.src = window.URL.createObjectURL(xhr.response)
                    if (onSuccess) {
                        onSuccess(asset)
                    }
                }
                else {
                    if (onError) {
                        onError(`Failed to retrieve ${source}`)
                    }
                }
            }
        }
        else {
            if (onError) {
                onError(`Unknown file extension ${fileExtension}`)
            }
        }
        xhr.send()
    }
}

const game = new Game()

const assetsList = [
    {
        key: 'ship',
        source: '../assets/images/ship.png',
    },
    {
        key: 'life',
        source: '../assets/images/life.png'
    },
    {
        key: 'player-missile',
        source: '../assets/images/player-missile.png'
    },
    {
        key: 'enemy-missilee',
        source: '../assets/images/enemy-missile.png'
    },
    {
        key: 'shoot',
        source: '../assets/audio/shoot.mp3'
    },
    {
        key: 'bee',
        source: '../assets/images/bee.png'
    },
    {
        key: 'butterfly',
        source: '../assets/images/butterfly.png'
    },
    {
        key: 'theme-song',
        source: '../assets/audio/theme-song.mp3'
    },
    {
        key: 'level-start',
        source: '../assets/audio/level-start.mp3'
    }
]

const indicators = [1, 5, 10, 20, 30, 50]
for (let i = 0; i < indicators.length; ++i) {
    assetsList.push({
        key: `indicator-${indicators[i]}`,
        source: `../assets/images/indicator-${indicators[i]}.png`
    })
}

const scriptList = [
    {
        scripts: [
            'components/storageController',
            'components/inputHandler',
            'components/controller',
            'screens/screen'
        ],
        message: 'Initial Components Loaded',
        onComplete: null
    },
    {
        scripts: [
            'screens/main-menu',
            'screens/controls-screen',
            'screens/high-scores',
            'screens/about',
            'gameLoop'
        ],
        message: 'Main menu loaded',
        onComplete: null
    },
    {
        scripts: [
            'galaga',
            'screens/game-screen',
            'screens/game-over',
            'screens/pause-screen',
            'components/particle',
            'components/particleSystem',
            'components/point2d',
            'components/random',
            'components/player',
            'components/stars',
            'components/missileSystem',
            'components/missile',
            'components/sprite',
            'components/spline',
            'components/enemies/enemySystem',
            'components/enemies/enemyPathMaker',
            'components/enemies/enemy',
            'components/enemies/enemyGrid'
        ],
        message: 'First set of components loaded',
        onComplete: null
    }, 
    {
        scripts: [
            'components/animatedSprite',
            'components/enemies/bee',
            'components/enemies/butterfly'
        ],
        message: 'Game Loaded',
        onComplete: null
    }
]



const loader = new Loader(game, assetsList, scriptList)
loader.loadAll()
