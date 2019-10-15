const handleBlogRouter = require('./src/router/blog.js')
const handleUserRouter = require('./src/router/user.js')
const querystring = require('querystring')
const { set, get } = require('./src/db/redis.js')
const { access } = require('./src/utils/log.js')

const SESSION_DATA = {}


const setCookieExpires = () => {
    const date = new Date()
    date.setTime(date.getTime() + (24 * 60 * 60 * 10000))
    return date.toGMTString()
}

const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }

        let postData = ''
        req.on('data', (chunk) => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
    return promise
}

const app = (req, res) => {
    access(
        `
            ${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}
        `
    )
    let url = req.url
    req.path = url.split('?')[0]
    res.setHeader('Content-type', 'application/json')
    req.query = querystring.parse(url.split('?')[1])
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })
    let userId = req.cookie.userId
    let needSetCookie = false
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        set(userId, {})
    }
    req.sesionId = userId
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            set(req.sessionId, {})
            req.session = {}
        } else {
            req.session = sessionData
        }
        return getPostData
    }).then(postData => {
        req.body = postData
        const BlogResult = handleBlogRouter(req, res)
        if (BlogResult) {
            BlogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId};path=/;httpOnly;expires=${setCookieExpires()};`)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId};path=/;httpOnly;expires=${setCookieExpires()};`)
                }
                res.end(
                    JSON.stringify(userData)
                )
            })
            return
        }
        res.writeHead(404, { 'Content-type': 'text/plain' })
        res.write('404 NOT Found\n')
        res.end()
    })
}
module.exports = app