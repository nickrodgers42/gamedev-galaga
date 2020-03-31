const http = require('http')
const path = require('path')
const fs = require('fs')
const mimeTypes = {
    '.js': 'text/javascript',
    '.html': 'text/html',
    '.css': 'text/css',
    '.png' : 'image/png',
    '.jpg' : 'image/jpeg',
    '.mp3' : 'audio/mpeg3',
    '.ico': 'image/x-icon',
    '.gif': 'image/gif'
}

const port = 3000

const handleRequest = (request, response) => {
    console.log('request: ', request.url)
    const lookup = (request.url === '/') ? '/index.html' : decodeURI(request.url)
    const file = lookup.substring(1)

    fs.exists(file, (exists) => {
        console.log(exists ? `Found ${lookup}` : `${lookup} does not exist`)
        if (exists) {
            fs.readFile(file, (error, data) => {
                if (error) {
                    response.writeHead('500')
                    response.end('Server Error')
                }
                else {
                    const headers = {
                        'Content-type': mimeTypes[path.extname(lookup)]
                    }
                    response.writeHead(200, headers)
                    response.end(data)
                }
            })
        }
        else {
            response.writeHead(404)
            response.end('Page not found')
        }
    })
}

http.createServer(handleRequest)
    .listen(port, () => {
        console.log(`Server is listening on port ${port}`)
    })
