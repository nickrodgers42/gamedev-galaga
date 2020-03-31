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
            'Style': 'GameDev'
        }
        this.init = () => {
            this.storageController = new StorageController('gamedev-galaga')
            this.inputHandler = new InputHandler()
            this.controller = new Controller(this.screens, this.inputHandler, 'main-menu')
            this.gameLoop = new GameLoop(this.controller, this.inputHandler, this.defaultControls, this.gameStyle, this.assets)

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
                    if (fileExtension === 'png' || fileExtension === 'jpg') {
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
    }
]
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
            'components/ship',
            'components/player',
            'components/stars'
        ],
        message: 'Game Loaded',
        onComplete: null
    }
]



const loader = new Loader(game, assetsList, scriptList)
loader.loadAll()
