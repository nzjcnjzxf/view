const http = require('http')

const slice = Array.prototype.slice


class Express {
    constructor() {
        this.routes = {
            all: [],
            post: [],
            get: []
        }
    }
    register (path) {
        const info = {}
        if (typeof path === 'string') {
            info.path = path
            info.stack = slice.call(arguments, 1)
        } else {
            info.path = '/'
            info.stack = slice.call(arguments, 0)
        }
        return info
    }
    use () {

    }
    get () {

    }
    post () {

    }
    match () {

    }
    handle () {

    }
    callback () {

    }
    listen (...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }

}