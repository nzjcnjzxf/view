const http = require('http')

function compose (middleWareList) {
    return function (ctx) {
        function dispatch (i) {
            const middleWare = middleWareList[i]
            try {
                return Promise.resolve(middleWare(ctx, dispatch.bind(null, i + 1)))
            } catch (e) {
                return Promise.reject(e)
            }
        }
        return dispatch(0)
    }
}
class Koa2 {
    constructor() {
        this.middlewareList = []
    }
    use (fn) {
        this.middlewareList.push(fn)
        return this
    }
    createContext (req, res) {
        return {
            req,
            res
        }
    }
    handleRequest (ctx, middleWare) {
        return middleWare(ctx)
    }

    callback () {
        const fn = compose(this.middlewareList)
        return (req, res) => {
            const ctx = this.createContext(req, res)
            return this.handleRequest(ctx, fn)
        }
    }

    listen (...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

module.exports = Koa2