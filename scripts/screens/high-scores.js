class HighScores extends Screen {
    constructor(controller, storageController) {
        super(controller)
        this.storageController = storageController
    }
    
    init = () => {
        this.addButton('clear-high-scores', () => {
            this.storageController.clear('martianLander-highscores')
            this.run()
        })
        this.addButton('high-scores-back', this.controller.goBack)
    }

    run = () => {
        const highScoresDiv = document.getElementById('high-scores-table')
        let innerHTML = `<table>
            <tr>
                <th>Place</th>
                <th>Name</th>
                <th>Score</th>
            </tr>`
        const highScores = this.storageController.get('scores')
        highScores.sort((a, b) => {
            if (a.score > b.score) {
                return -1
            }
            else if (b.score > a.score) {
                return 1
            }
            else if (a.name < b.name) {
                return 1
            }
            else if (b.name > a.name) {
                return -1
            }
            return 0
        })
        for (let i = 0; i < 10; ++i) {
            if (i < highScores.length) {
                innerHTML += `<tr><td>${i + 1}</td>
                    <td>${highScores[i].name}</td>
                    <td>${highScores[i].score}</td></tr>`
            }
            else {
                innerHTML += `<tr></tr>`
            }
        }
        innerHTML += '</table>'
        highScoresDiv.innerHTML = innerHTML
        this.controller.buttons = this.buttons
    }
}
