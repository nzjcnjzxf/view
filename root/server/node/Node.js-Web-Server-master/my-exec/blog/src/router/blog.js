const { getList, getDetail, newBlog, updateBlog, deleteBlog } = require('../controller/blog.js')
const { SuccessModle, ErrorModel } = require('../model/resModel.js')

const checkLogin = (req) => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel('登录失败')
        )
    }
}

const handleBlogRouter = (req, res) => {
    const GET = req.method === 'GET'
    const POST = req.method === 'POST'
    const id = req.query.id || ''

    if (GET && req.path === '/api/blog/list') {
        let keyword = req.query.keyword || ''
        let author = req.query.author || ''
        if (req.query.isAdmin) {
            const checkLoginResult = checkLogin(req)
            if (checkLoginResult) {
                return checkLoginResult
            }
            author = req.session.username
        }
        const result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModel(listData)
        })
    }
    if (GET && req.path === '/api/blog/detail') {
        const detailResult = getDetail(id)
        return detailResult.then(detailData => {
            return new SuccessModle(detailData)
        })
    }

    if (POST && req.path === '/api/blog/new') {
        const checkLoginResult = checkLogin(req)
        if (checkLoginResult) {
            return checkLoginResult
        }
        req.body.author = req.session.username
        const result = newBlog(req.body)
        return result.then(newData => new SuccessModle(newData))
    }

    if (POST && req.path === '/api/blog/update') {
        const checkLoginResult = checkLogin(req)
        if (checkLoginResult) {
            return checkLoginResult
        }
        const result = updateBlog(id, req.body)
        return result.then(res => {
            if (res) {
                return new SuccessModle()
            } else {
                return new ErrorModel('更新博客失败')
            }
        })
    }

    if (POST && req.path === '/api/blog/del') {
        const checkLoginResult = checkLogin(req)
        if (checkLoginResult) {
            return checkLoginResult
        }
        const author = req.session.username
        const result = deleteBlog(id, author)
        return result.then(res => {
            if (res) {
                return new SuccessModle()
            } else {
                return new Error('删除博客失败')
            }
        })
    }
}

module.exports = handleBlogRouter