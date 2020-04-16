class StorageController {
    constructor(storageName) {
        this.name = storageName
        this.data = {}
        const storedData = localStorage.getItem(this.name)
        if (storedData) {
            this.data = JSON.parse(storedData)
        }
    }

    add = (key, value) => {
        if (this.data.hasOwnProperty(key) && Array.isArray(this.data[key])) {
            this.data[key].push(value)
        }
        else {
            this.data[key] = [value]
        }
        localStorage[this.name] = JSON.stringify(this.data)
    }

    set = (key, value) =>  {
        if (Array.isArray(value)) {
            this.data[key] = value
        }
        else {
            this.data[key] = [value]
        }
        localStorage[this.name] = JSON.stringify(this.data)
    }

    remove = (key) => {
        delete this.data[key]
        localStorage[this.name] = JSON.stringify(this.data)
    }

    list = () => {
        return this.data
    }

    clear = () => {
        this.data = {}
        localStorage[this.name] = JSON.stringify(this.data)
    }

    get = (key) => {
        if (this.data.hasOwnProperty(key)) {
            return this.data[key]
        }
        return []
    }
}
