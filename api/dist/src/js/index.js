var $ = require("jquery");
var template = require("template");
var IndexUtil = require("util/index.util.js");
var request = require("lib/request.js");
var token = $.cookie("token");
var config = require("util/config.js");
var util = require('util/util.js');
require("lib/jquery.form.js");
var olarRouter = config.olarRouter;
var baseUrl = config.baseUrl;
var local = require('util/message.js').ch;
window.userInfo = $.cookie("userInfo") ? JSON.parse($.cookie("userInfo")) : {};
// 国际化保留
// var langUtil = require('util/lang.utl.js');
// 判断是否有权限， 为1则有权限，不为1就没有权限
window.hasAuth = parseInt($.cookie("userType")) === 1;
window.oralCurrentIndex = 1;
$.support.cors = true;

// 程序入口
$(function () {
  // 图片预加载
  util.preloadimages(['../images/mistake.png']);
  // loadding
  $('.loadding-mask').on('click', function (e) {
    util.cancelBubble(e);
    return false;
  })
  /**设置用户信息 */
  $(".department").text(userInfo.centerName);
  $(".user").text(userInfo.employeesName);
  $(".user-id").text(userInfo.employeesNo);

  // 功能初始化
  IndexUtil.init(template);
  // 导航切换
  IndexUtil.navContentChange();
  /**显示文件路径 */
  function showFilePath () {
    var $inputText = $('#input-text');
    var $inputFile = $('#input-file');
    $inputFile.on('change', function (e) {
      if (e.target.value) {
        var filePathArr = e.target.value.split('\\');
        var fileName = filePathArr[filePathArr.length - 1];
        $inputText.css('color', '#000');
        $inputText.val(fileName);
      } else {
        $inputText.css('color', '#999');
        $inputText.val(local.importPlace);
      }
    })
  }
  // 导入弹框
  $(".oral-manage-container .import-name").on("click", function () {
    IndexUtil.getCenterInfo(function (data) {
      $("#mask").html(
        template($("#alert-component").html(), {
          showContentType: 2,
          showDefaultAlert: false,
          title: local.importNoun,
          hide: oralCurrentIndex === 2 ? "" : "hide",
          list: data
        })
      );
      showFilePath();
      $(".import-content .text").text(local.pleaseSelect);
      var centerNo = null;
      IndexUtil.selectAddEvent("import-content", function (index) {
        centerNo = data[index].centerNo;
      });
      IndexUtil.clickButton(
        function () {
          if (oralCurrentIndex === 1) {
            importFile({
              url: baseUrl + olarRouter.person.importFile
            });
          } else if (oralCurrentIndex === 2) {
            if (!centerNo) {
              request.myAlert(local.selectDepartMent);
              return;
            }
            importFile({
              url: baseUrl + olarRouter.other.importFile,
              centerNo: centerNo
            });
          } else {
            importFile({
              url: baseUrl + olarRouter.other.importFile
            });
          }
        },
        function () { }
      );
    });
  });
  // 导出弹框
  $(".oral-manage-container .export-name").on("click", function () {
    if (!navigator.onLine) {
      request.myAlert(local.disNetword);
      return
    }
    var centerNo = $(".select-specialty .center-no").text();
    if (!centerNo && oralCurrentIndex === 2) {
      request.myAlert(local.pleaseSelectAndExport);
      return;
    }
    $("#mask").html(
      template($("#alert-component").html(), {
        showDefaultAlert: true,
        type: "warn",
        tipMsg: local.sureToExport
      })
    );
    IndexUtil.clickButton(
      function () {
        if (oralCurrentIndex === 1) {
          exportOral(olarRouter.person.exportFile);
        } else if (oralCurrentIndex === 2) {
          exportOral(olarRouter.other.exportFile, centerNo);
        } else {
          exportOral(olarRouter.other.exportFile);
        }
      },
      function () { }
    );
  });
  /**兼容ie9 错误后设置文本颜色为#999 */
  function fn () {
    var $inputText = $('#input-text');
    if ($inputText.val() === local.importPlace) {
      $inputText.css('color', '#999');
    }
  }
  /**设置语言 */
  // langUtil.setLang('en')
  /**
   * 上传文件
   * options   olarRouter.other.importFile
   *
  /**导入文件 */
  function importFile (options) {
    // 添加断网监听
    $(window).off('offline');
    $(window).on('offline', function () {
      $('.loadding-mask').hide();
      // 断网取消掉请求
      $("#fileForm").data('jqxhr').abort();
      request.myAlert(local.disNetword);
    })
    if (!$("#input-file").val()) {
      request.myAlert(local.pleaseSelectFile);
      return;
    }
    // // 断网提示
    if (!navigator.onLine) {
      request.myAlert(local.disNetword);
      return
    }
    // 0kb 检测， 解决ie 10导入的问题
    if (util.isIe(10) && $('#input-file')[0].files[0].size === 0) {
      request.myAlert(local.pleaseImportFull);
      return
    }
    // 显示loadding
    $('.loadding-mask').show();
    var params = {
      url: options.url,
      data: {
        type: oralCurrentIndex,
        centerNo: options.centerNo,
        token: token
      },
      success: function (result) {
        // 隐藏loadding
        $('.loadding-mask').hide();
        // 判断是否是ie9
        if (util.isIeBrowser()) {
          try {
            var res = JSON.parse(result);
          } catch (e) {
            if (e) {
              if (!navigator.onLine) {
                request.myAlert(local.disNetword, fn);
              } else {
                request.myAlert(local.importFail, fn);
              }
            }
          }
          if (res && $.isEmptyObject(res)) {
            $(".mask").hide();
            IndexUtil.refreshTable();
          } else if (res && res.errorMsg) {
            request.myAlert(res.errorMsg, fn);
          }
          // 其他浏览器
        } else {
          $(".mask").hide();
          IndexUtil.refreshTable();
        }
      },
      error: function (err) {
        // 隐藏loadding
        $('.loadding-mask').hide();
        try {
          request.myAlert(JSON.parse(err.responseText).errorMsg);
        } catch (error) {
          if (error) {
            if (!navigator.onLine) {
              request.myAlert(local.disNetword, fn);
            } else {
              if (err.status === 413) {
                request.myAlert(local.importFileToLimit, fn)
              } else {
                request.myAlert(local.serveFail, fn);
              }
            }
          }
        }
      },
      complete: function () {
        $(window).off('offline');
      },
      resetForm: true
    };
    $("#fileForm").ajaxSubmit(params);
  }

  /**导出文件 */
  function exportOral (url, centerNo) {
    request.post(
      url, {
      type: oralCurrentIndex,
      centerNo: centerNo
    },
      function (data) {
        $(".mask").hide();
        if (util.isIE()) {
          window.open(baseUrl + data);
        } else {
          location.href = baseUrl + data;
        }
      }
    );
  }
});