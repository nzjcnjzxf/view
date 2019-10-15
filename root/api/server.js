const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

app.get('/', (req, res) => {
    res.json({
        a: 1,
        b: 2
    })
})
app.get('/test', (req, res) => {
    res.json({
        a: 'test',
        b: 2,
    })
})
app.post('/', (req, res) => {
    res.send('send post request！')
})
app.post('/test', (req, res) => {
    res.json({
        req,
        res
    })
})

app.listen(9000, '0.0.0.0')
