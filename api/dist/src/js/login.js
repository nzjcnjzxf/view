var $ = require("jquery");
require('lib/jquery.cookie.js');
var request = require('request');
var userRouter = require('util/config.js').userRouter;
var util = require('util/util.js');
var local = require('util/message.js').ch;
$.support.cors = true;

$(function () {
    /**为ie9以下浏览器设置placehoder */
    util.setPlaceHolder('input-user', local.inputUser);
    util.setPlaceHolder('input-pwd', local.inputPwd);
    // 图片预加载
    util.preloadimages(['../images/mistake.png']);
    var $userName = $('.login-container .input-user');
    var $password = $('.login-container .input-pwd');
    $('.login-container .clear-btn-user').on('click', function () {
        $userName.val('');
    })
    $('.login-container .clear-btn-pwd').on('click', function () {
        $password.val('');
    })
    $('.login-btn').on('click', function () {
        var userName = $userName.val();
        var passWord = $password.val();
        if (!userName) {
            request.myAlert(local.userNameEmpty);
            return
        }
        request.post(userRouter.register, {
            username: userName
        }, function (data) {
            $.cookie('token', data.token);
            $.cookie('userType', data.userType);
            $.cookie('centerNo', data.centerNo);
            $.cookie('userInfo', JSON.stringify(data));
            location.href = '../app/index.html';
        })
    })
})