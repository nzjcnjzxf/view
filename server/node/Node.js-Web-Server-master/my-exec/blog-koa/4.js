const http = require('http')

function compose(middleWareList) {
    return function (ctx) {
        function dispatch(i) {
            const middleWare = middleWareList[i]
            try {
                return Promise.resolve(
                    middleWare(ctx, dispatch.bind(null, i + 1))
                )
            } catch (error) {
                return Promise.reject(error)
            }
        }

        return dispatch(0)
    }
}

class Koa {
    constructor() {
        this.middleWareList = []
    }

    use(fn) {
        this.middleWareList.push(fn)
        return this
    }

    createContext(req, res) {
        return {
            req,
            res
        }
    }
    handleRequest(ctx, fn) {
        return fn(ctx)
    }
    callback() {
        const fn = compose(this.middleWareList)
        return (req, res) => {
            const ctx = this.createContext(req, res)
            return this.handleRequest(ctx, fn)
        }
    }

    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

module.exports = Koa