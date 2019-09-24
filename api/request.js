var http = require('http');
router.get('/post', function (req, res) {
    const postData = querystring.stringify({
        'msg': 'Hello World!'
    });
    var opt = {
        hostname: '127.0.0.1',
        path: '/~donghao/interf/a.php',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',// 不写这个参数，后台会接收不到数据
            'Content-Length': postData.length
        }
    }
    const request = http.request(opt, function (response) {
        console.log('STATUS:' + response.statusCode);
        console.log('HEADERS:' + JSON.stringify(response.headers));
        var renderData = ''
        response.setEncoding('utf8');
        response.on('data', function (body) {
            renderData += body;
        });
        response.on('end', function () {
            //请求结束
            console.log('end');
            res.render('index', JSON.parse(renderData));
        });
        response.on('error', function (e) {
            if (e) {
                console.log(e);
            }
        })
    });
    //post方法里
    request.on('error', function (e) {
        console.error('请求遇到问题:' + e.message);
    });
    request.write(postData, 'utf-8');
    request.end();
});