var $ = require('jquery');
require('lib/jquery.cookie.js');
var template = require('template');
var config = require('util/config.js');
var baseUrl = config.baseUrl;
var olarRouter = config.olarRouter;
var token = $.cookie('token');
var local = require('util/message.js').ch;
var needLoadding = [olarRouter.person.queryPage, olarRouter.other.queryPage, olarRouter.person.exportFile, olarRouter.other.exportFile];
// ie请求不到数据添加 
function myAlert (tipMsg, cb) {
  $("#mask-alert").html(
    template($("#error-alert").html(), {
      tipMsg: tipMsg,
    })
  );
  $("#mask-alert .sure-btn").on("click", function () {
    $('#mask-alert .mask').hide();
    cb && cb();
  });
}

function handleError (xhr, status, err, error) {
  try {
    var errObj = JSON.parse(xhr.responseText)
    if (errObj.errorCode === 4021) {
      location.href = '../app/login.html';
    } else {
      myAlert(errObj.errorMsg);
    }
    if (error) {
      error(xhr, status, err);
    }
  } catch (e) {
    if (!navigator.onLine) {
      myAlert(local.disNetword);
    } else {
      myAlert(local.serveFail)
    }
    throw local.backMistake
  }
}

function RequestPost (route, dataObj, success, error) {
  if (!navigator.onLine) {
    myAlert(local.disNetword);
    return
  }
  var loadding = $.inArray(route, needLoadding);
  if (loadding !== -1) {
    $('.loadding-mask').show();
  }
  $.ajax({
    type: "post",
    headers: {
      token: token
    },
    contentType: "application/json;charset=utf-8",
    url: baseUrl + route,
    dataType: "json",
    cache: false,
    data: JSON.stringify(dataObj),
    success: function (result) {
      $('.loadding-mask').hide();
      success(result)
    },
    error: function (xhr, status, err) {
      $('.loadding-mask').hide();
      handleError(xhr, status, err, error);
    }
  });
}

function RequestDelete (route, dataObj, success, error) {
  if (!navigator.onLine) {
    myAlert(local.disNetword);
    return
  }
  $.ajax({
    type: "delete",
    headers: {
      token: token
    },
    contentType: "application/json;charset=utf-8",
    url: baseUrl + route,
    dataType: "json",
    cache: false,
    data: JSON.stringify(dataObj),
    success: function (result) {
      success(result)
    },
    error: function (xhr, status, err) {
      handleError(xhr, status, err, error);
    }
  });
}

function RequestPut (route, dataObj, success, error) {
  if (!navigator.onLine) {
    myAlert(local.disNetword);
    return
  }
  $.ajax({
    type: "put",
    headers: {
      token: token
    },
    contentType: "application/json;charset=utf-8",
    url: baseUrl + route,
    dataType: "json",
    cache: false,
    data: JSON.stringify(dataObj),
    success: function (result) {
      success(result)
    },
    error: function (xhr, status, err) {
      $('.loadding-mask').hide();
      handleError(xhr, status, err, error);
    }
  });
}

module.exports = {
  post: RequestPost,
  delete: RequestDelete,
  put: RequestPut,
  myAlert: myAlert
};