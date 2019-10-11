const { exec, escape } = require('../db/mysql.js')
const { genPassword } = require('../utils/cryp.js')

const login = (username, password) => {
    const sql = `
        select username, realname from users where username=${username} and password = ${escape(genPassword(password))}
    `
    return exec(sql).then(rows => {
        return rows[0] || {}
    })
}

module.exports = {
    login
}