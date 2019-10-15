const express = require('express')
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser');
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/test', function (req, res) {
    res.send('123')
})
app.post('/test', function (req, res) {
    res.json(req.body)
})
app.delete('/test', function (req, res) {
    res.json(req.body)
})
app.put('/test', function (req, res) {
    res.json(req.body)
})

app.listen(8000, '0.0.0.0')

console.log('sever run at http://localhost:8000')
