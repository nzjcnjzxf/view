const http = require('http')

const slice = Array.prototype.slice

class Express {

    constructor() {
        this.routes = {
            all: [],
            get: [],
            post: []
        }
    }

    register(path) {
        const info = {}
        if (typeof path === 'string') {
            info.path = path
            info.stack = slice.call(arguments, 1)
        } else {
            info.path = '/'
            info.stack = slice.call(arguments, 0)
        }
    }

    use() {
        const info = this.register.apply(this, arguments)
        this.routes.all.push(info)
    }

    get() {
        const info = this.register.apply(this, arguments)
        this.routes.get.push(info)
    }
    post() {
        const info = this.register.apply(this, arguments)
        this.routes.post.push(info)
    }
    match(url, method) {
        const stack = []
        if (url === '/favion.ico') {
            return stack
        }
        const curRoutes = []
        curRoutes = this.routes.all.concat(this.routes[method])
        curRoutes.forEach(info => {
            if (info.path.indexOf(url) === 0) {
                stack.push(...info.stack)
            }
        })
        return stack
    }
    handle(req, res, stack) {
        const next = () => {
            const middleWare = stack.shift()
            if (middleWare) {
                middleWare(req, res, next)
            }
        }
        next()
    }

    callback() {
        return (req, res) => {
            res.json = (data) => {
                res.setHeader('Content-type', 'application/json')
                res.end(
                    JSON.stringify(data)
                )
                const url = req.url
                const method = req.method.toLowerCase()
                const resultList = this.match(url, method)
                this.handle(req, res, resultList)
            }
        }
    }
    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}