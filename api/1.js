const express = require('express')
const cors = require('cors')
const app = express();

app.use(cors())

app.get('/test', function (req, res) {
    res.send('123')
})
app.post('/test', function (req, res) {
    res.send('test post 123')
})

app.listen(3000)

console.log('sever run at http://localhost:3000')
