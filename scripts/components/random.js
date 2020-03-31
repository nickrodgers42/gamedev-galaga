class RandomClass {
    constructor() {
        this.usePrevious = false
        this.y2 = null
    }

    random = () => {
        return Math.random()
    }

    randFloat = (min, max) => {
        return Math.random() * (max - min) + min
    }

    randInt = (min, max) => {
        min = Math.ceil(min)
        max = Math.floor(max)
        const range = max - min
        return Math.floor((Math.random() * range) + min)
    }

    randIntInclusive = (min, max) => {
        min = Math.ceil(min)
        max = Math.floor(max)
        const range = max - min + 1
        return Math.floor((Math.random() * range) + min)
    }

    randCircleVector = () => {
        const angle = Math.random() * 2 * Math.PI
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
    }

    randCircleVectorInRange = (min, max) => {
        const angle = this.randFloat(min, max)
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
    }   

    randGaussian = (mean, stdDev) => {
        let x1 = 0
        let x2 = 0
        let y1 = 0
        let z = 0

        if (this.usePrevious) {
            this.usePrevious = false
            return mean + this.y2 * stdDev
        }

        this.usePrevious = true

        x1 = 2 * Math.random() - 1
        x2 = 2 * Math.random() - 1
        z = (x1 * x1) + (x2 * x2)
        while (z >= 1) {
            x1 = 2 * Math.random() - 1
            x2 = 2 * Math.random() - 1
            z = (x1 * x1) + (x2 * x2)
        }

        z = Math.sqrt((-2 * Math.log(z)) / z)
        y1 = x1 * z
        this.y2 = x2 * z

        return mean + y1 * stdDev
    }
}

const Random = new RandomClass()
