const crypto = require('crypto')
const SECRET_KEY = '@fkdjkf'

function md5 (content) {
    const md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')
}

function genPassword (password) {
    return md5(`password = ${password};<>${SECRET_KEY}`)
}


module.exports = {
    genPassword
}


