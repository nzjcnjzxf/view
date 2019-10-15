var request = require("request");
var config = require("util/config.js");
var pagination = require("lib/pagination.js");
var util = require('util/util.js');
var local = require('util/message.js').ch;
var olarRouter = config.olarRouter;
var codeRouter = config.codeRouter;
var smartRouter = config.smartRouter;
var userRouter = config.userRouter;
var currentOlarRouter = olarRouter.person;
var typeInput = util.typeInput;
module.exports = (function ($) {
  /**模板变量 */
  var template = null;
  /**编辑的时候搜索名词id数组 */
  var wordIds = null;
  // 表格每页显示的数量
  var pageSize = 10;
  var oralCurrentPage = 1;
  /**口语名词新增编辑时显示的全局num */
  var oralAddNum = 1;
  /**退出登录 */
  function onQuitIcon () {
    $(".tc-icon").on("click", function () {
      $("#mask").html(
        template($("#alert-component").html(), {
          showDefaultAlert: true,
          type: "warn",
          tipMsg: local.sureToLogout
        })
      );
      clickButton(
        function () {
          location.href = "../app/login.html";
        },
        function () { }
      );
    });
  }
  /** 权限判断 */
  function checkAuth () {
    if (!hasAuth) {
      var $items = $(".admin-container .nav-item");
      var $contents = $(".admin-container .manage-content");
      $items
        .removeClass("active")
        .eq(1)
        .addClass("active");
      $contents
        .hide()
        .eq(1)
        .show();
      $(".sub-nav-item")
        .eq(0)
        .css("marginRight", 0);
      $(".no-auth").hide();
      showPersonTable();
    } else {
      showRoleSelect();
    }
  }
  /**内容高度设置 */
  function setContentHeight () {
    $(".admin-content").css("height", $(document.body).height() - 53);
    $(window).resize(function () {
      $(".admin-content").css("height", $(document.body).height() - 53);
    });
  }
  /** 菜单大小显示切换*/
  function navChange () {
    var $container = $(".admin-container");
    $(".menu-icon").on("click", function () {
      var isShow = $container.hasClass("admin-container-mini");
      if (!isShow) {
        $container.addClass("admin-container-mini");
      } else {
        $container.removeClass("admin-container-mini");
      }
    });
  }

  /**菜单内容切换 */
  function navContentChange () {
    var $items = $(".admin-container .nav-item");
    var $contents = $(".admin-container .manage-content");
    $items.on("click", function () {
      var $index = $(this).index();
      $items
        .removeClass("active")
        .eq($index)
        .addClass("active");
      $contents
        .hide()
        .eq($index)
        .show();
      renderData($index);
    });
  }

  /**
   * 点击菜单后渲染数据
   * 当点击口语名词的时候 还原 oralCurrentIndex 的值为1  然后显示第一栏 个人的导航和内容
   * 当点击个人管理的时候 ，显示个人常用管理  隐藏新增个人常用管理
   */
  function renderData (i) {
    switch (i) {
      case 0:
        // 显示角色下拉框
        showRoleSelect();
        break;
      case 1:
        // 还原 oralCurrentIndex 的值为1
        oralCurrentIndex = 1;
        currentOlarRouter = olarRouter.person;
        var $subItems = $(".oral-manage-container .sub-nav-item");
        var $subContents = $(".oral-manage-container .sub-content");
        //  导航显示第一个
        $subItems
          .removeClass("sub-nav-item-active")
          .eq(0)
          .addClass("sub-nav-item-active");
        //  内容显示第一个
        $subContents
          .hide()
          .eq(0)
          .show();
        // 显示口语名词列表 隐藏新增内容
        $(".oral-content").show();
        $(".oral-content-add").hide();
        showPersonTable();
        break;
      case 2:
        var $personFirst = $(".person-first"),
          $personSecond = $(".person-second");
        $personFirst.show();
        $personSecond.hide();
        $(".person-first .search-value").val('');
        showpersonManageTable('');
        break;
      default:
        break;
    }
  }

  /**渲染表格 */
  function renderTable (cId, tId, data) {
    $("#" + cId).html(template($("#table-type-" + tId).html(), data));
  }

  /** 弹框按钮确定和取消*/
  function clickButton (success, cancel) {
    $("#mask .sure-btn").off();
    $("#mask .sure-btn").on("click", function () {
      success();
    });
    $("#mask .cancel-btn").off();
    $("#mask .cancel-btn").on("click", function () {
      $(".mask").hide();
      cancel();
    });
    $("#mask .alert-close").off();
    $("#mask .alert-close").on("click", function () {
      $(".mask").hide();
    });
  }

  // 删除二次提示
  function deleteTips (tipMsg, success, type, error) {
    $("#mask").html(
      template($("#alert-component").html(), {
        type: type || "error",
        tipMsg: tipMsg,
        showDefaultAlert: true
      })
    );
    clickButton(success, error);
  }

  /**
   * 我的弹框
   */
  function myAlert (tipMsg, custom) {
    $("#mask-alert").html(
      template($("#error-alert").html(), {
        tipMsg: tipMsg,
        custom: custom
      })
    );
    $("#mask-alert .sure-btn").on("click", function () {
      $("#mask-alert .mask").hide();
    });
  }
  /**
   * ie12才开始支持trim 方法，自定义trim
   * 去除前后空格
   * @param {trm} options 
   */
  function myTrim (x) {
    return x.replace(/^\s+|\s+$/gm, '');
  }

  /**
   * 关于分页的注意事项
   *  添加分页步骤
   * 1、请求数据
   * 2、渲染表格
   * 3、添加分页
   * 4、添加事件监听
   * ** 注意要将请求分离出啦， 参数有调用者传递进去
   * 创建分页
   * options
   * @param {*} wrapId  容器id
   * @param {*} total  总共条数
   * @param {*} currentPage  当前页数
   * @param {*} callback  点击后的回调
   */
  function createPage (options) {
    // 创建分页
    var obj = {
      wrapid: options.wrapId, //页面显示分页器容器id
      total: options.total, //总条数
      pagesize: pageSize, //每页显示10条
      currentPage: options.currentPage, //当前页
      btnCount: 5, // 显示按钮最大的数目
      onPagechange: function (current) {
        options.callback(current);
      }
    };
    // 移除当前元素的所有事件
    $("#" + options.wrapId).off();
    pagination.init(obj);
    if (options.total > 0) {
      $("#" + options.wrapId).show();
    }
  }
  /**下拉选择添加事件 */
  function selectAddEvent (container, cb) {
    var $box = $("." + container + " .select-custom .select-box");
    var $text = $box.find(".text");
    var $selectBox = $box.find(".select-option");
    var $options = $box.find(".option");
    $box.off();
    $options.off();
    $box.on("click", function (event) {
      $selectBox.show();
      event.stopPropagation();
    });
    $options.on("click", function () {
      $text.text($(this).text());
      setTimeout(function () {
        $selectBox.hide();
      });
      if (cb) {
        cb($(this).index());
      }
    });
    $(document).on("click", function () {
      $selectBox.hide();
    });
  }
  /**科室信息的获取 */
  function getCenterInfo (centerInfo) {
    request.post(
      userRouter.queryCenterInfo, {},
      function (data) {
        centerInfo(data);
      },
      function (err) { }
    );
  }

  /**---------------------------角色权限管理 start----------------------————-------------- */

  /**角色权限管理下拉框 */
  function showRoleSelect () {
    getCenterInfo(function (data) {
      var list = [].concat({
        centerName: local.all,
        centerNo: ""
      },
        data
      );
      // 默认显示第一个
      $(".role-manage-container .select-custom").html(
        template($("#select-custom").html(), {
          select: {
            list: list,
            centerNo: list[0].centerNo,
            text: local.selectCategory
          }
        })
      );
      $('.role-manage-container .input').val('');
      showRoleTable();
      // 为下拉列表添加事件 设置centerNo的值
      selectAddEvent("role-manage-container", function (index) {
        var $centerNo = $(".role-manage-container .center-no");
        $centerNo.text(list[index].centerNo);
      });
    });
  }

  /**
   * 角色管理请求列表
   * @param  options
   * currentPage 当前页
   * wrapId  表格的分页容器id
   * callback  分页后的回调
   */
  function requestRoleTable (options) {
    // 请求的时候进行判断
    util.changeInput(typeInput.orleInput);
    request.post(
      userRouter.queryPage, {
      keyWord: options.keyWord,
      centerNo: options.centerNo,
      pageNum: options.currentPage,
      pageSize: pageSize
    },
      function (res) {
        // 渲染表格
        renderTable("role-table", "1", {
          list: res.data,
          total: res.totalCount
        });
        if (res.data.length === 0) {
          $("#" + options.wrapId).hide();
          $('.role-no-data').show();
        } else {
          $("#" + options.wrapId).show();
          $('.role-no-data').hide();
        }
        // 创建分页
        if (options.firstRequest) {
          createPage({
            wrapId: options.wrapId,
            currentPage: options.currentPage,
            total: res.totalCount,
            callback: options.callback
          });
        }
        // 列表渲染完成进行事件绑定
        var $remove = $("#role-table .remove-img");
        $remove.off();
        $remove.on("click", function () {
          var index = $remove.index(this);
          deleteTips(
            local.sureToRemove,
            function () {
              request.delete(
                userRouter.del, {
                userId: res.data[index].userId
              },
                function () {
                  $(".mask").hide();
                  showRoleTable();
                }
              );
            },
            "warn",
            function () { }
          );
        });
      }
    );
  }
  /**角色管理 显示当前的表格 */
  function showRoleTable (currentPage) {
    var keyWord = myTrim($(".role-manage-container .input").val());
    var centerNo = $(".role-manage-container .center-no").text();
    requestRoleTable({
      firstRequest: true,
      wrapId: "role-foot",
      keyWord: keyWord,
      centerNo: centerNo,
      currentPage: currentPage || 1,
      callback: function (current) {
        requestRoleTable({
          wrapId: "role-foot",
          keyWord: keyWord,
          centerNo: centerNo,
          currentPage: current
        });
      }
    });
  }
  /**角色管理点击搜索 */
  $(".role-manage-container .search-img").on("click", function () {
    showRoleTable();
  });

  /** 新增管理员 角色管理 新增*/
  $(".role-manage-container .add-btn").on("click", function () {
    $("#mask").html(
      template($("#alert-component").html(), {
        showContentType: 3,
        showDefaultAlert: false,
        roleCustom: "role-box",
        title: local.addSystemAdmin
      })
    );
    // placeholder兼容处理
    util.changeInput(typeInput.orleAddInput);
    var $searchBtn = $(".role-content .role-search");
    var userInfo = null;
    //  角色管理 搜索按钮
    $searchBtn.off();
    $searchBtn.on("click", function () {
      userInfo = null;
      var inputValue = $(".role-content .role-input").val();
      if (!inputValue) {
        myAlert(local.pleaseInputId, 'custom-mask');
        return;
      }
      request.post(
        userRouter.queryOrgUser, {
        username: inputValue
      },
        function (result) {
          $(".role-table tbody .role-body-tr").eq(0).siblings('.role-body-tr').remove();
          $.each(result, function (i, v) {
            var tr = $(".role-content .role-body-tr")
              .clone(true)
              .get(0);
            var $tr = $(tr);
            $tr
              .find(".user-id")
              .text(v.employeesNo);
            $tr
              .find(".user-id")
              .attr('title', v.employeesNo);
            $tr
              .find(".user-name")
              .text(v.userName);
            $tr
              .find(".center-name")
              .text(v.centerName);
            $tr
              .find(".icon")
              .removeClass("add-icon");
            $(".role-table tbody").append(tr);
          });
          var $body = $(".role-table .role-body-tr");
          if ($body.length > 1) {
            $(".role-table .role-body-tr")
              .eq(0)
              .remove();
          }
          // 选择角色的按钮
          $(".role-content .role-body-tr").on("click", function () {
            var index = $(this).index();
            userInfo = result[index - 1];
            $(this)
              .find(".icon")
              .addClass("add-icon")
              .parent()
              .parent()
              .siblings()
              .find(".icon")
              .removeClass("add-icon");
          });
        }
      );
    });
    clickButton(
      function () {
        if (!userInfo) {
          myAlert(local.pleaseSearchUser, 'custom-mask');
          return;
        }
        request.post(userRouter.addSysUser, userInfo, function (res) {
          showRoleTable();
          $(".mask").hide();
        });
      },
      function () { }
    );
  });

  /**---------------------------角色权限管理 end------------------——————------------------ */

  /**---------------------------口语名词检索管理 start------------------------------------ */
  /** 科室下拉列表的渲染
   *
   * 专科的选择，
   * 这里有几种情况
   *  1、新增的时候
   *  2、编辑的时候
   *  3、列表显示的时候
   *  isAdd是否是添加 、编辑
   *   centerNo 是否有科室
   *   options 判断是否有值
   */
  function specialtySelect (options) {
    var options = options || {};
    var centerNo = '';
    var centerName = '';
    getCenterInfo(function (data) {
      var list = [].concat({
        centerName: local.all,
        centerNo: ""
      },
        data
      );
      // 区分不同的下拉框， 新增时候的下拉框 在类名 oral-zk下  非新增select-specialty
      var container = options.isAdd ? "oral-zk" : "select-specialty";
      // 添加 编辑
      if (options.isAdd) {
        list = data;
        centerNo = options.centerNo;
        centerName = options.centerName;
      } else {
        // 口语列表
        centerName = list[0].centerName;
        centerNo = list[0].centerNo;
      }
      // 渲染下拉列表
      $("." + container + " .select-custom").html(
        template($("#select-custom").html(), {
          select: {
            list: list,
            centerNo: centerNo,
            text: centerName
          }
        })
      );
      // 渲染之后进行判断是否能够进行输入
      checkClickSearch();
      // 为下拉列表添加事件
      selectAddEvent(container, function (index) {
        var $centerNo = $("." + container + " .center-no");
        $centerNo.text(list[index].centerNo);
        // 渲染之后进行判断是否能够进行输入
        checkClickSearch();
        if (!options.isAdd) {
          showSpecialtyTable();
        }
      });
    });
  }
  /**判断是否口语进行点击查询 */
  function checkClickSearch () {
    if (oralCurrentIndex === 2) {
      if ($('.oral-zk .center-no').text()) {
        $('.add-search-box .input').attr('disabled', false);
        $('.add-search-box .search-img').removeClass('no-allow');
      } else {
        $('.add-search-box .input').attr('disabled', true);
        $('.add-search-box .search-img').addClass('no-allow');
      }
    } else {
      $('.add-search-box .input').attr('disabled', false);
      $('.add-search-box .search-img').removeClass('no-allow');
    }
  }

  /**口语名词次级导航 */
  function subNavChange () {
    var $subItems = $(".oral-manage-container .sub-nav-item");
    var $subContents = $(".oral-manage-container .sub-content");
    $subItems.on("click", function () {
      var $index = $(this).index();
      oralCurrentIndex = $index + 1;
      // 此时判断当前的口语名词路由
      currentOlarRouter =
        oralCurrentIndex === 1 ? olarRouter.person : olarRouter.other;
      $subItems
        .removeClass("sub-nav-item-active")
        .eq($index)
        .addClass("sub-nav-item-active");
      $subContents
        .hide()
        .eq($index)
        .show();
      switch ($index) {
        case 0:
          showPersonTable();
          break;
        case 1:
          // 还原下拉框 搜索全部
          specialtySelect();
          $(".select-specialty .center-no").text('');
          showSpecialtyTable();
          break;
        case 2:
          showWholeTable();
          break;
        default:
          break;
      }
    });
  }

  /**
   * 渲染口语表格增加事件监听
   * showSpecialty 显示科别
   * @param {表格id} tableId
   * @param {表格数据} data
   * @param {表格总数} total
   */
  function renderTableAddEventListen (options) {
    // 渲染表格
    renderTable(options.tableId, "2", {
      list: options.data,
      total: options.total,
      showSearchColumn: true,
      showSpecialty: oralCurrentIndex === 2
    });
    // 列表渲染完成绑定事件
    var $edit = $("#" + options.tableId + " .edit-icon");
    var $delete = $("#" + options.tableId + " .delete-icon");
    var res = {
      data: options.data,
      total: options.total
    };
    editAndDelete($edit, $delete, res);
  }

  // 请求数据
  /**
   *
   * @param {所需参数} options
   * currentPage 当前页
   * wrapId 分页容器id
   * callback 分页的回调
   */
  function requestOralData (options) {
    var oralData = [];
    var currentTypes = ["person", "specialty", "whole"];
    oralCurrentPage = options.currentPage;
    // 请求之前先清空表格
    renderTable("oral-" + currentTypes[oralCurrentIndex - 1] + "-table", "2", {
      list: [],
      total: 0,
      showSearchColumn: true,
      showSpecialty: oralCurrentIndex === 2
    });
    $("#" + options.wrapId).hide();
    request.post(
      currentOlarRouter.queryPage, {
      centerNo: options.centerNo,
      centerNoType: oralCurrentIndex,
      pageNum: options.currentPage,
      pageSize: pageSize
    },
      function (res) {
        // 处理请求的数据
        $.each(res.data, function (i, v) {
          oralData.push({
            wordIds: v.wordIds,
            icdCode: v.icdCode,
            enName: v.enName,
            cnName: v.cnName,
            centerNo: v.centerNo,
            centerName: v.centerName,
            words: v.words,
            showEdit: true,
            showDelete: true
          });
        });
        // 根据类型渲染表格
        renderTableAddEventListen({
          tableId: "oral-" + currentTypes[oralCurrentIndex - 1] + "-table",
          data: oralData,
          total: res.totalCount
        });
        if (oralData.length === 0) {
          $("#" + options.wrapId).hide();
          $('.oral-' + currentTypes[oralCurrentIndex - 1] + '-no-data').show();
        } else {
          $("#" + options.wrapId).show();
          $('.oral-' + currentTypes[oralCurrentIndex - 1] + '-no-data').hide();
        }
        // 创建分页
        if (options.firstRequest) {
          createPage({
            wrapId: options.wrapId,
            total: res.totalCount,
            currentPage: options.currentPage,
            callback: options.callback
          });
        }
      }
    );
  }
  /**口语名词 编辑口语名词 列表的编辑和删除 */
  function editAndDelete ($edit, $delete, res) {
    // 编辑
    $edit.on("click", function () {
      var index = $edit.index(this);
      wordIds = res.data[index].wordIds;
      oralEidtShow(res.data[index]);
    });
    // 删除
    $delete.on("click", function () {
      var index = $delete.index(this);
      deleteTips(local.sureToDeleteNon, function () {
        request.delete(
          currentOlarRouter.del, {
          ids: res.data[index].wordIds.split(",")
        },
          function () {
            $(".mask").hide();
            refreshTable();
          }
        );
      }, "warn");
    });
  }
  /**口语名词 个人 */
  function showPersonTable (currentPage) {
    requestOralData({
      currentPage: currentPage || 1,
      wrapId: "oral-person-foot",
      firstRequest: true,
      callback: function (current) {
        requestOralData({
          wrapId: "oral-person-foot",
          currentPage: current
        });
      }
    });
  }
  /**口语名词 专科*/
  function showSpecialtyTable (currentPage) {
    // var centerNo = isAdd ? "" : $(".select-specialty .center-no").text();
    var centerNo = $(".select-specialty .center-no").text();
    requestOralData({
      currentPage: currentPage || 1,
      wrapId: "oral-specialty-foot",
      firstRequest: true,
      centerNo: centerNo,
      callback: function (current) {
        requestOralData({
          currentPage: current,
          wrapId: "oral-specialty-foot",
          centerNo: centerNo
        });
      }
    });
  }

  /**口语名词 全院 */
  function showWholeTable (currentPage) {
    requestOralData({
      currentPage: currentPage || 1,
      wrapId: "oral-whole-foot",
      firstRequest: true,
      callback: function (current) {
        requestOralData({
          wrapId: "oral-whole-foot",
          currentPage: current
        });
      }
    });
  }
  /**口语名词的显示 */
  function showText (title, isEdit) {
    $(".oral-content").hide();
    $(".oral-content-add").show();
    $(".is-zk").hide();
    $(".oral-content-add  .text-1").text(title);
    clearEditData();
    $(".oral-content-add  .text-3").show();
    if (oralCurrentIndex === 1) {
      $(".oral-content-add  .text-2").text(local.person);
      $(".oral-content-add  .text-4").text(userInfo.centerName);
      $(".oral-other ").show();
    } else if (oralCurrentIndex === 2) {
      $(".oral-content-add  .text-2").text(local.specialized);
      $(".oral-zk ").show();
      if (!isEdit) {
        specialtySelect({
          isAdd: true,
          centerName: local.selectSpecialized,
          centerNo: ''
        });
      }
    } else {
      $(".oral-content-add  .text-2").text(local.whole);
      $(".oral-content-add  .text-3").hide();
      $(".oral-content-add  .text-4").text("");
      $(".oral-other").show();
    }
    // 对placeholder兼容处理
    util.changeInput(typeInput.oralAddInput);
    util.handleMoreInput();
  }
  /**清空回显的数据 还原数据 */
  function clearEditData () {
    checkClickSearch();
    renderTable("oral-search-table", "2", {
      list: [],
      total: 0,
      showSearchColumn: false,
      showSpecialty: false
    });
    oralAddNum = 1;
    $(".oral-content-add .search-input").val("");
    var box = $(".add-box .add-key-box")
      .clone(true)
      .get(0);
    var $box = $(box);
    $box.find(".num").text(1);
    $box.find(".input").val("");
    $(".add-box")
      .empty()
      .append($box);
  }
  /**编辑回显 */
  function oralEidtShow (data) {
    showText(local.editCategory, true);
    var searchData = [];
    searchData.push({
      icdCode: data.icdCode,
      enName: data.enName,
      cnName: data.cnName,
      showDelete: true
    });
    // 专科要进行下拉框的回显
    specialtySelect({
      isAdd: true,
      centerNo: data.centerNo,
      centerName: data.centerName
    });
    // 渲染表格
    renderTable("oral-search-table", "2", {
      list: searchData,
      total: searchData.length,
      showSearchColumn: false,
      showSpecialty: false
    });
    // 搜索口语名词表格删除图标
    oralSearchDelete();
    var editWords = data.words.split(",");
    oralAddNum = editWords.length || 1;
    $.each(editWords, function (i, v) {
      var box = $(".add-box .add-key-box")
        .clone(true)
        .get(0);
      var $box = $(box);
      $box.find(".num").text(i + 1);
      $box.find(".input").val(v);
      $(".add-box").append($box);
    });
    $(".add-box .add-key-box")
      .eq(0)
      .remove();
    // 对placeholder兼容处理
    util.changeInput(typeInput.oralAddInput);
    util.handleMoreInput();
  }
  /**请求搜寻的口语列表 */

  var showCheck = "";
  function requestSearchList (options) {
    var searchData = [];
    request.post(
      smartRouter.querySmartWordCode, {
      type: oralCurrentIndex,
      keyWord: options.inputWords,
      pageNum: options.current,
      pageSize: pageSize,
      centerNo: $('.oral-zk .center-no').text()
    },
      function (res) {
        if (res.data.length === 0) {
          myAlert(local.codeSearchNo);
          return
        }
        if (options.firstRequest) {
          // 渲染表格弹框
          $("#mask").html(template($("#table-alert").html()));
          $(".alert-content .close-black").on("click", function () {
            $(".mask").hide();
          });
        }
        $.each(res.data, function (i, v) {
          searchData.push({
            icdCode: v.icdCode,
            enName: v.enName,
            cnName: v.cnName,
            wordType: v.wordType,
            showIcon: options.showIcon,

          });
        });
        // 渲染表格
        renderTable(options.id, "2", {
          list: searchData,
          total: res.totalCount,
          showSearchColumn: false,
          showSpecialty: false
        });
        //  判断是否查到数据
        if (searchData.length === 0) {
          $("#" + options.wrapId).hide();
          $('.' + options.wrapId + '-no-data').show();
        } else {
          $("#" + options.wrapId).show();
          $('.' + options.wrapId + '-no-data').hide();
        }
        // 创建分页
        // 如果第一次请求就创建分页
        if (options.firstRequest) {
          createPage({
            wrapId: options.wrapId,
            total: res.totalCount,
            currentPage: options.current,
            callback: options.callback
          });
        }
        //  添加事件监听
        var $tr = $(".table-mask-alert .table-tr");
        $tr.off();
        $tr.on("click", function () {
          var index = $tr.index(this);
          var v = searchData[index];
          var list = [];
          showCheck = v.icdCode;
          if (v.wordType) {
            myAlert(local.recordExists)
            return
          }
          $(this)
            .find(".img-icon")
            .addClass("add-icon")
            .parent()
            .parent()
            .siblings()
            .find(".img-icon")
            .removeClass("add-icon");
          list.push({
            icdCode: v.icdCode,
            enName: v.enName,
            cnName: v.cnName,
            showDelete: true
          });
          renderTable("oral-search-table", "2", {
            list: list,
            total: list.length,
            showSearchColumn: false,
            showSpecialty: false,
            showTool: 'hide'
          });

          // 搜索口语名词表格删除图标
          oralSearchDelete();
        });
        //修复分页跳转后当前所选被重新渲染抹去的问题
        // console.log(showCheck);
        $.each(res.data, function (i, v) {
          if (v.icdCode == showCheck) {
            $tr.eq(i).trigger("click");
          }
        })
      }
    );
  }

  /**口语搜索名词删除事件 */
  function oralSearchDelete () {
    $('.oral-search-table .delete-icon').off();
    $('.oral-search-table .delete-icon').on('click', function () {
      renderTable("oral-search-table", "2", {
        list: [],
        total: 0,
        showSearchColumn: false,
        showSpecialty: false
      });
    })
  }
  /**口语名词 新增名词 */
  $(".oral-manage-container .add-name").on("click", function () {
    // 对palceholder进行兼容
    util.changeInput(typeInput.oralAddInput);
    showText(local.addCategory);
  });

  /**新增口语名词  取消 */
  $(".oral-content-add .add-cancel").on("click", function () {
    clearEditData();
    $(".oral-content").hide();
    $(".oral-content-list").show();
    refreshTable(oralCurrentPage);
  });

  /**新增口语名词  确定 */
  /**口语名词 点击弹框确定或取消按钮 */
  $(".oral-content-add .add-sure").on("click", function () {
    var words = [];
    var icdCode = $("#oral-search-table .td-code").text();
    $(".add-box .add-key-box").each(function (i, v) {
      var inputValue = $(v)
        .find(".input")
        .val();
      var index = $.inArray(inputValue, words);
      if (inputValue && index === -1) {
        words.push(
          $(v)
            .find(".input")
            .val()
        );
      }
    });

    if (!$('.oral-zk .center-no').text() && oralCurrentIndex === 2) {
      myAlert(local.pleaseSelectCategory);
      return
    }

    if (!icdCode || words.length === 0) {
      myAlert(local.inputNotComplete);
      return;
    }
    if (util.hasSpecialChar(words)) {
      myAlert(local.keyWordLimit);
      return
    }
    if (!wordIds) {
      requestAdd(icdCode, words);
    } else {
      requestEdit(icdCode, words);
    }
  });
  /**新增口语名词
   *  搜索
   * 1、 显示弹框
   * 2、 渲染表格
   * 3、 增加分页
   * 4、 添加点击事件
   * 5、 存取点击后的数据
   * 6、 点击关闭
   * 7、将数据渲染至页面表格
   * 8、 点击 添加
   *
   * */
  $(".oral-content-add .add-search-box .search-img").on("click", function () {
    // 判断是否是科室新增
    if (oralCurrentIndex === 2 && !$('.oral-zk .center-no').text()) {
      return
    }
    if (!$(".add-search-box .search-input").val()) {
      request.myAlert(local.pleaseInputIcd);
      return;
    }
    // 渲染表格
    requestSearchList({
      inputWords: $(".oral-content-add .search-input").val(),
      showIcon: true,
      id: "table-mask-alert",
      wrapId: "table-alert-foot",
      current: 1,
      firstRequest: true,
      callback: function (current) {
        requestSearchList({
          inputWords: $(".oral-content-add .search-input").val(),
          showIcon: true,
          id: "table-mask-alert",
          wrapId: "table-alert-foot",
          current: current
        });
      }
    });
  });
  /**点击新增编辑名词弹框加号按钮 */
  $(".add-btn-img").on("click", function () {
    if (oralAddNum >= 5) {
      myAlert(local.upToFive);
      return;
    }
    oralAddNum++;
    var box = $(".add-key-box")
      .clone(true)
      .get(0);
    $(".add-box").append(box);
    $(box)
      .find(".num")
      .text(oralAddNum);
    $(box)
      .find(".input")
      .val("");
    // 对placeholder兼容处理
    util.handleMoreInput();
  });
  /**删除 */
  $(".add-box .close-btn").on("click", function () {
    if (oralAddNum <= 1) {
      myAlert(local.lessLeastOne);
      return;
    }
    oralAddNum--;
    $(this)
      .parent()
      .remove();
    $(".add-box .add-key-box").each(function (i, v) {
      $(v)
        .find(".num")
        .text(i + 1);
    });
    // 对placeholder兼容处理
    util.handleMoreInput();
  });
  /** 口语名词
   *  增加口语名词请求
   *
   * 个人的新增   olarRouter.addPersonal
   * 专科和全院新增 olarRouter.add
   *
   * */
  function requestAdd (icdCode, words) {
    request.post(
      currentOlarRouter.add, {
      centerNo: $(".oral-zk .center-no").text(),
      centerNoType: oralCurrentIndex,
      icdCode: icdCode,
      words: words
    },
      function () {
        // $(".select-specialty .text").text('全部');
        refreshTable();
      },
      function (err) { }
    );
  }
  /**口语名词  编辑口语名词 */
  function requestEdit (icdCode, words) {
    request.put(
      currentOlarRouter.update, {
      centerNo: $(".oral-zk .center-no").text(),
      centerNoType: oralCurrentIndex,
      icdCode: icdCode,
      words: words,
      wordIds: wordIds
    },
      function () {
        wordIds = null;
        // $(".select-specialty .text").text('全部');
        refreshTable(oralCurrentPage);
      },
      function (err) { }
    );
  }
  /**口语名词 刷新表格 */
  function refreshTable (currentPage) {
    clearEditData();
    $(".oral-content").hide();
    $(".oral-content-list").show();
    if (oralCurrentIndex === 1) {
      showPersonTable(currentPage);
    } else if (oralCurrentIndex === 2) {
      showSpecialtyTable(currentPage);
    } else {
      showWholeTable(currentPage);
    }
  }
  /**---------------------------口语名词检索管理 end------------------------------------ */

  /**---------------------------个人常用码管理 start------------------------------------ */

  /**
   * 请求个人管理列表数据
   * @param options
   * @type Object    参数类型
   * @property inputWords "K02.9" 输入关键字
   * @property showDelete     显示删除图标
   * @property showCollection  显示收藏图标
   * @property id    表格的id
   * @property router 服务地址
   * @property type  类型 新增列表需要的参数
   * @property current 当前页
   *
   * 表格的渲染分为4个步骤
   * 1、请求数据
   * 2、渲染表格
   * 3、创建分页
   * 4、添加事件监听
   */
  function personRequest (options) {
    // 请求的时候进行判断
    if (options.type === 2) {
      util.changeInput(typeInput.personAddInput);
    } else {
      util.changeInput(typeInput.personInput);
    }
    var personData = [];
    // 请求数据
    request.post(
      options.router, {
      inputWords: options.inputWords,
      type: options.type,
      pageNum: options.current,
      pageSize: pageSize
    },
      function (res) {
        $.each(res.data, function (i, v) {
          personData.push({
            icdCode: v.icdCode,
            enName: v.enName,
            cnName: v.cnName,
            codeType: v.codeType,
            showDelete: options.showDelete,
            showCollection: options.showCollection
          });
        });

        // 渲染表格
        renderTable(options.id, "2", {
          list: personData,
          total: res.totalCount,
          showSearchColumn: false,
          showSpecialty: false
        });
        if (personData.length === 0) {
          $("#" + options.wrapId).hide();
          $('.' + options.wrapId + '-no-data').show();
        } else {
          $("#" + options.wrapId).show();
          $('.' + options.wrapId + '-no-data').hide();
        }
        // 创建分页
        // 如果分页容器id存在就创建分页
        if (options.firstRequest) {
          createPage({
            wrapId: options.wrapId,
            total: res.totalCount,
            currentPage: options.current,
            callback: options.callback
          });
        }
        // 渲染完成后进行事件监听
        if (options.type === 2) {
          personColletion(res, options.inputWords, options.current);
        } else {
          personDelete(res, options.current);
        }
      },
      function (err) { }
    );
  }

  // 删除个人收藏
  function personDelete (res, current) {
    var $delete = $("#person-manage-table .delete-icon");
    $delete.off();
    $delete.on("click", function () {
      var index = $delete.index(this);
      var icdCode = res.data[index].icdCode;
      deleteTips(local.sureToDeleteCode, function () {
        request.delete(
          codeRouter.del, {
          icdCode: icdCode
        },
          function () {
            $(".mask").hide();
            showpersonManageTable(
              $(".person-first .search-value").val());
          },
          function (err) { }
        );
      }, "warn");
    });
  }
  // 进行收藏
  function personColletion (res, inputValue, current) {
    var $collection = $("#person-add-table .collection-icon");
    $collection.off();
    $collection.on("click", function () {
      var index = $collection.index(this);
      var icdCode = res.data[index].icdCode;
      // 如果已经收藏了就不进行收藏
      if ($(this).hasClass('collection-icon-active')) {
        return
      }

      request.post(
        codeRouter.add, {
        icdCode: icdCode
      },
        function () {
          $collection.eq(index).addClass("collection-icon-active");
          // showpersonAddTable(inputValue, current);
        },
        function (err) { }
      );
    });
  }
  /**个人常用码 管理列表 */
  function showpersonManageTable (inputWords, currentPage) {
    var inputWords = myTrim(inputWords);
    personRequest({
      inputWords: inputWords,
      showDelete: true,
      id: "person-manage-table",
      router: codeRouter.queryPage,
      wrapId: "person-manage-foot",
      current: currentPage || 1,
      firstRequest: true,
      callback: function (current) {
        personRequest({
          inputWords: inputWords,
          showDelete: true,
          id: "person-manage-table",
          router: codeRouter.queryPage,
          wrapId: "person-manage-foot",
          current: current
        });
      }
    });
  }
  /** 个人常用码 新增个人常用码列表 */
  function showpersonAddTable (inputWords, currentPage) {
    var inputWords = myTrim(inputWords);
    personRequest({
      inputWords: inputWords,
      showCollection: true,
      type: 2,
      id: "person-add-table",
      router: smartRouter.querySmartCode,
      wrapId: "person-add-foot",
      current: currentPage || 1,
      firstRequest: true,
      callback: function (current) {
        personRequest({
          inputWords: inputWords,
          showCollection: true,
          id: "person-add-table",
          type: 2,
          router: smartRouter.querySmartCode,
          wrapId: "person-add-foot",
          current: current
        });
      }
    });
  }

  /**个人常用管理切换显示列表 */
  function personManage () {
    var $personFirst = $(".person-first"),
      $personSecond = $(".person-second");
    //  新增按钮事件
    $(".person-add").on("click", function () {
      $personFirst.hide();
      $personSecond.show();
      // 新增个人列表， 先将搜索词清空，在将列表清空
      $(".person-second .search-value").val("");
      renderTable("person-add-table", "2", {
        list: [],
        total: 0,
        showSearchColumn: false,
        showSpecialty: false
      });
      // placeholder兼容处理
      util.changeInput(typeInput.personAddInput);
      $("#person-add-foot").hide();
      $('.person-add-foot-no-data').show();
    });
    //  新增代码管理返回按钮事件
    $(".person-back").on("click", function () {
      $personFirst.show();
      $personSecond.hide();
      $(".person-first .search-value").val('')
      showpersonManageTable('');
    });
    //个人常用管理
    $(".person-first .search-btn").on("click", function () {
      showpersonManageTable($(".person-first .search-value").val());
    });
    // 新增个人常用管理
    $(".person-second .search-btn").on("click", function () {
      showpersonAddTable($(".person-second .search-value").val());
    });
  }

  /**---------------------------个人常用码管理 end------------------------------------ */

  /**执行入口 */
  function init (tpl) {
    template = tpl;
    // 退出登录
    onQuitIcon();
    // 权限判断
    checkAuth();
    // 显示角色和专科下拉框
    specialtySelect();
    // 内容高度设置
    setContentHeight();
    // 菜单大小显示切换
    navChange();
    // 口语名词次级导航
    subNavChange();
    // 个人常用管理
    personManage();
  }

  /**模块导出的方法 */
  return {
    init: init,
    navContentChange: navContentChange,
    clickButton: clickButton,
    myAlert: myAlert,
    selectAddEvent: selectAddEvent,
    getCenterInfo: getCenterInfo,
    refreshTable: refreshTable
  };
})(require("jquery"));