class Game {
    constructor() {
        this.assets = {}
        this.screens = {}
        this.defaultControls = {
            'Fire': ' ',
            'Move Left': 'ArrowLeft',
            'Move Right': 'ArrowRight'
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
                assetEntry.onComplete(asset)
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

const assetsList = []
const scriptList = [
    {
        scripts: [
            'components/storageController',
            'components/inputHandler',
            'components/controller',
            'screens/screen',
            'screens/main-menu',
            'screens/controls-screen',
            'screens/high-scores',
            'screens/about',
            'gameLoop'
        ],
        message: 'Main menu loaded',
        onComplete: () => {
            game.storageController = new StorageController('gamedev-galaga')
            game.inputHandler = new InputHandler()
            game.controller = new Controller(game.screens, game.inputHandler, 'main-menu')
            game.gameLoop = new GameLoop(game.controller, game.inputHandler, game.defaultControls)

            game.screens['main-menu'] = new MainMenu(game.controller, game.inputHandler)
            game.screens['controls'] = new ControlsScreen(game.controller,game.inputHandler, game.defaultControls)
            game.screens['high-scores'] = new HighScores(game.controller, game.storageController)
            game.screens['about'] = new About(game.controller)
            game.controller.init()
        }
    }
]



const loader = new Loader(game, assetsList, scriptList)
loader.loadAll()
