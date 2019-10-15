const { SuccessModel, ErrorModel } = require('../model/resModel.js')
const { login } = require('../controller/user.js')
const { set, get } = require('../db/redis.js')

const handleUserRouter = (req, res) => {
    const GET = req.method === 'GET'
    const POST = req.method === 'POST'

    if (POST && req.path === '/api/user/login') {
        const { username, password } = req.body

        const result = login(username, password)
        return result.then(row => {
            if (row.username) {
                req.session.username = row.username
                req.session.realname = row.realname
                set(req.sessionId, req.session)
                return new SuccessModel('登录成功')
            } else {
                return new ErrorModel('登录失败')
            }
        })
    }
}

module.exports = handleUserRouter